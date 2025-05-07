import React, { useState } from "react";
import axios from "axios";
import { FaArrowUp, FaCopy } from "react-icons/fa"; // Importing the arrow and copy icons
import "./styles.css";

function App() {
  const [question, setQuestion] = useState("What do you want to create?");
  const [userInput, setUserInput] = useState("");
  const [answers, setAnswers] = useState([]);
  const [showPrompt, setShowPrompt] = useState(false);
  const [generatedPrompt, setGeneratedPrompt] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedAnswers = [...answers, userInput];
    setAnswers(updatedAnswers);

    try {
      const response = await axios.post("http://localhost:8000/next-question", {
        previousAnswers: updatedAnswers,
      });

      if (response.data.prompt) {
        setGeneratedPrompt(response.data.prompt);
        setShowPrompt(true);
      } else if (response.data.question) {
        setQuestion(response.data.question);
      }
    } catch (error) {
      console.error("Error fetching next question:", error);
    }

    setUserInput("");
  };

  // Function to handle prompt copy
  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedPrompt);
  };

  return (
    <div className="app">
      <div className="question-box">
        <p>{question}</p>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="input-area">
          <input
            type="text"
            placeholder="Tell me..."
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            className="text-input"
          />
          <button type="submit" className="send-button">
            <FaArrowUp className="icon" />
          </button>
        </div>
      </form>

      {showPrompt && (
        <div className="prompt-overlay" onClick={() => setShowPrompt(false)}>
          <div className="prompt-card" onClick={(e) => e.stopPropagation()}>
            <h3>Prompt Ready:</h3>
            <pre>{generatedPrompt}</pre>
            <div className="action-buttons">
              <button className="copy-btn" onClick={copyToClipboard}>
                <FaCopy /> Copy
              </button>
              <button
                onClick={() => setShowPrompt(false)}
                className="close-btn"
              >
                X
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
