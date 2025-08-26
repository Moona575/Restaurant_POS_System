res.setHeader('Access-Control-Allow-Origin', 'https://restaurant-pos-system-nine.vercel.app');
res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
res.setHeader('Access-Control-Allow-Credentials', 'true');

if (req.method === "OPTIONS") return res.status(200).end();


if (req.method === "GET") {
  const user = await authMiddleware(req, res);
  if (!user) return; // unauthorized already handled
  await getUserData(req, res);
} else {
  res.setHeader("Allow", ["GET"]);
  res.status(405).json({ message: `Method ${req.method} not allowed` });
}
