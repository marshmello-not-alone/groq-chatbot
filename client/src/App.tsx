import { useState } from "react";
import styles from "./App.module.css";

function App() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setLoading(true);
    setResponse("");

    try {
      const res = await fetch("/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userInput: input }),
      });

      const data = await res.json();
      setResponse(data.aiMessage || "No response from AI.");
    } catch (err) {
      console.error(err);
      setResponse("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
      setInput("");
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Groq ChatBot</h1>

      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className={styles.input}
          disabled={loading}
        />
        <button type="submit" className={styles.button} disabled={loading}>
          {loading ? "Sending..." : "Send"}
        </button>
      </form>

      <div className={styles.card}>
        <strong>Response:</strong>
        <div style={{ marginTop: "1rem", whiteSpace: "pre-wrap" }}>
          {loading ? <em>Waiting for AI response...</em> : response}
        </div>
      </div>
    </div>
  );
}

export default App;
