import { auth } from "@/lib/auth";
import { MongoClient } from "mongodb";

export async function GET(request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user?.id) return Response.json({ message: "Unauthorized" }, { status: 401 });

  const client = new MongoClient(process.env.MONGODB_URI);
  try {
    await client.connect();
    const db = client.db(process.env.AUTH_DB_NAME || "promptly");
    const following = await db
      .collection("follows")
      .find({ followerId: session.user.id })
      .sort({ createdAt: -1 })
      .toArray();
    return Response.json({ following });
  } finally {
    await client.close();
  }
}
