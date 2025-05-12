export default {
  async fetch(request, env, ctx) {
    const urls = [
      'https://example1.com/',
      'https://yourapp.glitch.me/',
      'https://example2.com/health'
    ];

    for (const url of urls) {
      try {
        const response = await fetch(url);
        console.log(`Pinged ${url} — Status: ${response.status}`);
      } catch (error) {
        console.error(`Failed to ping ${url}:`, error);
      }
    }

    return new Response("Pinging complete.", {
      status: 200,
      headers: { "content-type": "text/plain" }
    });
  }
};
