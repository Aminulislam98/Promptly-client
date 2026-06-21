import { auth } from "@/lib/auth";
import { MongoClient, ObjectId } from "mongodb";

export async function POST(request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user?.id) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  let message;
  try {
    const body = await request.json();
    message = body?.message?.trim();
  } catch {
    return Response.json({ message: "Invalid request body" }, { status: 400 });
  }

  if (!message || message.length < 10) {
    return Response.json(
      { message: "Appeal message must be at least 10 characters." },
      { status: 400 }
    );
  }

  const mongoClient = new MongoClient(process.env.MONGODB_URI);
  try {
    await mongoClient.connect();
    const db = mongoClient.db(process.env.AUTH_DB_NAME || "promptly");

    // Only one pending appeal per user at a time
    const existing = await db.collection("appeals").findOne({
      userId: session.user.id,
      status: "pending",
    });

    if (existing) {
      return Response.json(
        { message: "You already have a pending appeal." },
        { status: 409 }
      );
    }

    await db.collection("appeals").insertOne({
      userId: session.user.id,
      userEmail: session.user.email,
      userName: session.user.name,
      message,
      status: "pending",
      createdAt: new Date().toISOString(),
    });

    return Response.json({ success: true });
  } finally {
    await mongoClient.close();
  }
}

// GET — check if the current user has a pending or approved appeal
export async function GET(request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user?.id) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  const mongoClient = new MongoClient(process.env.MONGODB_URI);
  try {
    await mongoClient.connect();
    const db = mongoClient.db(process.env.AUTH_DB_NAME || "promptly");

    const appeal = await db.collection("appeals").findOne(
      { userId: session.user.id },
      { sort: { createdAt: -1 } }
    );

    return Response.json({
      appeal: appeal
        ? {
            _id: String(appeal._id),
            status: appeal.status,
            message: appeal.message,
            createdAt: appeal.createdAt,
          }
        : null,
    });
  } finally {
    await mongoClient.close();
  }
}
