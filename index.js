const express = require("express");
const colors = require("colors");
const dotenv = require("dotenv");
const cors = require("cors");
const app = express();
require("dotenv").config({ path: "./config.env" });
const authRoutes = require("./routes/authRoutes");
const faceScanRoutes = require("./routes/faceScan.routes");
const connectDB = require("./DB/db");
const { errorHandler, notFound } = require("./middleware/errorMiddleware");
const { spawn } = require("child_process");

dotenv.config();
connectDB();

const PORT = process.env.PORT || 5005;

// app.use(cors());
app.use(
  cors({
    origin: process.env.CLIENT_API || "http://192.168.1.82:8081", // Replace with your frontend URL
    credentials: true,
  })
);

app.use(express.json());
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.send("Api is running Bedtime Project");
});

// Step 2: Define API endpoint
app.post("/predict", (req, res) => {
  const userData = req.body;

  // Step 3: Spawn Python script
  const pythonProcess = spawn("python", ["./MLModels/sleepPredictor.py"]);

  // Send data to Python script
  pythonProcess.stdin.write(JSON.stringify(userData));
  pythonProcess.stdin.end();

  let result = "";

  // Step 4: Receive output from Python script
  pythonProcess.stdout.on("data", (data) => {
    result = data.toString();
  });

  pythonProcess.stderr.on("data", (data) => {
    console.error(`${data}`);
  });

  pythonProcess.on("close", (code) => {
    if (code !== 0) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
    try {
      console.log(result);
      const prediction = JSON.parse(result);
      res.json(prediction);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Invalid response from model" });
    }
  });
});

const server = app.listen(
  PORT,
  console.log(`Server running on PORT ${PORT}...`.yellow.bold)
);
if (server) {
  console.log("Success".green.bold);
}

app.use(`/api/auth`, authRoutes);
app.use(`/api/face`, faceScanRoutes);

app.use(errorHandler);
app.use(notFound);

module.exports = { app, server };
