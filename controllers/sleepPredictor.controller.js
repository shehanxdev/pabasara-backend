const asyncHandler = require("express-async-handler");
const { spawn } = require("child_process");

const sleepPredictor = asyncHandler(async (req, res) => {
  const userData = req.body;

  // Step 3: Spawn Python script
  const pythonProcess = spawn("python", [
    "D:\\Projects\\Freelancing\\Influence-of-Bedtime-Mobile-App-Backend\\MLModels\\sleepPredictor\\sleepPredictor.py",
  ]);

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

module.exports = {
  sleepPredictor,
};
