export default {
  async fetch(request, env, ctx) {
    const url = ["https://foil-interesting-recess.glitch.me/health",
                 "https://rift-nutritious-friction.glitch.me/"];

    try {
      const start = Date.now();
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "User-Agent": "chrome",
          "Accept": "*/*",
        },
      });
      const end = Date.now();

      const body = await response.text();

      return new Response(
        `Status: ${response.status}\nTime: ${end - start} ms\nBody: ${body}`,
        { status: 200 }
      );
    } catch (err) {
      return new Response(`Fetch error: ${err.message}`, { status: 500 });
    }
  }
};
