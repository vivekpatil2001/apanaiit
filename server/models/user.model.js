import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs"
import  Jwt  from "jsonwebtoken";

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: [true, "Name is required"],
      minLength: [5, "Name must be at least 5 charecters"],
      maxLength: [50, "Name should be less than 50 characters"],
      lowercase: true,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        ,
        "please fill in a valid email address",
      ],
    },
    password: {
      type: String,
      required: [true, "password is required"],
      minLength: [8, "password must be at least 8 character"],
      select: false,
    },
    avatar: {
      public_id: {
        type: "String",
      },
      secure_url: {
        type: String,
      },
    },
    role: {
      type: String,
      enum:['USER', 'ADMIN'],
      default: 'USER'
   },
    forgotPasswordToken: String,
    forgotPasswordExpiry: Date,
  },
  {
    timestamps: true,
  }
);

userSchema.pre('save',  async function (next){
   if(!this.isModified('password')){
      return next();
   }
   this.password = await bcrypt.hash(this.password, 10);
   next();
})

userSchema.method = {
   generateJWTToken: async function  () {
      return await jwt.sign({Id:this._id , email:this.email, subScription:this.subScription, role:this.role}, process.env.JWT_SECRET, {
         expiresIn: process.env.JWT_EXPIRY
      })
   },
   comparePassword: async function (plainTextPassword) {
      return await bcrypt.compare(plainTextPassword, this.password);
   },
}
const User = model("User", userSchema);
export default User;
