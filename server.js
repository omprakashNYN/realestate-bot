const express = require("express");

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.get("/webhook", (req, res) => {
  const VERIFY_TOKEN = "myverifytoken123";

  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    return res.status(200).send(challenge);
  } else {
    return res.sendStatus(403);
  }
});

app.post("/webhook", (req, res) => {
  console.log("Incoming webhook:", req.body);
  res.sendStatus(200);
});

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
}); 
app.post("/webhook", async (req, res) => {
  console.log("Incoming:", JSON.stringify(req.body));

  const body = req.body;

  if (body.entry) {
    const message = body.entry[0].changes[0].value.messages?.[0];

    if (message) {
      const from = message.from;

      await fetch(
        `https://graph.facebook.com/v18.0/933761256497078/messages`,
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${process.env.WHATSAPP_TOKEN}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            messaging_product: "whatsapp",
            to: from,
            type: "text",
            text: { body: "🔥 Bot is working bro" }
          })
        }
      );
    }
  }

  res.sendStatus(200);
});


