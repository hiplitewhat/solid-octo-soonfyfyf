export default {
  async fetch(request, env, ctx) {
    const urls = [
      'https://foil-interesting-recess.glitch.me/health',
      'https://rift-nutritious-friction.glitch.me/',
      'https://example2.com/health'
    ];

    let results = '';

    for (const url of urls) {
      try {
        const response = await fetch(url);
        const body = await response.text();
        results += `URL: ${url}\nStatus: ${response.status}\nBody:\n${body}\n\n`;
      } catch (error) {
        results += `Failed to fetch ${url}:\n${error.message}\n\n`;
      }
    }

    return new Response(results, {
      status: 200,
      headers: { "content-type": "text/plain" }
    });
  }
};
