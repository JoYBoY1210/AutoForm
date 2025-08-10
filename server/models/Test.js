import mongoose from "mongoose";

const optionSchema = new mongoose.Schema({
    id: { type: String, required: true },
    text: { type: String, required: true }
});

const categorySchema = new mongoose.Schema({
    id: { type: String, required: true },
    text: { type: String, required: true }
});

const itemSchema = new mongoose.Schema({
    id: { type: String, required: true },
    text: { type: String, required: true },
    correctCategoryId: { type: String, required: true }
});

const mcqSchema = new mongoose.Schema({
    id: { type: String, required: true },
    question: { type: String, required: true },
    options: [optionSchema],
    correctOptionId: { type: String, required: true }
});

const questionSchema = new mongoose.Schema({
    type: { type: String, required: true },
    text: String,
    categories: [categorySchema],
    items: [itemSchema],
    options: [optionSchema],
    correctOptionIds: [String],
    passageTitle: String,
    passageText: String,
    questions: [mcqSchema]
});

const testSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    questions: [questionSchema]
});

const Test = mongoose.model("Test", testSchema);

export default Test;
