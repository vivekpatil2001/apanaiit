import User from "../models/user.model.js";
import AppError from "../utils/error.util.js";

const cookieOption = {
    maxAge: 7* 24 * 60 * 60 * 1000,//7days
    httpOnly: true,
    secure:true,
    // sameSite:'none'  
}

const register = async(req, res, next)=>{
    const {fullName, email, password} = req.body;

    if(!fullName || !email || !password){
        return next(new AppError('All field are required', 400));
    }
    
    const userExist = await User.findOne({email});
    if(userExist){
        return next(new AppError('Email already exist', 400));
    }

    const user = await User.create({
        fullName,
        email,
        password,
        avatar:{
            public_id:email,
            secure_url:'https//res.cloudinary.com/du9jzqlpt/image/b165223'
        },
    

    });

    if(!user){
        return next(new AppError('User registration faild , please try again later', 400));
    }

    //TODO:FILE UPLOAD

    await user.save();

    user.password = undefined;

    const token = await user.generateJWTToken();

    res.cookie('token', token, cookieOption)

    res.status(201).json({
        success:true,
        message:'user registration succefully',
        user,
    })
   
};

const login = async(req, res)=>{
    try {
        const {email, password} =req.body
   if(!email || password)
   {
    return next(new AppError('Please provide email and password', 400));
   }

   const user = await User.findOne({email}).select('+password');


 if(!user || !user.comparePassword(password)){
    return next(new AppError('Email or password does not match', 400));
 }
 const token = await user.generateJWTToken();
 user.password = undefined;

 res.cookie( 'token', token, cookieOption);

 res.status(200).json({
    success:true,
    message:'User login successfully',
    user,
 }) 
    } catch (error) {
        return next(new AppError('Email or password does not match', 400));
    }
  
};


const logout = (req, res)=>{

};
const getProfile = (req, res)=>{

};

export {
    register,
    login,
    logout,
    getProfile
}