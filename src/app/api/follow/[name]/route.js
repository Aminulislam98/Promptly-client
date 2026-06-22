import { auth } from "@/lib/auth";
import { MongoClient } from "mongodb";

async function getDb() {
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  return { db: client.db(process.env.AUTH_DB_NAME || "promptly"), client };
}

// GET: check if current user follows this creator + get follower count
export async function GET(request, { params }) {
  const { name } = await params;
  const creatorName = decodeURIComponent(name);
  const session = await auth.api.getSession({ headers: request.headers });

  const { db, client } = await getDb();
  try {
    const count = await db.collection("follows").countDocuments({ creatorName });
    let isFollowing = false;
    if (session?.user?.id) {
      const doc = await db.collection("follows").findOne({
        followerId: session.user.id,
        creatorName,
      });
      isFollowing = !!doc;
    }
    return Response.json({ count, isFollowing });
  } finally {
    await client.close();
  }
}

// POST: follow
export async function POST(request, { params }) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user?.id) return Response.json({ message: "Unauthorized" }, { status: 401 });

  const { name } = await params;
  const creatorName = decodeURIComponent(name);

  if (session.user.name === creatorName)
    return Response.json({ message: "Cannot follow yourself" }, { status: 400 });

  const { db, client } = await getDb();
  try {
    await db.collection("follows").updateOne(
      { followerId: session.user.id, creatorName },
      {
        $setOnInsert: {
          followerId: session.user.id,
          followerName: session.user.name,
          creatorName,
          createdAt: new Date().toISOString(),
        },
      },
      { upsert: true }
    );
    return Response.json({ success: true });
  } finally {
    await client.close();
  }
}

// DELETE: unfollow
export async function DELETE(request, { params }) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user?.id) return Response.json({ message: "Unauthorized" }, { status: 401 });

  const { name } = await params;
  const creatorName = decodeURIComponent(name);

  const { db, client } = await getDb();
  try {
    await db.collection("follows").deleteOne({ followerId: session.user.id, creatorName });
    return Response.json({ success: true });
  } finally {
    await client.close();
  }
}
