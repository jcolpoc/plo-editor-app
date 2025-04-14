export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST requests allowed' });
  }

  const plos = req.body;
  console.log('Received data:', plos);

  return res.status(200).json({ message: "Saved successfully" });
}
