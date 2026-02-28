import React, { useState,useRef } from "react";

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
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const calculateBMI = () => {
    const heightInMeters = formData.height / 100;
    return (
      formData.weight /
      (heightInMeters * heightInMeters)
    ).toFixed(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    const bmi = calculateBMI();

    try {
      const response = await fetch(
        "http://localhost:5000/generate-plan",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...formData,
            bmi,
          }),
        }
      );

      const data = await response.json();

      setPlan(data.plan);

    } catch (error) {
      alert("Error generating plan");
    }

    setLoading(false);
  };
  const resultRef = useRef(null);

  const speakResult = () => {
    if (!resultRef.current) return;

    const text = resultRef.current.innerText; // gets all visible text

    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "en-US";
    speech.rate = 1;

    window.speechSynthesis.cancel(); // stop previous speech
    window.speechSynthesis.speak(speech);
  };
  const pauseSpeech = () => window.speechSynthesis.pause();
const resumeSpeech = () => window.speechSynthesis.resume();

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>
        MyFit - AI Fitness Planner 💪
      </h1>

      <form onSubmit={handleSubmit} style={styles.form}>
        <input name="age" placeholder="Age" onChange={handleChange} required />
        <input name="gender" placeholder="Gender" onChange={handleChange} required />
        <input name="height" placeholder="Height (cm)" onChange={handleChange} required />
        <input name="weight" placeholder="Weight (kg)" onChange={handleChange} required />
        <input name="goal" placeholder="Goal" onChange={handleChange} required />
        <input name="activity_level" placeholder="Activity Level" onChange={handleChange} required />
        <input name="diet_preference" placeholder="Diet Preference" onChange={handleChange} required />
        <input name="medical_condition" placeholder="Medical Condition" onChange={handleChange} />

        <button style={styles.button}>
          Generate Plan
        </button>
      </form>

      {loading && <p>Generating Plan...</p>}
      {plan && (
        <div>
        <div style={styles.card} ref={resultRef}>
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
            {plan.workout.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>

          <h2>Diet Plan</h2>
          <p>Breakfast: {plan.diet.breakfast}</p>
          <p>Lunch: {plan.diet.lunch}</p>
          <p>Dinner: {plan.diet.dinner}</p>

          <h2>Health Tips</h2>
          <ul>
            {plan.healthTips.map((tip, index) => (
              <li key={index}>{tip}</li>
            ))}
          </ul>

        </div>
        <div style={{display:"flex",flexDirection:"row",alignItems:"center", justifyContent:"space-around" , maxWidth:"400px", margin:"20px auto"}}>
        <button style={styles.button} onClick={speakResult}>Read Full Plan</button><br />
        <button style={styles.button} onClick={pauseSpeech}>⏸ Pause</button><br />
        <button style={styles.button} onClick={resumeSpeech}>▶ Resume</button><br />
        <button style={styles.button} onClick={() => window.speechSynthesis.cancel()}> Stop</button><br />
        </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "600px",
    margin: "auto",
    padding: "20px",
    fontFamily: "Arial",
  },

  title: {
    textAlign: "center",
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },

  button: {
    padding: "10px",
    margin:"10px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    cursor: "pointer",
    borderRadius: "5px",
  },

  card: {
    marginTop: "20px",
    padding: "20px",
    backgroundColor: "#f9f9f9",
    borderRadius: "10px",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
  },
};

export default App;