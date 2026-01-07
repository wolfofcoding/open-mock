"use client";

import React, { useState, useRef, useCallback } from "react";
import { toPng } from 'html-to-image';
import { 
  Download, Send, User, Trash2, Upload, MessageSquare, Youtube, 
  Monitor, Smartphone, Video, Phone, Camera, Mic, Image as ImageIcon, Smile, Menu,
  XCircle, RefreshCw
} from "lucide-react";

// --- Types & Initial State ---
type Message = {
  id: number;
  text: string;
  sender: "me" | "them";
  timestamp: string;
};

// All 16 platforms
type Theme = 
  | "whatsapp" | "discord" | "imessage" | "instagram" 
  | "line" | "messenger" | "teams" | "reddit" 
  | "signal" | "slack" | "snapchat" | "telegram" 
  | "tiktok" | "tinder" | "wechat" | "twitter";

type Device = "mobile" | "desktop";

export default function Home() {
  const [theme, setTheme] = useState<Theme>("whatsapp");
  const [device, setDevice] = useState<Device>("mobile");
  
  // --- CUSTOMIZATION ---
  const [theirName, setTheirName] = useState("Pepe");
  
  // SAFE FROG AVATAR (Built-in SVG)
  const [theirAvatar, setTheirAvatar] = useState("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NCA2NCI+PGNpcmNsZSBjeD0iMzIiIGN5PSIzMiIgcj0iMzAiIGZpbGw9IiM0Q0RCOTUiLz48Y2lyY2xlIGN4PSIyMCIgY3k9IjI0IiByPSI1IiBmaWxsPSIjMzMzIi8+PGNpcmNsZSBjeD0iNDQiIGN5PSIyNCIgcj0iNSIgZmlsbD0iIzMzMyIvPjxwYXRoIGQ9Ik0yMCAzOCBRMzIgNTIgNDQgMzgiIHN0cm9rZT0iIzMzMyIgc3Ryb2tlLXdpZHRoPSIzIiBmaWxsPSJub25lIiBzdHJva2UtbGluZWNhcD0icm91bmQiLz48L3N2Zz4=");
  
  const [showWatermark, setShowWatermark] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const chatRef = useRef<HTMLDivElement>(null);

  // --- Actions ---
  const addMessage = (sender: "me" | "them") => {
    if (!inputText.trim()) return;
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages([...messages, { id: Date.now(), text: inputText, sender, timestamp: time }]);
    setInputText("");
  };

  const deleteMessage = (id: number) => {
    setMessages(messages.filter((m) => m.id !== id));
  };

  const clearAllMessages = () => {
    if(confirm("Are you sure you want to clear all messages?")) {
        setMessages([]);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setTheirAvatar(URL.createObjectURL(e.target.files[0]));
    }
  };

  const downloadImage = useCallback(async () => {
    if (chatRef.current === null) return;

    try {
      // 1. Force a small delay to let images load
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // 2. Capture the image
      const dataUrl = await toPng(chatRef.current, { 
        cacheBust: false, // <--- FIXED: Must be FALSE to support custom uploads
        pixelRatio: 2,
        skipAutoScale: true,
        backgroundColor: 'transparent'
      });
      
      const link = document.createElement('a');
      link.download = `mockchat-${theme}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Failed to download image", err);
      alert("Error: If this persists, try refreshing the page.");
    }
  }, [chatRef, theme]);

  // --- Theme Styles Config ---
  const getThemeStyles = () => {
    const commonBubble = "relative max-w-[85%] px-3 py-2 text-[15px] leading-5 shadow-sm break-words transition-all group";
    
    switch (theme) {
      case "whatsapp":
        return {
          container: "bg-[#e5ddd5] font-sans",
          header: "bg-[#075e54] text-white",
          meBubble: `${commonBubble} bg-[#dcf8c6] text-black rounded-tr-none`,
          themBubble: `${commonBubble} bg-white text-black rounded-tl-none`,
          layout: "bubble",
        };
      case "imessage":
        return {
          container: "bg-white font-sans",
          header: "bg-[#f5f5f5]/90 text-black border-b backdrop-blur-md",
          meBubble: `${commonBubble} bg-[#007aff] text-white rounded-2xl rounded-br-sm`,
          themBubble: `${commonBubble} bg-[#e5e5ea] text-black rounded-2xl rounded-bl-sm`,
          layout: "bubble",
        };
      case "instagram":
        return {
          container: "bg-white font-sans",
          header: "bg-white text-black border-b",
          meBubble: `${commonBubble} bg-[#efefef] text-black rounded-[22px] rounded-br-lg`,
          themBubble: `${commonBubble} border border-[#dbdbdb] bg-white text-black rounded-[22px] rounded-bl-lg`,
          layout: "bubble",
        };
      case "telegram":
        return {
          container: "bg-[#8cabd9] font-sans", 
          header: "bg-[#517da2] text-white",
          meBubble: `${commonBubble} bg-[#effdde] text-black rounded-tr-none shadow-sm`,
          themBubble: `${commonBubble} bg-white text-black rounded-tl-none shadow-sm`,
          layout: "bubble",
        };
      case "messenger":
        return {
          container: "bg-white font-sans",
          header: "bg-white text-black border-b shadow-sm",
          meBubble: `${commonBubble} bg-[#0084ff] text-white rounded-[20px]`,
          themBubble: `${commonBubble} bg-[#e4e6eb] text-black rounded-[20px]`,
          layout: "bubble",
        };
      case "line":
        return {
          container: "bg-[#849ebf] font-sans",
          header: "bg-[#232d4b] text-white opacity-90",
          meBubble: `${commonBubble} bg-[#7dec65] text-black rounded-[20px] rounded-tr-none`,
          themBubble: `${commonBubble} bg-white text-black rounded-[20px] rounded-tl-none`,
          layout: "bubble",
        };
       case "reddit":
        return {
          container: "bg-white font-sans",
          header: "bg-white text-black border-b border-gray-200",
          meBubble: `${commonBubble} bg-[#0079d3] text-white rounded-[20px]`,
          themBubble: `${commonBubble} bg-[#f0f0f0] text-black rounded-[20px]`,
          layout: "bubble",
        };
      case "signal":
        return {
          container: "bg-white font-sans",
          header: "bg-white text-black border-b",
          meBubble: `${commonBubble} bg-[#2c6bed] text-white rounded-[18px] rounded-br-md`,
          themBubble: `${commonBubble} bg-[#f6f6f6] text-black rounded-[18px] rounded-bl-md`,
          layout: "bubble",
        };
      case "snapchat":
        return {
          container: "bg-white font-sans",
          header: "bg-white text-[#00b2ff] border-b font-bold border-gray-100",
          meBubble: `${commonBubble} border-l-2 border-[#f23c57] bg-white text-black pl-3 py-1`,
          themBubble: `${commonBubble} border-l-2 border-[#00b2ff] bg-white text-black pl-3 py-1`,
          layout: "bubble",
        };
      case "tiktok":
        return {
          container: "bg-[#121212] font-sans text-white",
          header: "bg-[#121212] text-white border-b border-gray-800",
          meBubble: `${commonBubble} bg-[#fe2c55] text-white rounded-[12px]`,
          themBubble: `${commonBubble} bg-[#2f2f2f] text-white rounded-[12px]`,
          layout: "bubble",
        };
      case "tinder":
        return {
          container: "bg-white font-sans",
          header: "bg-gradient-to-r from-[#fd267d] to-[#ff6036] text-white",
          meBubble: `${commonBubble} bg-[#fd267d] text-white rounded-2xl rounded-br-none`,
          themBubble: `${commonBubble} bg-[#f0f0f0] text-black rounded-2xl rounded-bl-none`,
          layout: "bubble",
        };
      case "wechat":
        return {
          container: "bg-[#f5f5f5] font-sans",
          header: "bg-[#ededed] text-black border-b border-gray-300",
          meBubble: `${commonBubble} bg-[#a0e75a] text-black rounded-[4px] rounded-tr-none border border-[#8bc253]`,
          themBubble: `${commonBubble} bg-white text-black rounded-[4px] rounded-tl-none border border-gray-200`,
          layout: "bubble",
        };

      // --- AVATAR ROW LAYOUTS ---
      case "discord":
        return {
          container: "bg-[#36393f] font-sans text-white",
          header: "bg-[#2f3136] text-white border-b border-black/20", 
          meBubble: "", themBubble: "",
          layout: "avatar-row",
        };
      case "twitter":
        return {
          container: "bg-black font-sans text-white",
          header: "bg-black text-white border-b border-gray-800",
          meBubble: "", themBubble: "",
          layout: "avatar-row",
        };
      case "teams":
        return {
          container: "bg-[#f5f5f5] font-sans text-black",
          header: "bg-[#464775] text-white border-b border-[#3b3c64]",
          meBubble: "", themBubble: "",
          layout: "avatar-row",
        };
      case "slack":
        return {
          container: "bg-white font-sans text-black",
          header: "bg-[#350d36] text-white",
          meBubble: "", themBubble: "",
          layout: "avatar-row",
        };
    }
  };

  const styles = getThemeStyles();
  const themeList: Theme[] = [
    "whatsapp", "discord", "imessage", "instagram", 
    "line", "messenger", "teams", "reddit", 
    "signal", "slack", "snapchat", "telegram", 
    "tiktok", "tinder", "wechat", "twitter"
  ];

  return (
    <div className="min-h-screen bg-neutral-900 text-white flex flex-col md:flex-row font-sans">
      
      {/* --- LEFT SIDEBAR --- */}
      <div className="w-full md:w-[400px] bg-neutral-800 p-6 border-r border-neutral-700 flex flex-col gap-6 overflow-y-auto h-screen z-10 shadow-xl">
        <div className="flex flex-col gap-1 mb-2">
          <div className="flex items-center gap-2">
            <MessageSquare className="text-green-500" />
            <h1 className="text-3xl font-black italic tracking-tighter text-white">MockChat</h1>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-yellow-400 bg-yellow-400/10 w-fit px-2 py-1 rounded">
            <Youtube size={12} /><span>BUILT BY CRYPTUBER</span>
          </div>
        </div>
        
        {/* Themes */}
        <div className="space-y-2">
          <label className="text-xs uppercase tracking-wider font-semibold text-neutral-400">Theme Style ({themeList.length})</label>
          <div className="grid grid-cols-3 gap-2 max-h-[200px] overflow-y-auto custom-scrollbar pr-2">
            {themeList.map((t) => (
              <button key={t} onClick={() => setTheme(t)} className={`px-2 py-2 rounded capitalize text-[12px] font-medium transition-all border truncate ${theme === t ? "bg-green-600 border-green-500 text-white" : "bg-neutral-700 border-neutral-600 hover:bg-neutral-600 text-gray-300"}`}>{t}</button>
            ))}
          </div>
        </div>

        {/* Character Info */}
        <div className="space-y-2 border-t border-neutral-700 pt-4">
          <label className="text-xs uppercase tracking-wider font-semibold text-neutral-400">Character Info</label>
          <div className="flex gap-2">
             <input type="text" value={theirName} onChange={(e) => setTheirName(e.target.value)} className="bg-neutral-900 border border-neutral-600 rounded px-3 py-2 w-full text-sm focus:outline-none focus:border-green-500 transition-colors" placeholder="Name" />
            <label className="cursor-pointer bg-neutral-700 border border-neutral-600 p-2 rounded hover:bg-neutral-600 transition-colors group relative">
              <Upload size={20} className="text-gray-300 group-hover:text-white" />
              <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
            </label>
          </div>
        </div>
        
        <div className="flex items-center gap-2 border-t border-neutral-700 pt-4">
           <input type="checkbox" checked={showWatermark} onChange={(e) => setShowWatermark(e.target.checked)} className="w-4 h-4 accent-green-500" />
           <label className="text-sm text-gray-300 select-none">Show Cryptuber Watermark</label>
        </div>

        {/* Conversation Controls */}
        <div className="space-y-2 border-t border-neutral-700 pt-4">
          <div className="flex justify-between items-center">
             <label className="text-xs uppercase tracking-wider font-semibold text-neutral-400">Conversation</label>
             <button onClick={clearAllMessages} className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1"><Trash2 size={12}/> Clear All</button>
          </div>
          
          <textarea value={inputText} onChange={(e) => setInputText(e.target.value)} onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); addMessage("me"); }}} className="w-full bg-neutral-900 border border-neutral-600 rounded px-3 py-2 min-h-[100px] focus:outline-none focus:border-green-500 transition-colors text-sm" placeholder="Type a message..." />
          <div className="flex gap-2">
            <button onClick={() => addMessage("them")} className="flex-1 bg-neutral-700 hover:bg-neutral-600 border border-neutral-600 py-2 rounded text-sm font-medium flex items-center justify-center gap-2 transition-all"><User size={16} /> Them</button>
            <button onClick={() => addMessage("me")} className="flex-1 bg-green-600 hover:bg-green-500 border border-green-500 py-2 rounded text-sm font-medium flex items-center justify-center gap-2 transition-all"><Send size={16} /> Me</button>
          </div>
        </div>

        <div className="mt-auto border-t border-neutral-700 pt-6 pb-6">
          <button onClick={downloadImage} className="w-full bg-white hover:bg-gray-200 text-black py-3 rounded font-bold flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95"><Download size={20} /> Download HD Image</button>
        </div>
      </div>

      {/* --- RIGHT SIDE: PREVIEW --- */}
      <div className="flex-1 bg-[#F0F2F5] flex flex-col items-center justify-center p-4 md:p-8 overflow-hidden relative transition-colors duration-500">
        
        {/* Mockup Container */}
        <div 
          ref={chatRef} 
          style={{ 
             width: device === 'mobile' ? '375px' : '100%', 
             maxWidth: device === 'mobile' ? '375px' : '800px'
          }}
          className={`min-h-[667px] shadow-2xl relative flex flex-col overflow-hidden transition-all duration-500 ease-in-out ${styles.container} ${device === 'desktop' ? 'rounded-lg border border-gray-300' : ''}`}
        >
          
          {/* HEADER */}
          <div className={`h-16 flex items-center px-4 gap-3 z-10 shrink-0 ${styles.header}`}>
              {styles.layout === "bubble" && (
                 <div className="w-5 h-5 flex items-center justify-center -ml-1 cursor-pointer"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg></div>
              )}
              
              <img src={theirAvatar} className="w-10 h-10 rounded-full object-cover bg-gray-100 flex-shrink-0 border border-black/10" />
              <div className="flex flex-col overflow-hidden flex-1">
                <span className="font-bold text-base leading-tight truncate">{theirName}</span>
                <span className="text-xs opacity-80">Online</span>
              </div>

              {/* Header Icons */}
              <div className="flex gap-4 opacity-90 px-2">
                 <Video size={20} className="cursor-pointer hover:opacity-70" />
                 <Phone size={18} className="cursor-pointer hover:opacity-70" />
              </div>
          </div>

          {/* MESSAGES - Safe Pattern Background */}
          <div 
             className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar relative"
             style={{
                backgroundImage: theme === 'whatsapp' ? 'radial-gradient(#cbd5e1 1px, transparent 1px)' : 'none', 
                backgroundSize: '20px 20px',
                opacity: 1
             }}
          >
            {showWatermark && <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03]"><span className="text-4xl font-black -rotate-45">CRYPTUBER</span></div>}

            {/* EMPTY STATE MSG */}
            {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full opacity-30 text-center px-8 gap-2">
                    <MessageSquare size={48} />
                    <p className="text-sm font-medium">No messages yet.</p>
                    <p className="text-xs">Type in the sidebar to start chatting!</p>
                </div>
            )}

            {messages.map((msg) => {
              // Avatar Row Layout
              if (styles.layout === "avatar-row") {
                const isDiscord = theme === 'discord';
                const isTwitter = theme === 'twitter';
                const nameColor = (isDiscord || isTwitter) ? "text-white" : "text-black";
                const textColor = isDiscord ? "text-[#dcddde]" : (isTwitter ? "text-white" : "text-black");
                
                return (
                  <div key={msg.id} className={`flex gap-3 group p-1 -mx-2 px-2 relative mt-2 ${isDiscord ? "hover:bg-black/5" : ""}`}>
                    <button onClick={() => deleteMessage(msg.id)} className="absolute right-2 top-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity bg-neutral-800 p-1 rounded z-20 cursor-pointer"><Trash2 size={12} /></button>
                    <div className="w-10 h-10 rounded-full bg-gray-500 overflow-hidden shrink-0 mt-0.5">
                      {msg.sender === "them" ? <img src={theirAvatar} className="w-full h-full object-cover" /> : <div className={`w-full h-full flex items-center justify-center text-[10px] font-bold text-white ${isDiscord ? 'bg-[#5865F2]' : 'bg-blue-600'}`}>ME</div>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-2">
                        <span className={`font-bold text-[15px] ${msg.sender === "me" && isDiscord ? "text-yellow-500" : nameColor}`}>{msg.sender === "them" ? theirName : "Me"}</span>
                        <span className="text-[12px] text-gray-400 font-medium">{msg.timestamp}</span>
                      </div>
                      <p className={`text-[15px] leading-[1.375rem] font-light ${textColor}`}>{msg.text}</p>
                    </div>
                  </div>
                );
              }

              // Bubble Layout
              const isMe = msg.sender === "me";
              const showAvatar = !isMe && (theme === 'messenger' || theme === 'instagram' || theme === 'line' || theme === 'tiktok');
              
              return (
                <div key={msg.id} className={`flex w-full group ${isMe ? "justify-end" : "justify-start"} mb-1`}>
                   {showAvatar && <img src={theirAvatar} className="w-8 h-8 rounded-full object-cover mr-2 self-end mb-[2px]" />}
                   <div className={`${isMe ? styles.meBubble : styles.themBubble}`}>
                      {/* DELETE BUTTON */}
                      <button 
                        onClick={() => deleteMessage(msg.id)}
                        className="absolute -top-3 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm z-20 cursor-pointer text-xs font-bold"
                      >
                        ×
                      </button>

                      <p>{msg.text}</p>
                      {theme !== 'messenger' && theme !== 'instagram' && theme !== 'snapchat' && (
                        <span className={`text-[10px] block text-right mt-1 select-none ${theme === 'imessage' && isMe ? 'text-blue-100' : 'opacity-60'}`}>{msg.timestamp}</span>
                      )}
                   </div>
                </div>
              );
            })}
          </div>

          {/* FOOTER */}
          <div className={`h-16 flex items-center px-4 gap-3 border-t shrink-0 ${styles.layout === 'avatar-row' ? 'bg-transparent border-none px-4 pb-4' : 'bg-white/90 backdrop-blur-sm border-black/5'}`}>
             {styles.layout === 'avatar-row' ? (
                <div className="flex items-center gap-3 w-full bg-[#40444b] p-2 rounded-lg text-gray-400">
                    <div className="bg-gray-500/20 p-1 rounded-full"><span className="text-xl">+</span></div>
                    <div className="flex-1 text-sm">Message @{theirName}</div>
                </div>
             ) : (
                <>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-gray-400 cursor-pointer ${theme === 'messenger' ? 'text-blue-500' : 'bg-gray-100 hover:bg-gray-200'}`}>
                        <div className="text-xl pb-1">+</div>
                    </div>
                    
                    {/* Input Field Mock */}
                    <div className={`flex-1 h-9 rounded-full border-none flex items-center justify-between px-3 text-sm text-gray-400 ${theme === 'tiktok' ? 'bg-[#2f2f2f]' : 'bg-black/5'}`}>
                        <span>Type a message...</span>
                        <Smile size={16} className="opacity-50" />
                    </div>

                    {/* Icons */}
                    {theme !== 'imessage' && (
                        <div className="flex gap-3 text-gray-400">
                            {theme === 'whatsapp' && <Camera size={20} />}
                            <Mic size={20} />
                        </div>
                    )}
                </>
             )}
          </div>
        </div>

        {/* --- DEVICE TOGGLE CONTROLS --- */}
        <div className="absolute bottom-8 bg-white/90 backdrop-blur border border-gray-200 px-4 py-2 rounded-full shadow-xl flex gap-4 transition-all hover:scale-105">
           <button 
             onClick={() => setDevice('mobile')}
             className={`p-2 rounded-lg transition-all flex items-center gap-2 ${device === 'mobile' ? 'bg-black text-white shadow-lg' : 'text-gray-500 hover:bg-gray-100'}`}
           >
             <Smartphone size={18} />
             <span className="text-xs font-bold">Mobile</span>
           </button>
           <button 
             onClick={() => setDevice('desktop')}
             className={`p-2 rounded-lg transition-all flex items-center gap-2 ${device === 'desktop' ? 'bg-black text-white shadow-lg' : 'text-gray-500 hover:bg-gray-100'}`}
           >
             <Monitor size={18} />
             <span className="text-xs font-bold">Desktop</span>
           </button>
        </div>

      </div>
    </div>
  );
}