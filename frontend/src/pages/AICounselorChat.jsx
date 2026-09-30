import React, { useState, useRef, useEffect } from 'react';
import { sendAIChatMessage } from '../services/api';
import { 
  Bot, 
  Send, 
  Sparkles, 
  User, 
  RefreshCw, 
  ShieldCheck, 
  ChevronRight, 
  MessageSquare,
  Database
} from 'lucide-react';

export default function AICounselorChat({ activeProfile }) {
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: `Hello! I am CounselAI, your institutional admissions advisory agent. ${
        activeProfile
          ? `I have synced your profile context (Cutoff: ${activeProfile.cutoff}, Quota: ${activeProfile.category}, Location: ${activeProfile.location}).`
          : 'Please complete your assessment dossier for personalized cutoff matching.'
      } How can I assist you with your college selections, branch strategies, or cutoff viability today?`,
      source: 'SmartCounsel Verified Intelligence'
    }
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (textToSend) => {
    const query = textToSend || input;
    if (!query || !query.trim()) return;

    const userMsg = { sender: 'user', text: query };
    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const response = await sendAIChatMessage(query, { studentProfile: activeProfile });
      const aiMsg = {
        sender: 'ai',
        text: response.message || response.reply,
        source: response.source || 'CounselAI Intelligence'
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: "I am having trouble querying the institutional database right now. Please verify your connection or try again shortly.",
          source: 'System Diagnostic'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const sampleQuestions = [
    "Can I get ECE at Bannari Amman Institute of Technology?",
    "What is the cutoff for Kumaraguru College of Technology (KCT)?",
    "What if I choose CSE instead of ECE?",
    "How should I structure my safe, moderate, and ambitious choices?"
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      
      {/* Executive Header Card */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/90 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-200/80 shadow-xs shrink-0">
            <Bot className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">CounselAI Advisory</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/60 text-[10px] font-mono font-bold tracking-wider uppercase">
                Grounded Model
              </span>
            </div>
            <p className="text-xs text-slate-500 font-normal mt-0.5">
              Precision admission intelligence & verified TNEA historical cutoff guidance
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 self-start sm:self-center">
          <div className="flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-mono font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Database Grounding Active</span>
          </div>
        </div>
      </div>

      {/* Active Profile Context Bar (if activeProfile) */}
      {activeProfile && (
        <div className="bg-slate-50 border border-slate-200/90 px-4 py-3 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2 text-slate-600 font-medium">
            <span className="font-bold text-slate-900">Active Dossier:</span>
            <span className="font-semibold text-slate-900">{activeProfile.name || 'Candidate'}</span>
            <span>•</span>
            <span className="font-mono text-slate-900 font-bold">Cutoff: {activeProfile.cutoff}</span>
            <span>•</span>
            <span className="font-mono text-slate-900">Quota: {activeProfile.category}</span>
            <span>•</span>
            <span className="text-slate-900">{activeProfile.location || 'Coimbatore'}</span>
          </div>
          <span className="text-[10px] font-mono text-indigo-600 font-bold uppercase tracking-wider">
            Context Synced
          </span>
        </div>
      )}

      {/* Suggested Questions Strip */}
      <div className="space-y-2">
        <div className="flex items-center space-x-2 text-xs text-slate-500 font-medium">
          <MessageSquare className="w-3.5 h-3.5 text-indigo-600" />
          <span className="text-[11px] uppercase tracking-wider font-bold">Suggested Advisory Inquiries:</span>
        </div>
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 no-scrollbar">
          {sampleQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              className="px-3.5 py-1.5 bg-white border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/40 text-slate-700 hover:text-indigo-700 rounded-xl whitespace-nowrap text-xs transition duration-150 shadow-xs shrink-0 font-medium"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Feed Container */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-card min-h-[460px] max-h-[580px] flex flex-col justify-between overflow-hidden">
        
        {/* Messages Scroll Area */}
        <div className="overflow-y-auto p-6 space-y-5">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex items-start space-x-3.5 ${msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}
            >
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 shadow-xs ${
                msg.sender === 'user' 
                  ? 'bg-slate-900 text-white' 
                  : 'bg-indigo-50 text-indigo-600 border border-indigo-200/80'
              }`}>
                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Message Bubble */}
              <div className={`max-w-2xl p-4 text-xs leading-relaxed space-y-2 ${
                msg.sender === 'user' 
                  ? 'bg-slate-900 text-white rounded-2xl rounded-tr-xs' 
                  : 'bg-slate-50 border border-slate-200/80 text-slate-800 rounded-2xl rounded-tl-xs'
              }`}>
                <p className="whitespace-pre-line text-[13px] leading-relaxed font-normal">{msg.text}</p>
                {msg.source && (
                  <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-slate-400">
                    <span className="font-mono flex items-center space-x-1 text-indigo-600 font-semibold">
                      <ShieldCheck className="w-3 h-3 text-indigo-600" />
                      <span>{msg.source}</span>
                    </span>
                    <span className="font-mono text-slate-400">Verified</span>
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-start space-x-3.5">
              <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-200/80 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-slate-50 border border-slate-200/80 px-4 py-3 rounded-2xl rounded-tl-xs text-xs text-slate-500 flex items-center space-x-2.5 shadow-xs">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-600" />
                <span className="font-mono">CounselAI is analyzing historical cutoff records...</span>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-slate-50/80 border-t border-slate-100">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about college cutoffs, branch options, or admission strategy..."
              className="flex-1 px-4 py-3 rounded-xl bg-white border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-indigo-600/15 focus:border-indigo-600 focus:outline-none transition shadow-inner"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-bold text-xs flex items-center space-x-2 transition shadow-xs shrink-0"
            >
              <span>Send</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
          <div className="mt-2 text-center">
            <span className="text-[10px] text-slate-400">
              Guidance is mathematically grounded in official Anna University historical cutoff data and community quotas.
            </span>
          </div>
        </div>

      </div>

    </div>
  );
}
