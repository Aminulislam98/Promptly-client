import { MongoClient } from "mongodb";

// Public endpoint — returns only safe public fields for a creator by display name
export async function GET(request, { params }) {
  const { name } = await params;
  const creatorName = decodeURIComponent(name);

  if (!creatorName) {
    return Response.json({ message: "Name required" }, { status: 400 });
  }

  const mongoClient = new MongoClient(process.env.MONGODB_URI);
  try {
    await mongoClient.connect();
    const db = mongoClient.db(process.env.AUTH_DB_NAME || "promptly");

    const user = await db.collection("user").findOne(
      { name: creatorName },
      { projection: { image: 1, isVerified: 1, name: 1, _id: 0 } }
    );

    if (!user) {
      return Response.json({ image: null, isVerified: false, name: creatorName });
    }

    return Response.json({
      name: user.name,
      image: user.image || null,
      isVerified: user.isVerified === true,
    });
  } catch (err) {
    console.error("[/api/creator-info]", err);
    return Response.json({ image: null, isVerified: false, name: creatorName });
  } finally {
    await mongoClient.close();
  }
}
