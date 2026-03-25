import React, { useState, useRef } from "react";
import axios from "axios";
import "./index.css"; 

function App() {
  const [formData, setFormData] = useState({
    age: "",
    gender: "",
    height: "",
    weight: "",
    goal: "",
    activity_level: "",
    diet_preference: "",
    medical_condition: "",
  });

  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const calculateBMI = () => {
    const heightInMeters = formData.height / 100;
    return (formData.weight / (heightInMeters * heightInMeters)).toFixed(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const bmi = calculateBMI();

    try {
      const response = await axios.post(
        "http://localhost:5000/generate-plan",
        { ...formData, bmi },
        { headers: { "Content-Type": "application/json" } }
      );
      setPlan(response.data.plan);
    } catch (error) {
      console.error(error);
      alert("Error generating plan");
    }

    setLoading(false);
  };

  const resultRef = useRef(null);

  const speakResult = () => {
    if (!resultRef.current) return;
    const text = resultRef.current.innerText;
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "en-US";
    speech.rate = 1;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(speech);
  };

  const pauseSpeech = () => window.speechSynthesis.pause();
  const resumeSpeech = () => window.speechSynthesis.resume();

  return (
    <div className="container">
      <h1 className="title">MyFit - AI Fitness Planner</h1>

      <form onSubmit={handleSubmit}>
        <input name="age" placeholder="Age" onChange={handleChange} required />
        <input name="gender" placeholder="Gender" onChange={handleChange} required />
        <input name="height" placeholder="Height (cm)" onChange={handleChange} required />
        <input name="weight" placeholder="Weight (kg)" onChange={handleChange} required />
        <input name="goal" placeholder="Goal" onChange={handleChange} required />
        <input name="activity_level" placeholder="Activity Level" onChange={handleChange} required />
        <input name="diet_preference" placeholder="Diet Preference" onChange={handleChange} required />
        <input name="medical_condition" placeholder="Medical Condition" onChange={handleChange} />
        <button>Generate Plan</button>
      </form>

      {loading && <p>Generating Plan...</p>}

      {plan && (
        <>
          <div className="card" ref={resultRef}>
            <h2>User Summary</h2>
            <p>Age: {plan.userSummary.age}</p>
            <p>Gender: {plan.userSummary.gender}</p>
            <p>Height: {plan.userSummary.height}</p>
            <p>Weight: {plan.userSummary.weight}</p>
            <p>BMI: {plan.userSummary.bmi}</p>
            <p>Goal: {plan.userSummary.goal}</p>

            <h2>BMI Analysis</h2>
            <p>{plan.bmiAnalysis}</p>

            <h2>Daily Calories</h2>
            <p>{plan.calories}</p>

            <h2>Workout Plan</h2>
            <ul>
              {plan.workout.map((item, idx) => <li key={idx}>{item}</li>)}
            </ul>

            <h2>Diet Plan</h2>
            <p>Breakfast: {plan.diet.breakfast}</p>
            <p>Lunch: {plan.diet.lunch}</p>
            <p>Dinner: {plan.diet.dinner}</p>

            <h2>Health Tips</h2>
            <ul>
              {plan.healthTips.map((tip, idx) => <li key={idx}>{tip}</li>)}
            </ul>
          </div>

          <div className="button-group">
            <button className="speech-button" onClick={speakResult}>Read Full Plan</button>
            <button className="speech-button" onClick={pauseSpeech}>⏸ Pause</button>
            <button className="speech-button" onClick={resumeSpeech}>▶ Resume</button>
            <button className="speech-button" onClick={() => window.speechSynthesis.cancel()}>Stop</button>
          </div>
        </>
      )}
    </div>
  );
}

export default App;