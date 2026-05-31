import { useEffect, useState } from "react";
import WebsocketChat from "./components/Websocket";

function App() {
  const [connected, setConnected] = useState(false);
  const [userName, setUserName] = useState("");
  const [chatIntent, setChatIntent] = useState(null);
  const [joinChatId, setJoinChatId] = useState("");
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    if (stored) setTheme(stored);
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("theme", next);
  };

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

    const cleanedChatId = joinChatId.replace(/[^a-zA-Z0-9]/g, "");
    setChatIntent({ type: "JOIN", chatId: cleanedChatId });
  };

  const handleDetailsToggle = () => {
    setDetailsOpen(!detailsOpen);
  };

  if (connected && chatIntent) {
    return <WebsocketChat username={userName} chatIntent={chatIntent} theme={theme} />;
  }

  const dark = theme === "dark";

  const panelClass = dark ? 'bg-slate-900/95 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900';
  const headerCardClass = dark ? 'bg-slate-950/80 border-slate-800' : 'bg-white/90 border-slate-200';
  const innerCardClass = dark ? 'bg-slate-950/80 border-slate-800 text-slate-200' : 'bg-white border-slate-200 text-slate-900';
  const inputClass = dark
    ? 'w-full rounded-3xl border border-slate-700 bg-slate-900 px-4 py-4 text-base text-white outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20'
    : 'w-full rounded-3xl border border-slate-200 bg-white px-4 py-4 text-base text-slate-900 outline-none transition focus:border-cyan-600 focus:ring-2 focus:ring-cyan-300';
  const primaryBtn = dark ? 'w-full rounded-3xl bg-cyan-500 px-6 py-4 text-base font-semibold text-slate-950 transition hover:bg-cyan-400' : 'w-full rounded-3xl bg-cyan-600 px-6 py-4 text-base font-semibold text-white transition hover:bg-cyan-500';
  const secondaryBtn = dark ? 'w-full rounded-3xl bg-violet-500 px-6 py-4 text-base font-semibold text-white transition hover:bg-violet-400' : 'w-full rounded-3xl bg-violet-600 px-6 py-4 text-base font-semibold text-white transition hover:bg-violet-500';
  const mutedText = dark ? 'text-slate-400' : 'text-slate-600';

  return (
    <div className={"min-h-screen " + (dark ? "bg-slate-950 text-slate-100" : "bg-white text-slate-900") }>
      <div className="fixed inset-x-0 top-0 z-50 bg-amber-300 text-slate-950 text-center py-3 px-4 font-semibold shadow-lg">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div>⚠️ This site is for educational purposes only. Do not use it for any illegal activity.</div>
          <div className="flex items-center gap-3">
            <button onClick={toggleTheme} className="rounded-full px-3 py-1 text-sm bg-slate-800 text-white">{dark ? '🌙 Dark' : '☀️ Light'}</button>
          </div>
        </div>
      </div>

      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 pt-24 pb-10 sm:px-6">
        <div className={`rounded-[2rem] p-6 shadow-2xl backdrop-blur-xl sm:p-10 ${panelClass} border`}>
          <div className={`mb-8 flex flex-col gap-4 rounded-[1.75rem] p-6 sm:flex-row sm:items-center sm:justify-between ${headerCardClass} border`}>
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Realtime chat app</p>
              <h1 className={`mt-3 text-4xl font-semibold ${dark ? 'text-white' : 'text-slate-900'} sm:text-5xl`}>FreeChat</h1>
              <p className={`mt-3 max-w-2xl ${mutedText} sm:text-lg`}>
                A responsive chat interface with WebSocket support. Create or join a chat from any device.
              </p>
            </div>
            <div className={`rounded-3xl px-4 py-4 text-sm shadow-inner sm:px-6 ${dark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-800'}`}>
              Mobile + desktop friendly UI
            </div>
          </div>

          {!connected && (
            <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
              <div className={`rounded-[1.75rem] p-6 shadow-inner ${innerCardClass} border`}>
                <h2 className={`text-2xl font-semibold ${dark ? 'text-white' : 'text-slate-900'}`}>Welcome back</h2>
                <p className={`mt-3 ${mutedText}`}>
                  Start by entering your display name so you can create a new chat room or join an existing one.
                </p>
                <div className="mt-8 space-y-5">
                  <label className={`block text-sm font-medium ${dark ? 'text-slate-300' : 'text-slate-700'}`}>Username</label>
                  <input className={inputClass} placeholder="Enter your name" value={userName} onChange={(e) => setUserName(e.target.value)} />
                  <button onClick={handleConnect} className={primaryBtn}>Continue</button>
                </div>
              </div>

              <div className={`rounded-[1.75rem] p-6 shadow-xl ${dark ? 'bg-gradient-to-br from-slate-950/80 via-slate-900 to-slate-950/80 text-slate-200' : 'bg-white border border-slate-200 text-slate-900'}`}>
                <div className={`rounded-3xl p-5 ${dark ? 'bg-slate-900/80' : 'bg-white'}`}>
                  <p className={`text-sm uppercase tracking-[0.3em] ${dark ? 'text-cyan-200/80' : 'text-cyan-600/80'}`}>How it works</p>
                  <ul className={`mt-5 space-y-4 ${mutedText}`}>
                    <li className={`rounded-3xl p-4 border ${dark ? 'border-slate-800 bg-slate-950/70' : 'border-slate-200 bg-slate-50'}`}>
                      <span className={`font-semibold ${dark ? 'text-white' : 'text-slate-900'}`}>1.</span> Create a chat room and share the ID.
                    </li>
                    <li className={`rounded-3xl p-4 border ${dark ? 'border-slate-800 bg-slate-950/70' : 'border-slate-200 bg-slate-50'}`}>
                      <span className={`font-semibold ${dark ? 'text-white' : 'text-slate-900'}`}>2.</span> Paste a chat ID to join an active session.
                    </li>
                    <li className={`rounded-3xl p-4 border ${dark ? 'border-slate-800 bg-slate-950/70' : 'border-slate-200 bg-slate-50'}`}>
                      <span className={`font-semibold ${dark ? 'text-white' : 'text-slate-900'}`}>3.</span> Chat instantly with another browser session.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {connected && !chatIntent && (
            <div className={`rounded-[1.75rem] p-6 shadow-inner ${innerCardClass} border`}>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Ready to connect</p>
                  <h2 className="mt-2 text-3xl font-semibold">Hello {userName}</h2>
                </div>
                <p className="text-sm text-slate-400">Choose create or paste a chat ID to join.</p>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-[1fr_auto]">
                <button
                  onClick={handleCreateChat}
                  className={primaryBtn}
                >
                  Create Chat
                </button>
                <div className="space-y-4">
                  <input className={inputClass} placeholder="Enter Chat ID" value={joinChatId} onChange={(e) => setJoinChatId(e.target.value)} />
                  <button onClick={handleJoinChat} className={secondaryBtn}>Join Chat</button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 flex flex-col gap-4">
          <button onClick={handleDetailsToggle} className={`self-start rounded-full px-5 py-3 text-sm font-medium transition ${dark ? 'border border-slate-700 bg-slate-900/90 text-slate-200 hover:border-cyan-400 hover:text-white' : 'border border-slate-200 bg-white text-slate-900 hover:border-cyan-600 hover:text-white'}`}>
            {detailsOpen ? "Hide details" : "Show details"}
          </button>

          {detailsOpen && (
            <div className={`rounded-[1.75rem] p-6 shadow-xl ${dark ? 'bg-slate-900/95 text-slate-300 border border-slate-800' : 'bg-white text-slate-900 border border-slate-200'}`}>
              <div className={`space-y-4 text-sm leading-7 sm:text-base ${mutedText}`}>
                <p>
                  This website is fully open-source and does not store chat data in a backend. Only participants with the chat ID can join the session.
                </p>
                <p>
                  Explore the repositories on GitHub for the frontend and backend implementation.
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <a
                    href="https://github.com/rupesh4950/FreeChatFrontend.git"
                    className={`rounded-3xl px-4 py-4 transition ${dark ? 'border border-slate-700 bg-slate-950/80 text-cyan-300 hover:border-cyan-400 hover:bg-slate-900' : 'border border-slate-200 bg-white text-cyan-600 hover:bg-slate-50'}`} 
                  >
                    Frontend Code
                  </a>
                  <a
                    href="https://github.com/rupesh4950/FreeChatBackend.git"
                    className={`rounded-3xl px-4 py-4 transition ${dark ? 'border border-slate-700 bg-slate-950/80 text-cyan-300 hover:border-cyan-400 hover:bg-slate-900' : 'border border-slate-200 bg-white text-cyan-600 hover:bg-slate-50'}`} 
                  >
                    Backend Code
                  </a>
                </div>
                <p className={mutedText}>
                  Need a new feature? Send a request to{' '}
                  <a className="text-cyan-300 hover:text-cyan-200" href="mailto:aestheontechnologies@gmail.com?subject=Feature Request - FreeChat">
                    aestheontechnologies@gmail.com
                  </a>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;

