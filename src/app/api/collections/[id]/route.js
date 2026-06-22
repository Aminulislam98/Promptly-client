import { auth } from "@/lib/auth";
import { MongoClient, ObjectId } from "mongodb";

async function getDb() {
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  return { db: client.db(process.env.AUTH_DB_NAME || "promptly"), client };
}

// DELETE collection
export async function DELETE(request, { params }) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user?.id) return Response.json({ message: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { db, client } = await getDb();
  try {
    await db.collection("collections").deleteOne({
      _id: new ObjectId(id),
      userId: session.user.id,
    });
    return Response.json({ success: true });
  } finally {
    await client.close();
  }
}

// PATCH: add or remove a prompt from a collection
// body: { promptId, action: "add" | "remove", promptTitle?, promptThumbnail? }
export async function PATCH(request, { params }) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user?.id) return Response.json({ message: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  let body;
  try { body = await request.json(); } catch {
    return Response.json({ message: "Invalid body" }, { status: 400 });
  }

  const { promptId, action } = body || {};
  if (!promptId || !["add", "remove"].includes(action))
    return Response.json({ message: "promptId and action required" }, { status: 400 });

  const { db, client } = await getDb();
  try {
    const update =
      action === "add"
        ? { $addToSet: { promptIds: String(promptId) } }
        : { $pull: { promptIds: String(promptId) } };

    await db.collection("collections").updateOne(
      { _id: new ObjectId(id), userId: session.user.id },
      update
    );
    return Response.json({ success: true });
  } finally {
    await client.close();
  }
}
