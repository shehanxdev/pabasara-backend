const cron = require("node-cron");
const User = require("../models/userModal"); 
const { predictBedtime } = require("../controllers//BedtimePredictController");
const { Expo } = require("expo-server-sdk");

const expo = new Expo();

console.log("Bedtime Scheduler Initialized...");

cron.schedule("0 18 * * *", async () => {
  console.log("Executing bedtime prediction job at 6:00 PM...");

  try {
    const users = await User.find({ survay_completed: true });

    for (const user of users) {
      const _id = user._id;
      const bedtimePrediction = await predictBedtime({ params: { _id } }, null);

      if (bedtimePrediction?.data?.success) {
        const wakeupTimeEntry = user.wakeup_time.find((w) => 
          w.day === new Date().toLocaleString('en-US', { weekday: 'long' })
        );

        if (wakeupTimeEntry) {
          const wakeupTime = wakeupTimeEntry.time;
          const predictedBedtimeHours = Number(bedtimePrediction.data.data);

          const [hours, minutes] = wakeupTime.split(":");
          let bedtimeHour = parseInt(hours, 10) - predictedBedtimeHours;
          if (bedtimeHour < 0) bedtimeHour += 24;

          const bedtime = `${bedtimeHour}:${minutes} ${wakeupTime.includes("AM") ? "PM" : "AM"}`;
          console.log(`User ${user.fullName} should go to bed at ${bedtime}`);

          // 🟢 Send Push Notification to User
          if (user.expoPushToken && Expo.isExpoPushToken(user.expoPushToken)) {
            await expo.sendPushNotificationsAsync([
              {
                to: user.expoPushToken,
                sound: "default",
                title: "Bedtime Reminder",
                body: `Hi ${user.fullName}, your optimal bedtime is at ${bedtime}. Sleep well!`,
                data: { bedtime },
              },
            ]);
          }
        }
      }
    }
  } catch (error) {
    console.error("Error in bedtime prediction job:", error);
  }
});

module.exports = cron;
