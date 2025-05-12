export default {
  async fetch(request, env, ctx) {
    const urls = [
      'https://foil-interesting-recess.glitch.me/health',
      'https://rift-nutritious-friction.glitch.me/',
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
