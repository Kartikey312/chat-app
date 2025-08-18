import { useEffect, useRef, useState } from 'react'
function App() {
  const [messages, setMessages] = useState<string[]>([])
  // WebSocket ref
  const wsRef = useRef<WebSocket | null>(null)
  // Input ref
  const inputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080")
    ws.onmessage = (event) => {
      setMessages((prev) => [...prev, event.data])
    }
    wsRef.current = ws
    ws.onopen = () => {
      ws.send(JSON.stringify({
        type: "join",
        payload: { roomId: "red" }
      }))
    }
    return () => {
      ws.close()
    }
  }, [])

  const handleSend = () => {
    const message = inputRef.current?.value?.trim()
    if (!message) return
    // Send to server
    wsRef.current?.send(JSON.stringify({
      type: "chat",
      payload: { message }
    }))
    // Don't update messages state here!
    if (inputRef.current) {
      inputRef.current.value = ""
    }
  }

  return (
    <div className="h-screen bg-gray-900 flex flex-col text-white">
      {/* Title */}
      <div className="p-4 bg-purple-700 text-center text-xl font-bold shadow-md">
        Real-Time Chat 💬
      </div>
      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
        {messages.map((message, index) => (
          <div key={index} className="flex">
            <span className="bg-gray-100 text-gray-900 rounded-lg px-4 py-2 shadow-md">
              {message}
            </span>
          </div>
        ))}
      </div>
      {/* Input Section */}
      <div className="p-3 bg-gray-800 flex items-center gap-3">
        <input
          ref={inputRef}
          id="message"
          placeholder="Type a message..."
          className="flex-1 p-3 rounded-md bg-gray-700 text-white outline-none focus:ring-2 focus:ring-purple-500"
        />
        <button
          onClick={handleSend}
          className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-md font-semibold transition"
        >
          Send
        </button>
      </div>
    </div>
  )
}
export default App
