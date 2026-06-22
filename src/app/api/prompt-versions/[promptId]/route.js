import { auth } from "@/lib/auth";
import { MongoClient } from "mongodb";

async function getDb() {
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  return { db: client.db(process.env.AUTH_DB_NAME || "promptly"), client };
}

// GET: fetch stored versions for a prompt
export async function GET(request, { params }) {
  const { promptId } = await params;
  const { db, client } = await getDb();
  try {
    const versions = await db
      .collection("promptVersions")
      .find({ promptId })
      .sort({ savedAt: -1 })
      .limit(10)
      .toArray();
    return Response.json({ versions });
  } finally {
    await client.close();
  }
}

// POST: save a snapshot of the current prompt state
export async function POST(request, { params }) {
  // Must be authenticated to save snapshots (prevents anonymous spam)
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user?.id) return Response.json({ message: "Unauthorized" }, { status: 401 });

  const { promptId } = await params;
  let body;
  try { body = await request.json(); } catch {
    return Response.json({ message: "Invalid body" }, { status: 400 });
  }

  const { title, content, description } = body || {};
  if (!content) return Response.json({ message: "content required" }, { status: 400 });

  const { db, client } = await getDb();
  try {
    // Only store a new version if content differs from the most recent snapshot
    const latest = await db
      .collection("promptVersions")
      .findOne({ promptId }, { sort: { savedAt: -1 } });

    if (latest && latest.content === content) {
      return Response.json({ skipped: true });
    }

    await db.collection("promptVersions").insertOne({
      promptId,
      title,
      content,
      description,
      savedAt: new Date().toISOString(),
    });

    // Keep only the 10 most recent versions
    const all = await db
      .collection("promptVersions")
      .find({ promptId })
      .sort({ savedAt: -1 })
      .toArray();
    if (all.length > 10) {
      const toDelete = all.slice(10).map((v) => v._id);
      await db.collection("promptVersions").deleteMany({ _id: { $in: toDelete } });
    }

    return Response.json({ saved: true });
  } finally {
    await client.close();
  }
}
