
export default {
  async fetch(req: Request, env: any, ctx: ExecutionContext): Promise<Response> {
    const GITHUB_TOKEN = env.GITHUB_TOKEN;
    const GITHUB_REPO = env.GITHUB_REPO;
    const GITHUB_FILE_PATH = env.GITHUB_FILE_PATH;

    const GITHUB_API_URL = `https://api.github.com/repos/${GITHUB_REPO}/contents/${GITHUB_FILE_PATH}`;
    const headers = {
      "Authorization": `token ${GITHUB_TOKEN}`,
      "Content-Type": "application/json",
      "User-Agent": "MyCustomUserAgent/1.0", // Custom User-Agent header
    };

    const EXPIRATION_TIME = 7 * 24 * 60 * 60 * 1000; // 1 week

    // Helpers
    const decodeBase64 = (str: string) => atob(str);
    const encodeBase64 = (str: string) => btoa(str);

    async function updateGitHubFile(playerName: string) {
      const res = await fetch(GITHUB_API_URL, { method: "GET", headers });
      if (!res.ok) throw new Error("Failed to fetch GitHub content");

      const contentData = await res.json();
      const currentTimestamp = Date.now();
      const expirationTimestamp = currentTimestamp + EXPIRATION_TIME;

      const playerData = { name: playerName, expiresAt: expirationTimestamp };
      let content = contentData.content ? decodeBase64(contentData.content) : "[]";
      const whitelist = JSON.parse(content);
      whitelist.push(playerData);

      const newContent = JSON.stringify(whitelist, null, 2);
      const updateRes = await fetch(GITHUB_API_URL, {
        method: "PUT",
        headers,
        body: JSON.stringify({
          message: `Add ${playerName} to whitelist`,
          content: encodeBase64(newContent),
          sha: contentData.sha,
        }),
      });

      return updateRes.json();
    }

    async function isPlayerWhitelisted(playerName: string) {
      const res = await fetch(GITHUB_API_URL, { method: "GET", headers });
      if (!res.ok) throw new Error("Failed to fetch GitHub content");

      const contentData = await res.json();
      const whitelist = JSON.parse(decodeBase64(contentData.content || "[]"));
      const now = Date.now();

      const player = whitelist.find((entry: any) => entry.name === playerName);
      if (player && player.expiresAt > now) {
        return { isWhitelisted: true, message: "Player is whitelisted" };
      }

      // Remove if expired or not found
      const updatedWhitelist = whitelist.filter((entry: any) => entry.name !== playerName);
      const newContent = JSON.stringify(updatedWhitelist, null, 2);

      await fetch(GITHUB_API_URL, {
        method: "PUT",
        headers,
        body: JSON.stringify({
          message: `Remove expired/unlisted player ${playerName}`,
          content: encodeBase64(newContent),
          sha: contentData.sha,
        }),
      });

      return { isWhitelisted: false, message: "Player is not whitelisted or expired" };
    }

    // Routing logic
    const url = new URL(req.url);

    if (req.method === "POST" && url.pathname === "/whitelist") {
      const body = await req.json();
      const playerName = body.playerName;
      if (!playerName) {
        return new Response("Player name is required", { status: 400 });
      }

      const { isWhitelisted, message } = await isPlayerWhitelisted(playerName);
      if (isWhitelisted) {
        return new Response(JSON.stringify({ status: "error", message }), {
          headers: { "Content-Type": "application/json" },
          status: 400,
        });
      }

      await updateGitHubFile(playerName);
      return new Response(JSON.stringify({ status: "success", message: "Player added" }), {
        headers: { "Content-Type": "application/json" },
        status: 200,
      });
    }

    if (req.method === "GET" && url.pathname === "/checkWhitelist") {
      const playerName = url.searchParams.get("playerName");
      if (!playerName) {
        return new Response("Player name is required", { status: 400 });
      }

      const { isWhitelisted, message } = await isPlayerWhitelisted(playerName);
      return new Response(
        JSON.stringify({ status: isWhitelisted ? "success" : "error", message }),
        {
          headers: { "Content-Type": "application/json" },
          status: isWhitelisted ? 200 : 400,
        }
      );
    }

    return new Response("Invalid request", { status: 405 });
  }
};
