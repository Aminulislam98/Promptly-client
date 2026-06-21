import { auth } from "@/lib/auth";
import { MongoClient, ObjectId } from "mongodb";

const EXTERNAL_API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export async function POST(request, { params }) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user || session.user.role !== "admin") {
    return Response.json({ message: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;

  const mongoClient = new MongoClient(process.env.MONGODB_URI);
  try {
    await mongoClient.connect();
    const db = mongoClient.db(process.env.AUTH_DB_NAME || "promptly");

    // 1. Find the appeal
    const appeal = await db
      .collection("appeals")
      .findOne({ _id: new ObjectId(id) });

    if (!appeal) {
      return Response.json({ message: "Appeal not found" }, { status: 404 });
    }

    // 2. Mark appeal as approved
    await db
      .collection("appeals")
      .updateOne(
        { _id: new ObjectId(id) },
        { $set: { status: "approved", resolvedAt: new Date().toISOString() } }
      );

    // 3. Remove suspension + clear warnings from the user record.
    //    Try both "user" (Better Auth collection) and "users" (external backend).
    //    Match by userId string OR email as fallback.
    const userFilter = appeal.userId
      ? { $or: [{ id: appeal.userId }, { email: appeal.userEmail }] }
      : { email: appeal.userEmail };

    const unsuspendUpdate = {
      $set: { isSuspended: false },
      $unset: { warnings: "" },
    };

    // Better Auth "user" collection
    await db.collection("user").updateOne(userFilter, unsuspendUpdate);

    // External backend "users" collection (common name)
    await db.collection("users").updateOne(
      { $or: [{ email: appeal.userEmail }] },
      unsuspendUpdate
    );

    return Response.json({ success: true, userId: appeal.userId });
  } catch (err) {
    console.error("[/api/admin/appeals/[id]/approve]", err);
    return Response.json({ message: "Failed to approve appeal" }, { status: 500 });
  } finally {
    await mongoClient.close();
  }
}
