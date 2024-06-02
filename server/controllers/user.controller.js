import User from "../models/user.model.js";
import AppError from "../utils/error.util.js";
import cloudinary from "cloudinary";

const cookieOption = {
  maxAge: 7 * 24 * 60 * 60 * 1000, //7days
  httpOnly: true,
  secure: true,
  // sameSite:'none'
};

const register = async (req, res, next) => {
  const { fullName, email, password } = req.body;

  if (!fullName || !email || !password) {
    return next(new AppError("All field are required", 400));
  }

  const userExist = await User.findOne({ email });
  if (userExist) {
    return next(new AppError("Email already exist", 400));
  }

  const user = await User.create({
    fullName,
    email,
    password,
    avatar: {
      public_id: email,
      secure_url: "https//res.cloudinary.com/du9jzqlpt/image/b165223",
    },
  });

  if (!user) {
    return next(
      new AppError("User registration faild , please try again later", 400)
    );
  }

  //TODO:FILE UPLOAD

  if(req.file){
    console.log(rew.file);
    try {
        const result = cloudinary.v2.uploader.upload(req.file.path, {
            folder:"lms",
            width:250,
            height:250,
            gravity:"faces",
            crop:"fill"
        });
        if(result){
            user.avatar.public_id = result.public_id;
            user.avatar.secure_url = result.secure_url;

            //remove file our localsystem 

            fs.rm(`uploads/ ${req.file.filename}`)
        }
    } catch (e) {
        return next(
            new AppError("Failed to upload, please try again", 500)
        )
    }
  }



  await user.save();

  user.password = undefined;

  const token = await user.generatejwttoken();

  res.cookie("token", token, cookieOption);

  res.status(201).json({
    success: true,
    message: "user registration succefully",
    user,
  });
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || password) {
      return next(new AppError("Please provide email and password", 400));
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user || !user.comparePassword(password)) {
      return next(new AppError("Email or password does not match", 400));
    }
    const token = await user.generateJWTToken();
    user.password = undefined;

    res.cookie("token", token, cookieOption);

    res.status(200).json({
      success: true,
      message: "User login successfully",
      user,
    });
  } catch (error) {
    return next(new AppError("Email or password does not match", 400));
  }
};

const logout = (req, res) => {
  res.cookie("token", null, {
    secure: true,
    maxAge: 0,
    httpOnly: true,
  });
  res.status(200).json({
    success: true,
    message: "User logout successfully",
  });
};
const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    res.status(200).json({
      success: true,
      message: "user detailes",
      user,
    });
  } catch (error) {
    return next(new AppError("Failed to fetvh profile", error));
  }
};

export { register, login, logout, getProfile };
