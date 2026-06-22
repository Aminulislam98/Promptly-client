import { auth } from "@/lib/auth";
import { MongoClient, ObjectId } from "mongodb";

async function getDb() {
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  return { db: client.db(process.env.AUTH_DB_NAME || "promptly"), client };
}

// GET: list user's collections
export async function GET(request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user?.id) return Response.json({ message: "Unauthorized" }, { status: 401 });

  const { db, client } = await getDb();
  try {
    const collections = await db
      .collection("collections")
      .find({ userId: session.user.id })
      .sort({ createdAt: -1 })
      .toArray();
    return Response.json({ collections });
  } finally {
    await client.close();
  }
}

// POST: create a new collection
export async function POST(request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user?.id) return Response.json({ message: "Unauthorized" }, { status: 401 });

  let body;
  try { body = await request.json(); } catch {
    return Response.json({ message: "Invalid body" }, { status: 400 });
  }
  const name = body?.name?.trim();
  if (!name || name.length < 1) return Response.json({ message: "Name required" }, { status: 400 });

  const { db, client } = await getDb();
  try {
    const doc = {
      userId: session.user.id,
      name,
      promptIds: [],
      createdAt: new Date().toISOString(),
    };
    const result = await db.collection("collections").insertOne(doc);
    return Response.json({ collection: { ...doc, _id: result.insertedId } }, { status: 201 });
  } finally {
    await client.close();
  }
}
