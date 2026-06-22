import { auth } from "@/lib/auth";
import { MongoClient } from "mongodb";

async function getDb() {
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  return { db: client.db(process.env.AUTH_DB_NAME || "promptly"), client };
}

export async function GET(request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user?.id) return Response.json({ message: "Unauthorized" }, { status: 401 });

  const { db, client } = await getDb();
  try {
    const history = await db
      .collection("copyHistory")
      .find({ userId: session.user.id })
      .sort({ copiedAt: -1 })
      .limit(30)
      .toArray();
    return Response.json({ history });
  } finally {
    await client.close();
  }
}

export async function POST(request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user?.id) return Response.json({ message: "Unauthorized" }, { status: 401 });

  let body;
  try { body = await request.json(); } catch {
    return Response.json({ message: "Invalid body" }, { status: 400 });
  }

  const { promptId, promptTitle, promptCategory } = body || {};
  if (!promptId) return Response.json({ message: "promptId required" }, { status: 400 });

  const { db, client } = await getDb();
  try {
    // Upsert — update copiedAt if already exists, else insert
    await db.collection("copyHistory").updateOne(
      { userId: session.user.id, promptId: String(promptId) },
      {
        $set: {
          promptTitle: promptTitle || "",
          promptCategory: promptCategory || "",
          copiedAt: new Date().toISOString(),
        },
        $setOnInsert: { userId: session.user.id, promptId: String(promptId) },
      },
      { upsert: true }
    );
    return Response.json({ success: true });
  } finally {
    await client.close();
  }
}
