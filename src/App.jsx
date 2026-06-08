import { useState } from "react"

function App() {
  const [question, setQuestion] = useState("")
  const [answer, setAnswer] = useState("")
  const [loading, setLoading] = useState(false)

  const askQuestion = async () => {
    if (!question.trim()) return
    setLoading(true)
    setAnswer("")

    try {
  const response = await fetch("https://hr-assistant-api-dxm6.onrender.com/ask", {        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: question })
      })
      const data = await response.json()
      setAnswer(data.answer)
    } catch (error) {
      setAnswer("Error: Could not connect to server")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: "600px", margin: "50px auto", padding: "20px" }}>
      <h1>HR Assistant</h1>
      <textarea
        rows={4}
        style={{ width: "100%", padding: "10px" }}
        placeholder="Ask an HR question..."
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />
      <button
        onClick={askQuestion}
        disabled={loading}
        style={{ marginTop: "10px", padding: "10px 20px" }}
      >
        {loading ? "Thinking..." : "Ask"}
      </button>
      {answer && (
        <div style={{ marginTop: "20px", padding: "15px", background: "#f0f0f0" }}>
          <strong>Answer:</strong>
          <p>{answer}</p>
        </div>
      )}
    </div>
  )
}

export default App