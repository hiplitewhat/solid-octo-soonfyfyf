export default {
  async scheduled(event, env, ctx) {
    const targetUrl = 'https://your-target-app.com/';

    try {
      const res = await fetch(targetUrl);
      console.log(`Pinged ${targetUrl} with status ${res.status}`);
    } catch (err) {
      console.error(`Failed to ping ${targetUrl}:`, err);
    }
  }
};
