const express = require("express");
const router = express.Router();
const sendEmail = require("../services/sendEmail");

router.post("/send-email", async (req, res) => {
  const { name, email } = req.body;

  if (!email || !email.includes("@")) {
    return res.status(400).json({ error: "Invalid email" });
  }

  try {
    await sendEmail(email, name || "Student");
    res.status(200).json({ message: "Email sent successfully" });
  } catch (err) {
    console.error("Error sending email:", err);
    res.status(500).json({ error: "Failed to send email" });
  }
});

module.exports = router;
