import { useState } from "react"

function App() {
  const [question, setQuestion] = useState("")
  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem("chat_history")
    return saved ? JSON.parse(saved) : []
  })

  const askQuestion = async () => {
    if (!question.trim()) return
    setLoading(true)

    const userMessage = question
    setQuestion("")

    const newMessages = [...messages, { role: "user", content: userMessage }]
    setMessages(newMessages)

    try {
      const backendUrl = import.meta.env.VITE_API_URL || "https://hr-assistant-api-dxm6.onrender.com"
      const response = await fetch(`${backendUrl}/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          text: userMessage,
          history: newMessages
        })
      })
      const data = await response.json()

      const updatedMessages = [...newMessages, { role: "ai", content: data.answer }]
      setMessages(updatedMessages)
      localStorage.setItem("chat_history", JSON.stringify(updatedMessages))

    } catch (error) {
      const updatedMessages = [...newMessages, { role: "ai", content: "Error: Could not connect to server" }]
      setMessages(updatedMessages)
      localStorage.setItem("chat_history", JSON.stringify(updatedMessages))
    } finally {
      setLoading(false)
    }
  }

  const clearChat = () => {
    setMessages([])
    localStorage.removeItem("chat_history")
  }

  return (
    <div style={{ maxWidth: "600px", margin: "50px auto", padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>HR Assistant</h1>
        {messages.length > 0 && (
          <button
            onClick={clearChat}
            style={{
              padding: "6px 12px",
              background: "#ef4444",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "12px"
            }}
          >
            Clear Chat
          </button>
        )}
      </div>
      <div style={{ minHeight: "300px", marginBottom: "20px" }}>
        {messages.map((msg, i) => (
          <div key={i} style={{
            textAlign: msg.role === "user" ? "right" : "left",
            margin: "10px 0"
          }}>
            <span style={{
              background: msg.role === "user" ? "#5b8def" : "#f0f0f0",
              color: msg.role === "user" ? "white" : "black",
              padding: "10px 15px",
              borderRadius: "12px",
              display: "inline-block",
              maxWidth: "80%"
            }}>
              {msg.content}
            </span>
          </div>
        ))}
      </div>
      <textarea
        rows={3}
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
    </div>
  )
}

export default App