const asyncHandler = require("express-async-handler");
const { spawn } = require("child_process");
const SleepTimeRecord = require("../models/sleepTimeRecordModal");

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

const addSleepRecord = asyncHandler(async (req, res) => {
  const { date, sleepDuration, dailyStepCount } = req.body;

  try {
    const newRecord = new SleepTimeRecord({
      date,
      sleepDuration,
      dailyStepCount,
    });

    await newRecord.save();
    res.status(201).json({ message: "Sleep record added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to add sleep record" });
  }
});

const getAllSleepRecords = asyncHandler(async (req, res) => {
  try {
    const records = await SleepTimeRecord.find({});
    res.status(200).json(records);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve sleep records" });
  }
});

module.exports = {
  sleepPredictor,
  addSleepRecord,
  getAllSleepRecords,
};
