import { auth } from "@/lib/auth";
import { MongoClient, ObjectId } from "mongodb";

async function getDb() {
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  return { db: client.db(process.env.AUTH_DB_NAME || "promptly"), client };
}

export async function GET(request, { params }) {
  const { promptId } = await params;
  const { db, client } = await getDb();
  try {
    const comments = await db
      .collection("comments")
      .find({ promptId })
      .sort({ createdAt: -1 })
      .limit(100)
      .toArray();
    return Response.json({ comments });
  } finally {
    await client.close();
  }
}

export async function POST(request, { params }) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user?.id) return Response.json({ message: "Unauthorized" }, { status: 401 });

  const { promptId } = await params;
  let text;
  try {
    const body = await request.json();
    text = body?.text?.trim();
  } catch {
    return Response.json({ message: "Invalid body" }, { status: 400 });
  }
  if (!text || text.length < 2) return Response.json({ message: "Comment too short" }, { status: 400 });
  if (text.length > 1000) return Response.json({ message: "Comment too long (max 1000 chars)" }, { status: 400 });

  const { db, client } = await getDb();
  try {
    const doc = {
      promptId,
      userId: session.user.id,
      userName: session.user.name,
      userImage: session.user.image || null,
      text,
      createdAt: new Date().toISOString(),
    };
    const result = await db.collection("comments").insertOne(doc);
    return Response.json({ comment: { ...doc, _id: result.insertedId } }, { status: 201 });
  } finally {
    await client.close();
  }
}

export async function DELETE(request, { params }) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user?.id) return Response.json({ message: "Unauthorized" }, { status: 401 });

  const { promptId } = await params;
  const { searchParams } = new URL(request.url);
  const commentId = searchParams.get("commentId");
  if (!commentId) return Response.json({ message: "commentId required" }, { status: 400 });

  const { db, client } = await getDb();
  try {
    const comment = await db.collection("comments").findOne({ _id: new ObjectId(commentId) });
    if (!comment) return Response.json({ message: "Not found" }, { status: 404 });
    if (comment.userId !== session.user.id && session.user.role !== "admin")
      return Response.json({ message: "Forbidden" }, { status: 403 });
    await db.collection("comments").deleteOne({ _id: new ObjectId(commentId) });
    return Response.json({ success: true });
  } finally {
    await client.close();
  }
}
