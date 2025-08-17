const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const sesRoutes = require("./routes/sesRoutes");
const app = express();
const cors = require("cors");
app.use(bodyParser.json());

const allowedOrigins = [
  "http://localhost:3000", // your local Next.js frontend
  "https://wize.co.in", // your production frontend domain
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// MongoDB Connection with Mongoose
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected successfully via Mongoose"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

app.use("/api", sesRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
