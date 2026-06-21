import { auth } from "@/lib/auth";
import { MongoClient } from "mongodb";

export async function GET(request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user || session.user.role !== "admin") {
    return Response.json({ message: "Forbidden" }, { status: 403 });
  }

  const mongoClient = new MongoClient(process.env.MONGODB_URI);
  try {
    await mongoClient.connect();
    const db = mongoClient.db(process.env.AUTH_DB_NAME || "promptly");

    const appeals = await db
      .collection("appeals")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return Response.json({
      appeals: appeals.map((a) => ({
        _id: String(a._id),
        userId: a.userId,
        userEmail: a.userEmail,
        userName: a.userName,
        message: a.message,
        status: a.status,
        createdAt: a.createdAt,
      })),
    });
  } finally {
    await mongoClient.close();
  }
}
