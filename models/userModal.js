const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const HOST_API = process.env.NODE_ENV === 'production' ? process.env.PRODUCTION_API : process.env.DEV_API;
//create tour modal
const userSchema = mongoose.Schema(
  {
    firstName: { type: "String", required: true },
    lastName: { type: "String", required: true },
    email: { type: "String", required: true },
    photoURL: { 
        type: "String", 
        required: false},
    about: { type: "String", required: false },
    role: { type: "String", required: false, default:'user' },
    password: { type: "String", required: true }
   
  },
  {
    timestapms: true,
  }
);

userSchema.methods.matchPassword = async function (enteredPassword) {
  //compare user give password encrypted password
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre("save", async function (next) {
  if (!this.isModified) {
    next();
  } else {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
});


const User = mongoose.model("User", userSchema);

module.exports = User;