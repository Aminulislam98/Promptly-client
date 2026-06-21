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
      promptMap[String(p._id)] = {
        title: p.title,
        category: p.category,
        _id: String(p._id),
      };
    });

    const myPromptIds = Object.keys(promptMap);

    // 3. Query the MongoDB reports collection for warned reports on user's prompts
    //    Both auth and the external backend share the same MongoDB cluster + db
    const mongoClient = new MongoClient(process.env.MONGODB_URI);
    try {
      await mongoClient.connect();
      const db = mongoClient.db(process.env.AUTH_DB_NAME || "promptly");

      // Try to match by string promptId OR ObjectId — handle both formats
      const objectIdList = myPromptIds.flatMap((id) => {
        try {
          return [new ObjectId(id)];
        } catch {
          return [];
        }
      });

      const reports = await db
        .collection("reports")
        .find({
          $and: [
            { warned: true },
            {
              $or: [
                { promptId: { $in: myPromptIds } },
                ...(objectIdList.length > 0
                  ? [{ promptId: { $in: objectIdList } }]
                  : []),
              ],
            },
          ],
        })
        .sort({ createdAt: -1 })
        .toArray();

      // Enrich each report with prompt info
      const enriched = reports.map((r) => {
        const pid = String(r.promptId);
        const promptInfo = promptMap[pid] || null;
        return {
          _id: String(r._id),
          reason: r.reason,
          description: r.description || null,
          reportedBy: r.reportedBy || "Anonymous",
          createdAt: r.createdAt,
          warned: r.warned,
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
