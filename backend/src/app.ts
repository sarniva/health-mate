import express from "express";


const app = express();

app.use(express.json());


app.get("/health",(req,res)=>{
    res.json({status:"ok",message:"The server is up and running"});
});

export default app;
