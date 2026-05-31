import React, { useEffect, useRef, useState } from "react";

export default function WebsocketChat({ username, chatIntent, theme = 'dark' }) {
  const ws = useRef(null);
  const [chatId, setChatId] = useState(null);
  const [status, setStatus] = useState("connecting");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const inputRef = useRef(null);

  const messagesEndRef = useRef(null);
  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

  useEffect(() => scrollToBottom(), [messages]);

  useEffect(() => {
    const WS_URL = process.env.REACT_APP_WEBSOCKET_URL || "ws://localhost:8080/websocket";
    ws.current = new WebSocket(WS_URL);

    ws.current.onopen = () => {
      setStatus("open");
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

    ws.current.onerror = (err) => {
      console.error("WebSocket error:", err);
      setStatus("error");
    };

    ws.current.onclose = () => {
      console.warn("WebSocket closed");
      setStatus("closed");
    };

    return () => ws.current?.close();
  }, [username, chatIntent]);

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

  const formatChatId = (id) => {
    if (!id) return "Connecting...";
    return id.match(/.{1,3}/g).join("-");
  };

  const copyChatId = async () => {
    if (!chatId) return;
    try {
      await navigator.clipboard.writeText(chatId);
      // small visual confirmation could be added later
    } catch (e) {
      console.warn("Copy failed", e);
    }
  };

  const leaveChat = () => {
    try {
      ws.current?.close();
    } finally {
      // simple reset: reload page to return to entry UI
      window.location.reload();
    }
  };

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, [chatId]);

  const dark = theme === 'dark';
  const mainBg = dark ? 'bg-slate-950 text-slate-100' : 'bg-white text-slate-900';
  const panelBg = dark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200';
  const messageMe = dark ? 'bg-cyan-500 text-slate-950' : 'bg-cyan-200 text-slate-900';
  const messageOther = dark ? 'bg-slate-800 text-slate-100' : 'bg-slate-100 text-slate-900';
  const alertMsg = dark ? 'bg-slate-700 text-slate-200' : 'bg-amber-100 text-slate-900';
  const mutedText = dark ? 'text-slate-400' : 'text-slate-600';

  return (
    <main className={"min-h-screen " + mainBg}>
      <div className={"sticky top-0 z-30 border-b " + (dark ? 'border-slate-800' : 'border-slate-200') + " bg-opacity-95 px-4 py-4 backdrop-blur-md sm:px-6 " }>
        <div className="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Chat session</p>
            <div className="flex items-center gap-3">
              <h1 className={`mt-2 text-2xl font-semibold ${dark ? 'text-white' : 'text-slate-900'} sm:text-3xl`}>{username}</h1>
              <div className={`flex items-center gap-2 text-sm ${mutedText}`}>
                <span className={`inline-block h-2 w-2 rounded-full ${status === 'open' ? 'bg-green-400' : status === 'connecting' ? 'bg-yellow-400' : 'bg-red-400'}`}></span>
                <span>{status === 'open' ? 'Connected' : status === 'connecting' ? 'Connecting...' : status === 'error' ? 'Error' : 'Disconnected'}</span>
              </div>
            </div>
            <p className={`mt-2 text-sm ${mutedText} sm:text-base`}>
              Chat ID: <span className={`rounded-full px-3 py-1 ${dark ? 'bg-slate-900 text-cyan-300' : 'bg-slate-100 text-cyan-700'}`}>{formatChatId(chatId)}</span>
            </p>
          </div>
          <div className="flex gap-3">
            <button onClick={copyChatId} className={"rounded-3xl px-4 py-2 text-sm " + (dark ? 'bg-slate-800 text-slate-200 hover:bg-slate-700' : 'bg-slate-100 text-slate-900 hover:bg-slate-200')}>Copy ID</button>
            <button onClick={leaveChat} className={"rounded-3xl px-4 py-2 text-sm " + (dark ? 'bg-rose-600 text-white hover:bg-rose-500' : 'bg-rose-200 text-rose-900 hover:bg-rose-300')}>Leave</button>
          </div>
        </div>
      </div>

      <section className="mx-auto flex max-w-6xl flex-1 flex-col gap-5 px-4 py-6 sm:px-6">
        <div className={"rounded-[2rem] p-4 shadow-2xl sm:p-6 " + panelBg + " border"}>
          <div className={"h-[60vh] min-h-[28rem] overflow-y-auto rounded-[1.75rem] p-4 shadow-inner sm:p-6 " + (dark ? 'bg-slate-950/80' : 'bg-white') }>
            <div className="flex flex-col gap-4">
              {messages.length === 0 && (
                <div className={`text-center ${mutedText}`}>No messages yet — say hello 👋</div>
              )}

              {messages.map((msg, i) => {
                const isMe = msg.userName === username;
                const isAlert = msg.type === "ALERT";
                const meta = !isAlert && (isMe ? 'You' : msg.userName);
                return (
                  <div
                    key={i}
                    className={`flex ${isAlert ? "justify-center" : isMe ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-[1.5rem] px-4 py-3 text-sm leading-6 shadow-sm sm:text-base ${
                        isAlert
                          ? alertMsg
                          : isMe
                          ? messageMe
                          : messageOther
                      }`}
                    >
                      {!isAlert && (
                        <div className={`mb-2 flex items-center justify-between text-xs uppercase tracking-[0.24em] sm:text-sm ${mutedText}`}>
                          <span className="opacity-100 text-black text-bold">{meta}</span>
                          <span className="opacity-70 text-black">{msg.timestamp || ""}</span>
                        </div>
                      )}
                      <div className="whitespace-pre-wrap">{msg.message}</div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
          </div>
        </div>

        <div className={"rounded-[2rem] p-4 shadow-2xl sm:p-5 " + panelBg + " border"}>
          <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder={chatId ? "Type your message..." : "Waiting for chat id..."}
              disabled={!chatId}
              className={"min-h-[3.5rem] rounded-3xl px-4 py-3 text-base outline-none transition focus:ring-2 disabled:opacity-60 disabled:cursor-not-allowed " + (dark ? 'border border-slate-700 bg-slate-950 text-white focus:border-cyan-400 focus:ring-cyan-500/20' : 'border border-slate-200 bg-white text-slate-900 focus:border-cyan-600 focus:ring-cyan-300')}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || !chatId}
              className={"inline-flex items-center justify-center rounded-3xl px-6 py-4 text-base font-semibold transition sm:px-8 disabled:opacity-60 disabled:cursor-not-allowed " + (dark ? 'bg-cyan-500 text-slate-950 hover:bg-cyan-400' : 'bg-cyan-600 text-white hover:bg-cyan-500')}
            >
              Send
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}

