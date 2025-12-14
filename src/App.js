// import { useState } from "react";
// import './App.css';
// import Websocket from './components/Websocket';

// function App() {
//   const [connected, setConnected] = useState(false);
//   const [userName ,setUserName]   = useState("");

//   const handleConnect = () => {
//     if(userName.trim()===""){
//       alert("Please Enter UserName");
//       return;
//     }
//     setConnected(true); 
//   };

//   return (
//     <div className="App">
//       <header className="App-header">

        
//         {!connected && (
//           <div className="inputs">
//             <div className="name">
//               Name : <input 
//                       className="userName" 
//                       placeholder="Enter your Name" 
//                       value={userName}
//                       onChange={(e)=>setUserName(e.target.value)}
//                       />
//             </div>
//             <div>
//               <button onClick={handleConnect}>Connect</button>
//             </div>
//           </div>
//         )}

     
//         {connected && <Websocket username={userName}/>}
//       </header>
//     </div>
//   );
// }

// export default App;


// import { useState } from "react";
// import "./App.css";
// import WebsocketChat from "./components/Websocket";

// function App() {
//   const [connected, setConnected] = useState(false);
//   const [userName, setUserName] = useState("");
//   const [chatIntent, setChatIntent] = useState(null); // { type: "CREATE" } or { type: "JOIN", chatId: "..." }

//   const [joinChatId, setJoinChatId] = useState("");

//   const handleConnect = () => {
//     if (userName.trim() === "") {
//       alert("Please enter username");
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

//   return (
//     <div className="App">
//       <header className="App-header">
//         {!connected && (
//           <div>
//             <h2>Enter your name to continue</h2>
//             <input
//               placeholder="Enter your name"
//               value={userName}
//               onChange={(e) => setUserName(e.target.value)}
//             />
//             <button onClick={handleConnect}>Continue</button>
//           </div>
//         )}

//         {connected && !chatIntent && (
//           <div style={{ marginTop: 20 }}>
//             <h3>Hello {userName}, create or join chat</h3>

//             <button onClick={handleCreateChat} style={{ marginRight: 10 }}>
//               Create Chat
//             </button>

//             <input
//               placeholder="Enter Chat ID"
//               value={joinChatId}
//               onChange={(e) => setJoinChatId(e.target.value)}
//             />
//             <button onClick={handleJoinChat}>Join Chat</button>
//           </div>
//         )}

//         {connected && chatIntent && (
//           <WebsocketChat username={userName} chatIntent={chatIntent} />
//         )}
//       </header>
//     </div>
//   );
// }

// export default App;

import { useState } from "react";
import "./App.css";
import WebsocketChat from "./components/Websocket";

function App() {
  const [connected, setConnected] = useState(false);
  const [userName, setUserName] = useState("");
  const [chatIntent, setChatIntent] = useState(null);
  const [joinChatId, setJoinChatId] = useState("");

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
    setChatIntent({ type: "JOIN", chatId: joinChatId });
  };

  return (
    <div className="App">
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
        )}

        {/* Step 3: Open Chat Window */}
        {connected && chatIntent && (
          <WebsocketChat username={userName} chatIntent={chatIntent} />
        )}
      </header>
    </div>
  );
}

export default App;
