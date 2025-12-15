import React, { useEffect, useRef, useState } from "react";

export default function WebsocketChat({ username, chatIntent }) {
  const ws = useRef(null);
  const [chatId, setChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const messagesEndRef = useRef(null);
  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

  useEffect(() => scrollToBottom(), [messages]);

  // Connect WebSocket
  useEffect(() => {
    const WS_URL = process.env.REACT_APP_WEBSOCKET_URL;
    ws.current = new WebSocket(WS_URL);

    ws.current.onopen = () => {
      if (!chatIntent) return;

      if (chatIntent.type === "CREATE") {
        ws.current.send(JSON.stringify({ type: "CREATE_CHAT", userName: username }));
      }

      if (chatIntent.type === "JOIN") {
        ws.current.send(
          JSON.stringify({
            type: "JOIN_CHAT",
            userName: username,
            chatID: chatIntent.chatId.trim(),
          })
        );
      }
    };

    ws.current.onmessage = (event) => {
      let data;
      try {
        data = JSON.parse(event.data);
      } catch {
        console.warn("Non-JSON message:", event.data);
        return;
      }

      if (data.type === "ALERT" && data.chatId) {
        setChatId(data.chatId);
      }

      setMessages((prev) => [...prev, data]);
    };

    ws.current.onerror = (err) => console.error("WebSocket error:", err);
    ws.current.onclose = () => console.warn("WebSocket closed");

    return () => ws.current.close();
  }, [username, chatIntent]);

  // Send message
  const sendMessage = () => {
    if (!input.trim() || !chatId) return;

    const msgObj = {
      type: "MESSAGE",
      userName: username,
      chatID: chatId,
      message: input,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    ws.current.send(JSON.stringify(msgObj));
    setMessages((prev) => [...prev, msgObj]);
    setInput("");
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        width: "100vw",
        background: "#0e0e17",
        color: "white",
        padding: "10px",
        boxSizing: "border-box",
      }}
    >
      {/* Top Bar */}
      <div
        style={{
          textAlign: "center",
          padding: "10px",
          fontSize: "1.2rem",
          fontWeight: "bold",
          color: "#4CAF50",
        }}
      >
        Chat ID: {chatId || "Connecting..."}
      </div>

      {/* Chat Box */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "10px",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          marginBottom: "10px",
          borderRadius: "10px",
          background: "#161623",
        }}
      >
        {messages.map((msg, i) => {
          const isMe = msg.userName === username;
          const isAlert = msg.type === "ALERT";

          return (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: isAlert ? "center" : isMe ? "flex-end" : "flex-start",
              }}
            >
              <div
                style={{
                  maxWidth: "80%",
                  padding: "10px 15px",
                  borderRadius: "15px",
                  background: isAlert
                    ? "#555"
                    : isMe
                    ? "#4CAF50"
                    : "#2d2d3f",
                  fontSize: "1rem",
                  color: "white",
                  wordBreak: "break-word",
                }}
              >
                {!isAlert && (
                  <div
                    style={{
                      fontSize: "0.75rem",
                      opacity: 0.7,
                      marginBottom: "4px",
                    }}
                  >
                    {isMe ? "You" : msg.userName} • {msg.timestamp || ""}
                  </div>
                )}
                {msg.message}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Bottom Input */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          padding: "10px",
          background: "#161623",
          borderRadius: "15px",
        }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          style={{
            flex: 1,
            padding: "12px",
            borderRadius: "30px",
            border: "none",
            outline: "none",
            background: "#1f1f2e",
            color: "white",
            fontSize: "1rem",
          }}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />

        <button
          onClick={sendMessage}
          style={{
            padding: "12px 18px",
            borderRadius: "30px",
            background: "#4CAF50",
            border: "none",
            fontSize: "1rem",
            fontWeight: "bold",
            cursor: "pointer",
            color: "white",
            minWidth: "80px",
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}


// import React, { useEffect, useRef, useState } from "react";

// export default function WebsocketChat({ username, chatIntent }) {
//   const ws = useRef(null);
//   const [chatId, setChatId] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState("");

//   const messagesEndRef = useRef(null);

//   // Scroll to bottom when new message arrives
//   const scrollToBottom = () =>
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

//   useEffect(() => scrollToBottom(), [messages]);

//   // Connect to WebSocket
//   useEffect(() => {
//     ws.current = new WebSocket("ws://localhost:8080/websocket");

//     ws.current.onopen = () => {
//       console.log("WebSocket connected");

//       if (!chatIntent) return;

//       // CREATE
//       if (chatIntent.type === "CREATE") {
//         ws.current.send(
//           JSON.stringify({
//             type: "CREATE_CHAT",
//             userName: username,
//           })
//         );
//       }

//       // JOIN
//       if (chatIntent.type === "JOIN") {
//         ws.current.send(
//           JSON.stringify({
//             type: "JOIN_CHAT",
//             userName: username,
//             chatID: chatIntent.chatId,
//           })
//         );
//       }
//     };

//     ws.current.onmessage = (event) => {
//       let data;

//       // SAFELY HANDLE NON-JSON MESSAGES
//       try {
//         data = JSON.parse(event.data);
//       } catch (err) {
//         console.warn("Non-JSON message received:", event.data);
//         return;
//       }

//       console.log("WS Received:", data);

//       // ALERT means chat created / joined
//       if (data.type === "ALERT" && data.chatId) {
//         setChatId(data.chatId);
//       }

//       setMessages((prev) => [...prev, data]);
//     };

//     ws.current.onerror = (err) => console.error("WebSocket error:", err);

//     ws.current.onclose = () => {
//       console.warn("WebSocket closed");
//     };

//     return () => ws.current?.close();
//   }, [username, chatIntent]);

//   // Send chat message
//   const sendMessage = () => {
//     if (!input.trim() || !chatId) return;

//     const msgObj = {
//       type: "MESSAGE",
//       userName: username,
//       chatID: chatId,
//       message: input,
//       timestamp: new Date().toLocaleTimeString([], {
//         hour: "2-digit",
//         minute: "2-digit",
//       }),
//     };

//     ws.current.send(JSON.stringify(msgObj));

//     // Show message instantly
//     setMessages((prev) => [...prev, msgObj]);
//     setInput("");
//   };

//   return (
//     <div
//       style={{
//         display: "flex",
//         flexDirection: "column",
//         height: "100vh",
//         padding: 20,
//         background: "#12121e",
//         color: "white",
//         fontFamily: "Arial",
//       }}
//     >
//       <h2 style={{ textAlign: "center", color: "#4CAF50" }}>
//         Chat ID: {chatId || "Connecting..."}
//       </h2>

//       {/* CHAT BOX */}
//       <div
//         style={{
//           flex: 1,
//           overflowY: "auto",
//           padding: "10px 20px",
//           marginBottom: 10,
//           display: "flex",
//           flexDirection: "column",
//         }}
//       >
//         {messages.map((msg, i) => {
//           const isMe = msg.userName === username;
//           const isAlert = msg.type === "ALERT";

//           return (
//             <div
//               key={i}
//               style={{
//                 display: "flex",
//                 justifyContent: isAlert
//                   ? "center"
//                   : isMe
//                   ? "flex-end"
//                   : "flex-start",
//                 marginBottom: 12,
//               }}
//             >
//               <div
//                 style={{
//                   maxWidth: "70%",
//                   padding: "12px 16px",
//                   borderRadius: 18,
//                   background: isAlert
//                     ? "#555"
//                     : isMe
//                     ? "#4CAF50"
//                     : "#2d2d3f",
//                   color: "white",
//                   wordBreak: "break-word",
//                 }}
//               >
//                 {!isAlert && (
//                   <div
//                     style={{
//                       fontSize: 12,
//                       opacity: 0.7,
//                       marginBottom: 4,
//                     }}
//                   >
//                     {isMe ? "You" : msg.userName} • {msg.timestamp || ""}
//                   </div>
//                 )}

//                 <div style={{ fontSize: 15 }}>{msg.message}</div>
//               </div>
//             </div>
//           );
//         })}

//         <div ref={messagesEndRef} />
//       </div>

//       {/* INPUT AREA */}
//       <div
//         style={{
//           display: "flex",
//           alignItems: "center",
//           paddingTop: 10,
//           borderTop: "1px solid #333",
//         }}
//       >
//         <input
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           placeholder="Type a message..."
//           style={{
//             flex: 1,
//             padding: 14,
//             borderRadius: 25,
//             border: "none",
//             outline: "none",
//             background: "#1f1f2e",
//             color: "white",
//             fontSize: 16,
//             marginRight: 10,
//           }}
//           onKeyDown={(e) => e.key === "Enter" && sendMessage()}
//         />

//         <button
//           onClick={sendMessage}
//           style={{
//             padding: "12px 20px",
//             borderRadius: 25,
//             background: "#4CAF50",
//             border: "none",
//             color: "white",
//             cursor: "pointer",
//             fontWeight: "bold",
//             fontSize: 15,
//           }}
//         >
//           Send
//         </button>
//       </div>
//     </div>
//   );
// }

