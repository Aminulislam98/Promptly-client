import { auth } from "@/lib/auth";
import { MongoClient, ObjectId } from "mongodb";

const EXTERNAL_API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export async function GET(request) {
  // 1. Verify auth
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user?.id) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  if (!token) {
    return Response.json({ message: "Missing token" }, { status: 400 });
  }

  try {
    // 2. Fetch user's prompts from the external backend using their token
    const promptsRes = await fetch(`${EXTERNAL_API}/api/my-prompts`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!promptsRes.ok) {
      return Response.json(
        { message: "Could not fetch your prompts" },
        { status: 502 }
      );
    }

    const promptsData = await promptsRes.json();
    const myPrompts = promptsData.prompts || [];

    if (myPrompts.length === 0) {
      return Response.json({ reports: [], total: 0 });
    }

    // Build a map of promptId → prompt info for enrichment
    const promptMap = {};
    myPrompts.forEach((p) => {
      const id = String(p._id);
      promptMap[id] = { title: p.title, category: p.category, _id: id };
    });

    const myPromptIds = Object.keys(promptMap);

    // Convert IDs to ObjectId where possible — handle both string & ObjectId storage
    const objectIdList = myPromptIds.flatMap((id) => {
      try { return [new ObjectId(id)]; } catch { return []; }
    });

    // 3. Query MongoDB — show ALL reports on the user's prompts (not just warned)
    //    The external backend's warn action updates the user record, not the report doc,
    //    so filtering by warned:true would hide all real reports.
    const mongoClient = new MongoClient(process.env.MONGODB_URI);
    try {
      await mongoClient.connect();
      const db = mongoClient.db(process.env.AUTH_DB_NAME || "promptly");

      const query =
        objectIdList.length > 0
          ? {
              $or: [
                { promptId: { $in: myPromptIds } },
                { promptId: { $in: objectIdList } },
              ],
            }
          : { promptId: { $in: myPromptIds } };

      const reports = await db
        .collection("reports")
        .find(query)
        .sort({ createdAt: -1 })
        .toArray();

      // Enrich each report with prompt title and a human-readable status
      const enriched = reports.map((r) => {
        const pid = String(r.promptId);
        const promptInfo = promptMap[pid] || null;
        return {
          _id: String(r._id),
          reason: r.reason,
          description: r.description || null,
          reportedBy: r.reportedBy || "Anonymous",
          createdAt: r.createdAt,
          // warned may or may not be set depending on backend — default to false
          warned: r.warned === true,
          promptId: pid,
          promptTitle: promptInfo?.title || "Unknown Prompt",
          promptCategory: promptInfo?.category || null,
        };
      });

      return Response.json({ reports: enriched, total: enriched.length });
    } finally {
      await mongoClient.close();
    }
  } catch (err) {
    console.error("[/api/my-reports]", err);
    return Response.json(
      { message: "Failed to load reports" },
      { status: 500 }
    );
  }
}
