import { auth } from "@/lib/auth";
import { MongoClient } from "mongodb";

const EXTERNAL_API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
const REQUIRED_PROMPTS = 3;
const REQUIRED_REVIEWS = 3;

export async function POST(request) {
  // 1. Verify the user is authenticated via Better Auth session
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user?.id) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  // Already verified — short-circuit
  if (session.user.isVerified) {
    return Response.json({ success: true, isVerified: true, alreadyVerified: true });
  }

  // 2. Get the server_token from the request body
  //    (the token the frontend uses to call the external backend)
  let token;
  try {
    const body = await request.json();
    token = body?.token;
  } catch {
    return Response.json({ message: "Invalid request body" }, { status: 400 });
  }

  if (!token) {
    return Response.json({ message: "Missing auth token" }, { status: 400 });
  }

  // 3. Fetch the user's prompts and reviews from the external backend
  //    using their server_token — so counts are verified server-side
  try {
    const [promptsRes, reviewsRes] = await Promise.all([
      fetch(`${EXTERNAL_API}/api/my-prompts`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }),
      fetch(`${EXTERNAL_API}/api/my-reviews`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }),
    ]);

    if (!promptsRes.ok || !reviewsRes.ok) {
      return Response.json(
        { message: "Could not fetch your activity. Please try again." },
        { status: 502 }
      );
    }

    const [promptsData, reviewsData] = await Promise.all([
      promptsRes.json(),
      reviewsRes.json(),
    ]);

    const promptCount = (promptsData.prompts || []).length;
    const reviewCount = (reviewsData.reviews || []).length;

    // 4. Check requirements
    if (promptCount < REQUIRED_PROMPTS || reviewCount < REQUIRED_REVIEWS) {
      return Response.json(
        {
          message: "Requirements not met",
          promptCount,
          reviewCount,
          required: { prompts: REQUIRED_PROMPTS, reviews: REQUIRED_REVIEWS },
        },
        { status: 400 }
      );
    }

    // 5. Requirements met — update isVerified in MongoDB
    const mongoClient = new MongoClient(process.env.MONGODB_URI);
    try {
      await mongoClient.connect();
      const db = mongoClient.db(process.env.AUTH_DB_NAME);

      // Better Auth stores users in the "user" collection with an "id" string field
      const result = await db.collection("user").updateOne(
        { id: session.user.id },
        { $set: { isVerified: true, verifiedAt: new Date().toISOString() } }
      );

      if (result.matchedCount === 0) {
        // Fallback: try by email
        await db.collection("user").updateOne(
          { email: session.user.email },
          { $set: { isVerified: true, verifiedAt: new Date().toISOString() } }
        );
      }
    } finally {
      await mongoClient.close();
    }

    return Response.json({
      success: true,
      isVerified: true,
      promptCount,
      reviewCount,
    });
  } catch (err) {
    console.error("[/api/verify]", err);
    return Response.json(
      { message: "Verification failed. Please try again." },
      { status: 500 }
    );
  }
}

// GET — returns the current verification requirements and live progress
export async function GET(request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user?.id) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  if (!token) {
    return Response.json(
      {
        required: { prompts: REQUIRED_PROMPTS, reviews: REQUIRED_REVIEWS },
        isVerified: !!session.user.isVerified,
      }
    );
  }

  try {
    const [promptsRes, reviewsRes] = await Promise.all([
      fetch(`${EXTERNAL_API}/api/my-prompts`, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      }),
      fetch(`${EXTERNAL_API}/api/my-reviews`, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      }),
    ]);

    const [promptsData, reviewsData] = await Promise.all([
      promptsRes.json(),
      reviewsRes.json(),
    ]);

    return Response.json({
      isVerified: !!session.user.isVerified,
      promptCount: (promptsData.prompts || []).length,
      reviewCount: (reviewsData.reviews || []).length,
      required: { prompts: REQUIRED_PROMPTS, reviews: REQUIRED_REVIEWS },
    });
  } catch {
    return Response.json({ message: "Failed to load progress" }, { status: 500 });
  }
}
