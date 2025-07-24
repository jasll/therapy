const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public")); // Serve therapy.html

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

app.post("/api/chat", async (req, res) => {
  // 🔍 Log the API key and incoming request
  console.log("API Key:", OPENAI_API_KEY ? "✅ Present" : "❌ Missing");
  console.log("Incoming request:", req.body);

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify(req.body)
    });

    const text = await response.text();
    console.log("OpenAI response:", text);

    try {
      const json = JSON.parse(text);
      res.json(json);
    } catch (parseErr) {
      console.error("Failed to parse OpenAI response:", parseErr);
      res.status(502).send("Invalid response from OpenAI");
    }

  } catch (err) {
    console.error("Error talking to OpenAI:", err);
    res.status(500).json({ error: "Something went wrong." });
  }
});



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
