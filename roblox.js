export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  const { endpoint } = req.query;

  if (!endpoint) {
    return res.status(400).json({ error: 'Endpoint diperlukan' });
  }

  try {
    const robloxResponse = await fetch(decodeURIComponent(endpoint), {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      }
    });

    if (!robloxResponse.ok) {
      return res.status(robloxResponse.status).json({ error: 'Gagal fetch data' });
    }

    const data = await robloxResponse.json();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
