
import AppError from "../utils/error.util";
import  Jwt  from "jsonwebtoken";
const isLoggedIn = async(req, res,next)=>{
    const {token} = req.cookies;

    if(!token){
        return next(new AppError("Unauthenticate, please login first",401));
    }

    const userDetails = await Jwt.verify(token, process.env.JWT_SECRET);
    req.user = userDetails;
     next();
}

export{
    isLoggedIn
}