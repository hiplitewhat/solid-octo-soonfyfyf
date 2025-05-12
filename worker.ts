export async function scheduled(event, env, ctx) {
  const urls = [
    'https://example1.com/',
    'https://example2.com/',
    'https://yourapp.glitch.me/'
  ];

  for (const url of urls) {
    try {
      const res = await fetch(url);
      console.log(`Pinged ${url} – Status: ${res.status}`);
    } catch (err) {
      console.error(`Failed to ping ${url}`, err);
    }
  }
}
