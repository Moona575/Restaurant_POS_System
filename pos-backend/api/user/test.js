module.exports = async function handler(req, res) {
  console.log(`Test endpoint called: ${req.method} ${req.url}`);
  
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', 'https://restaurant-pos-system-nine.vercel.app');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  // Handle preflight
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method === "GET") {
    return res.status(200).json({ 
      success: true, 
      message: "Test endpoint working!",
      timestamp: new Date().toISOString() 
    });
  }

  res.setHeader("Allow", ["GET"]);
  res.status(405).json({ message: `Method ${req.method} not allowed` });
};