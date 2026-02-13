const express = require("express");
const bodyParser = require("body-parser");

const app = express();   // 👈 THIS MUST COME FIRST

app.use(bodyParser.json());

/* ===== WEBHOOK VERIFICATION (GET) ===== */
app.get("/webhook", (req, res) => {
  const VERIFY_TOKEN = "myverifytoken123";

  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token) {
    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      console.log("Webhook verified!");
      return res.status(200).send(challenge);
    } else {
      return res.sendStatus(403);
    }
  }
});

/* ===== RECEIVE MESSAGES (POST) ===== */
app.post("/webhook", (req, res) => {
  console.log("Incoming webhook:", JSON.stringify(req.body, null, 2));
  res.sendStatus(200);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

