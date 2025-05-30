const asyncHandler = require("express-async-handler");
const User = require("../models/userModal")
const {spawn} = require("child_process");
const path = require("path");


const addToken = asyncHandler( async(req, res) => {

  const { token } = req.body;
  const { _id } = req.params;

  try {
    const user = await User.findOneAndUpdate(
      { _id: _id }, // Assuming user is authenticated
      { expoPushToken: token },
      { new: true }
    );

    res.json({ success: true, message: "Push token saved successfully", user });
  } catch (error) {
    res.status(500).json({ success: false, error: "Error saving push token" });
  }

})

const predictBedtime = asyncHandler(async (req, res) => {
  
    const {_id,stepCount} = req.params
  
    if (!_id) {
      res.send(400).json({
        error: "User id required",
      });
      throw new error("User id required!!!");
    }
      
    const user = await User.findById(_id)

    if (user) {

      const derivedFields = user.calculateDerivedFields();

      const usageFields = user.calculateUsageFields();

      const {
        Work_Environment_Impact_Neutral,
        Work_Environment_Impact_Positive,
        BMI_Category_Overweight,
        BMI_Category_Underweight,
        Gender_Male,
        Gender_Female,
        Stress_Level,
      } = derivedFields;

      const {
        Technology_Usage_Hours, //
        Social_Media_Usage_Hours, //
        Gaming_Hours, //
        Screen_Time_Hours, //
        Sleep_Hours, //
        Physical_Activity_Hours, //
      } = usageFields;

      const Age = parseInt(user.age);

      let physicalActivityHours = Physical_Activity_Hours;
      if (stepCount !== null) {
        // Assuming 1000 steps = 1 hour, adjust this conversion factor as needed
        physicalActivityHours = stepCount / 1000; // Convert steps to hours
      }

      const pythonScriptPath = path.join(
        __dirname, 
        "..", 
        "ML",
        "BedtimePredict",
        "predict_optimal_healthy_sleep_duration_xgb.py"
      );
       
      const option = {
        url: pythonScriptPath,
        args: [
          Age,
          Gender_Male,
          Gender_Female,
          Work_Environment_Impact_Neutral,
          Work_Environment_Impact_Positive,
          physicalActivityHours,
          Stress_Level,
          BMI_Category_Overweight,
          BMI_Category_Underweight,
          Technology_Usage_Hours,
          Social_Media_Usage_Hours,
          Gaming_Hours,
          Screen_Time_Hours,
          Sleep_Hours,
        ],
      };

      const pythonEnvPath = path.join(
        __dirname, 
        "..", 
        "ML", 
        "BedtimePredict", 
        "sleep_env",
        "lib",
        "python3.13",
        "site-packages",
      );

      const env = {
        ...process.env,
        PYTHONPATH: pythonEnvPath,
      };

      const pythonInterpreterPath = path.join(
        __dirname, 
        "..", 
        "ML", 
        "BedtimePredict", 
        "sleep_env",
        "bin",
        "python3",
      );

      const pythonProcess = spawn(pythonInterpreterPath, [
        option.url,
        ...option.args, 
      ], { env });
    
    
        pythonProcess.stdout.on("data", async (data) => {
          if (data) {
    
            const output = data.toString();

            console.log('=============output=======================');
            console.log(output);
            console.log('====================================');
            
            res.status(200).json({
              data: output,
              success: true,
              message:"Bedtime prediction success"
            });
    
          }
        });
        
        // pythonProcess.stderr.on("data", (data) => {
        //   console.log(`error:${data}`);
        // });
    }
    else{
      res.send(404).json({
        error: "User not found",
      });
    }
});
  
  module.exports = {
    predictBedtime,
    addToken
  };