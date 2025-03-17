const asyncHandler = require("express-async-handler");
const User = require("../models/userModal")
const genarateToken = require("../config/generateToken")



// const submitSurvay = asyncHandler(async (req, res) => {
//   const { _id } = req.params; // Extract user ID from URL params
//   const {
//     sleepingDisorder,
//     sleepingDisorderNote,
//     physicalDisability,
//     physicalDisabilityNote,
//     workEnvironmentImpact,
//     wakeup_time
//   } = req.body; // Extract survey data from request body

//   try {
//     // Find the user by ID and update their survey data
//     const updatedUser = await User.findByIdAndUpdate(
//       _id,
//       {
//         $set: {
//           sleepingDisorder,
//           sleepingDisorderNote,
//           physicalDisability,
//           physicalDisabilityNote,
//           workEnvironmentImpact,
//           survay_completed: true,
//           wakeup_time
//         },
//       },
//       { new: true } // Return the updated user document
//     );

//     if (!updatedUser) {
//       return res.status(404).json({ message: "User not found",success:false, data:null });
//     }
    
//     // Send the updated user data as the response
//     res.status(200).json({
//       message: "Survey submitted successfully",
//       data: updatedUser,
//       success:true
//     });
//   } catch (error) {
//     console.error("Error submitting survey:", error);
//     res.status(500).json({ message: "Internal server error", success:false });
//   }
// });

const submitSurvay = asyncHandler(async (req, res) => {
  const { _id } = req.params; // Extract user ID from URL params
  const {
    sleepingDisorder,
    sleepingDisorderNote,
    physicalDisability,
    physicalDisabilityNote,
    workEnvironmentImpact,
    wakeup_time, // New wake-up time data from request
  } = req.body;

  try {
    // Find the existing user
    const existingUser = await User.findById(_id);
    if (!existingUser) {
      return res.status(404).json({ message: "User not found", success: false, data: null });
    }

    // Merge wake-up time data with existing data
    let updatedWakeupTime = existingUser.wakeup_time || [];

    if (wakeup_time && Array.isArray(wakeup_time)) {
      wakeup_time.forEach(({ day, time }) => {
        const index = updatedWakeupTime.findIndex((entry) => entry.day === day);
        if (index !== -1) {
          // Update existing entry
          updatedWakeupTime[index].time = time;
        } else {
          // Add new entry
          updatedWakeupTime.push({ day, time });
        }
      });
    }

    // Update the user document
    const updatedUser = await User.findByIdAndUpdate(
      _id,
      {
        $set: {
          sleepingDisorder,
          sleepingDisorderNote,
          physicalDisability,
          physicalDisabilityNote,
          workEnvironmentImpact,
          survay_completed: true,
          wakeup_time: updatedWakeupTime,
        },
      },
      { new: true } // Return the updated document
    );

    res.status(200).json({
      message: "Survey submitted successfully",
      data: updatedUser,
      success: true,
    });
  } catch (error) {
    console.error("Error submitting survey:", error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
});




module.exports = {
  submitSurvay
};