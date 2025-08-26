const express = require("express");
const app = express();
const PORT = process.env.PORT || 8000;

app.get("/", (req, res) => res.json({ message: "Server is alive!" }));

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
