

import { useState } from "react";
import "./App.css";
import WebsocketChat from "./components/Websocket";

function App() {
  const [connected, setConnected] = useState(false);
  const [userName, setUserName] = useState("");
  const [chatIntent, setChatIntent] = useState(null);
  const [joinChatId, setJoinChatId] = useState("");
  const [detailsPopUp,setDetailsPopUp]=useState(true);

  const handleConnect = () => {
    if (userName.trim() === "") {
      alert("Please enter username");
      return;
    }
    setConnected(true);
  };

  const handleCreateChat = () => {
    setChatIntent({ type: "CREATE" });
  };

  const handleJoinChat = () => {
    if (!joinChatId.trim()) {
      alert("Enter Chat ID");
      return;
    }
    const cleanedChatId = joinChatId.replace(/[\s-]/g, "");

    setChatIntent({ type: "JOIN", chatId: cleanedChatId });
  };

  const handleDetailsInBottom=()=>{
    setDetailsPopUp(!detailsPopUp);
  }

  return (
    <div className="App" >
      <div
  className="warning"
  style={{
    top: 0,
    left: 0,
    width: "100%",
    backgroundColor: "#ffcc00",
    padding: 10,
    color: "#000",
    fontWeight: "bold",
    zIndex: 1000,
    textAlign: "center"
  }}>
         ⚠️ This site is for educational purposes only. Do not use it for any illegal activity.
       </div>

      <header className="App-header">

        {/* Step 1: Enter Name */}
        {!connected && (
          <div>
            <h2>Enter your name</h2>
            <input
              placeholder="Enter your name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
            <button onClick={handleConnect}>Continue</button>
          </div>
        )}

        {/* Step 2: Show Create/Join options */}
        {connected && !chatIntent && (
          <div>
            <div style={{ fontSize: "12px" }}>
            <div>
              1. If you are new just click on create chat it will land you into the chat page and provides the chat Id 
            </div>
            <div>
              2. If you want to join the Chat , get the chatId from the previous session (or created by your friend).Then click on join Chat button.
            </div>
          </div>
          <div style={{ marginTop: 20 }}>
            <h3>Hello {userName}, create or join a chat</h3>

            <button onClick={handleCreateChat} style={{ marginRight: 10 }}>
              Create Chat
            </button>

            <input
              placeholder="Enter Chat ID"
              value={joinChatId}
              onChange={(e) => setJoinChatId(e.target.value)}
            />
            <button onClick={handleJoinChat}>Join Chat</button>
          </div>
          </div>
        )}

        {/* Step 3: Open Chat Window */}
        {connected && chatIntent && (
          <WebsocketChat username={userName} chatIntent={chatIntent} />
        )}
      </header>

    <div>
      {detailsPopUp&&(
        <div style={{ marginTop: 20, padding: 10, fontSize: 14, color: "#555" }}>
      <div>
         This website is purely open-source. No data is stored in the backend or anywhere else. Only you and another session with the session ID can access the chat.
      </div>
        <div>
          If you want to check the code can reach to the github : 
          <div><a href= "https://github.com/rupesh4950/FreeChatFrontend.git">Forntend Code </a> </div>
          <div><a href= "https://github.com/rupesh4950/FreeChatBackend.git">Backend Code</a> </div>
          <div style={{fontFamily: "italic",color: "#666"}}>If you fell any feature to be added please mail to <a href="mailto:aestheontechnologies@gmail.com?subject=Feature Request - FreeChat">Email 📧</a></div>
        </div>
        </div>
      )}
      
    </div>
    <button style={{marginRight: 20}} onClick={handleDetailsInBottom}>{detailsPopUp ? "close details":"open details"} </button>
    </div>
  );
}

export default App;


// import { useState } from "react";
// import "./App.css";
// import WebsocketChat from "./components/Websocket";

// function App() {
//   const [connected, setConnected] = useState(false);
//   const [userName, setUserName] = useState("");
//   const [chatIntent, setChatIntent] = useState(null);
//   const [joinChatId, setJoinChatId] = useState("");

//   const handleConnect = () => {
//     if (userName.trim() === "") {
//       alert("Please enter a username");
//       return;
//     }
//     setConnected(true);
//   };

//   const handleCreateChat = () => {
//     setChatIntent({ type: "CREATE" });
//   };

//   const handleJoinChat = () => {
//     if (!joinChatId.trim()) {
//       alert("Enter Chat ID");
//       return;
//     }
//     setChatIntent({ type: "JOIN", chatId: joinChatId });
//   };

//   const handleDisconnect = () => {
//     setConnected(false);
//     setChatIntent(null);
//     setUserName("");
//     setJoinChatId("");
//   };

//   return (
//     <div className="App">
//       {/* Warning message at the top */}
//       <div className="warning" style={{ backgroundColor: "#ffcc00", padding: 10, color: "#000", fontWeight: "bold" }}>
//         ⚠️ This site is for educational purposes only. Do not use it for any illegal activity.
//       </div>

//       <header className="App-header">
//         {/* Step 1: Enter Name */}
//         {!connected && (
//           <div>
//             <h2>Enter your name</h2>
//             <input
//               placeholder="Enter your name"
//               value={userName}
//               onChange={(e) => setUserName(e.target.value)}
//             />
//             <button onClick={handleConnect} style={{ marginLeft: 10 }}>Continue</button>
//           </div>
//         )}

//         {/* Step 2: Show Create/Join options */}
//         {connected && !chatIntent && (
//           <div style={{ marginTop: 20 }}>
//             <h3>Hello {userName}, create or join a chat</h3>

//             <button onClick={handleCreateChat} style={{ marginRight: 10 }}>Create Chat</button>

//             <input
//               placeholder="Enter Chat ID"
//               value={joinChatId}
//               onChange={(e) => setJoinChatId(e.target.value)}
//             />
//             <button onClick={handleJoinChat} style={{ marginLeft: 10 }}>Join Chat</button>

//             <div style={{ marginTop: 20 }}>
//               <button onClick={handleDisconnect} style={{ backgroundColor: "#f44336", color: "#fff", padding: "5px 10px" }}>
//                 Disconnect
//               </button>
//             </div>
//           </div>
//         )}

//         {/* Step 3: Open Chat Window */}
//         {connected && chatIntent && (
//           <WebsocketChat username={userName} chatIntent={chatIntent} onDisconnect={handleDisconnect} />
//         )}
//       </header>

//       {/* Info message at the bottom */}
//       <div style={{ marginTop: 20, padding: 10, fontSize: 14, color: "#555" }}>
//         This website is purely open-source. No data is stored in the backend or anywhere else. Only you and another session with the session ID can access the chat.
//       </div>
//     </div>
//   );
// }

// export default App;
