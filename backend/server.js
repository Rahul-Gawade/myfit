import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import Groq from "groq-sdk";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

app.post("/generate-plan", async (req, res) => {
  try {
    const {
      age,
      gender,
      height,
      weight,
      bmi,
      goal,
      activity_level,
      diet_preference,
      medical_condition,
    } = req.body;

    const prompt = `
You are a professional fitness trainer and diet expert.

Return ONLY JSON in this exact format:

{
  "userSummary": {
    "age": "",
    "gender": "",
    "height": "",
    "weight": "",
    "bmi": "",
    "goal": ""
  },
  "bmiAnalysis": "",
  "calories": "",
  "workout": ["", "", "", ""],
  "diet": {
    "breakfast": "",
    "lunch": "",
    "dinner": ""
  },
  "healthTips": ["", "", ""]
}

User Details:
Age: ${age}
Gender: ${gender}
Height: ${height} cm
Weight: ${weight} kg
BMI: ${bmi}
Goal: ${goal}
Activity Level: ${activity_level}
Diet Preference: ${diet_preference}
Medical Condition: ${medical_condition}

Keep response professional, structured, and personalized.
`;

    const response = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const content = response.choices[0].message.content;

    let plan;

    try {
      plan = JSON.parse(content);
    } catch (err) {
      console.log("JSON parse error:", err);
      return res.status(500).json({
        error: "AI returned invalid format",
      });
    }

    res.json({ plan });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Failed to generate plan",
    });
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});