import express from 'express';
import Test from '../models/Test.js';

const router = express.Router();

router.post("/create", async (req, res) => {
    console.log("Received data:", req.body);
    try{
        const newTest= new Test(req.body);
        const savedtest = await newTest.save();

        res.status(201).json({message: "Test created successfully", id: savedtest._id});
    }catch(err){
        res.status(500).json({error: err.message});
    }
});

router.get("/:id", async (req, res) => {
    try{
        const test=await Test.findById(req.params.id);
        console.log("Fetched test:", test);
        if(!test) {
            return res.status(404).json({error: "Test not found"});
        }
        res.status(200).json(test);
    }catch(err){
        res.status(500).json({error: err.message});
    }
});

export default router;
