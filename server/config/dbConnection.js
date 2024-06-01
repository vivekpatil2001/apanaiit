import mongoose from "mongoose";

mongoose.set('strictQuery', false)

const connectionTODB = async()=>{
  try {
    const response = await mongoose.connect(process.env.MONGODB_URI)
    if(response){
        console.log("cooncted to mongoDB")
    }
  } catch (error) {
    console.log(e);
    process.exit(1)
  }
}

export default connectionTODB;