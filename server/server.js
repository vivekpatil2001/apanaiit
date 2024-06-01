 import app from "./app.js"
 import connectionTODB from "./config/dbConnection.js";

const PORT = process.env.PORT || 3000;



app.listen(PORT, async()=>{
    await connectionTODB()
    console.log(`App is running at http://localhost:${PORT}`)
})