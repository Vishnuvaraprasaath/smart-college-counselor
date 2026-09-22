import React, { useState, useRef, useEffect } from 'react';
import { sendAIChatMessage } from '../services/api';
import { Bot, Send, Sparkles, User, RefreshCw, ShieldCheck, ChevronRight, MessageSquare } from 'lucide-react';

export default function AICounselorChat({ activeProfile }) {
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: `Hello! I am CounselAI, your institutional admissions intelligence advisor. ${
        activeProfile
          ? `I have calibrated your profile (Cutoff: ${activeProfile.cutoff}, Category: ${activeProfile.category}, Location: ${activeProfile.location}).`
          : 'Please complete your assessment dossier for personalized cutoff matching.'
      } How can I assist you with your college selections, branch strategies, or cutoff viability today?`,
      source: 'SmartCounsel Grounded Intelligence'
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Executive Header Card */}
      <div className="bg-white p-6 rounded-2xl border border-[#E5E3DD] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-[#0A0B0E] text-[#C5A25D] flex items-center justify-center border border-[#1C202C] shadow-sm shrink-0">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-serif font-bold text-[#0A0B0E] tracking-tight">CounselAI Advisory</h1>
              <span className="px-2 py-0.5 rounded-full bg-[#FAF3DE] text-[#996D19] border border-[#EADBAC] text-[10px] font-mono font-bold tracking-wider uppercase">
                Grounded Model
              </span>
            </div>
            <p className="text-xs text-[#6B7280] mt-0.5">
              Precision admission intelligence & historical TNEA cutoff guidance
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 self-start sm:self-center">
          <div className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#EDF7ED] text-[#1E7245] border border-[#C6E7C6] rounded-full text-[11px] font-mono font-semibold">
            <span className="w-2 h-2 rounded-full bg-[#1E7245] animate-pulse"></span>
            <span>MySQL Grounding Active</span>
          </div>
        </div>
      </div>

      {/* Active Dossier Context Bar (if activeProfile) */}
      {activeProfile && (
        <div className="bg-[#FAF9F5] border border-[#EADBAC] px-4 py-3 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2 text-[#6B7280]">
            <span className="font-serif font-bold text-[#0A0B0E]">Active Candidate Dossier:</span>
            <span className="font-mono font-bold text-[#0A0B0E]">{activeProfile.name || 'Candidate'}</span>
            <span>•</span>
            <span className="font-mono text-[#0A0B0E]">Cutoff: {activeProfile.cutoff}</span>
            <span>•</span>
            <span className="font-mono text-[#0A0B0E]">Quota: {activeProfile.category}</span>
            <span>•</span>
            <span className="text-[#0A0B0E]">{activeProfile.location || 'Coimbatore'}</span>
          </div>
          <span className="text-[10px] font-mono text-[#996D19] font-semibold uppercase tracking-wider">
            Context Synced to Chat
          </span>
        </div>
      )}

      {/* Quick Questions Strip */}
      <div className="space-y-2">
        <div className="flex items-center space-x-2 text-xs text-[#6B7280]">
          <MessageSquare className="w-3.5 h-3.5 text-[#C5A25D]" />
          <span className="font-mono text-[11px] uppercase tracking-wider font-semibold">Suggested Advisory Inquiries:</span>
        </div>
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 no-scrollbar">
          {sampleQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              className="px-3.5 py-1.5 bg-white border border-[#E5E3DD] hover:border-[#C5A25D] hover:bg-[#FAF9F5] text-[#3A3F50] hover:text-[#0A0B0E] rounded-full whitespace-nowrap text-xs transition duration-150 shadow-xs shrink-0"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Feed Container */}
      <div className="bg-white rounded-2xl border border-[#E5E3DD] shadow-sm min-h-[460px] max-h-[560px] flex flex-col justify-between overflow-hidden">
        
        {/* Messages Scroll Area */}
        <div className="overflow-y-auto p-6 space-y-5">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex items-start space-x-3.5 ${msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}
            >
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 shadow-xs ${
                msg.sender === 'user' 
                  ? 'bg-[#0A0B0E] text-[#C5A25D] border border-[#1C202C]' 
                  : 'bg-[#FAF3DE] text-[#996D19] border border-[#EADBAC]'
              }`}>
                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Speech Bubble */}
              <div className={`max-w-2xl p-4 text-xs leading-relaxed space-y-2 ${
                msg.sender === 'user' 
                  ? 'bg-[#0A0B0E] text-white rounded-2xl rounded-tr-xs border border-[#1C202C]' 
                  : 'bg-[#FAF9F5] border border-[#E5E3DD] text-[#222630] rounded-2xl rounded-tl-xs'
              }`}>
                <p className="whitespace-pre-line text-[13px] leading-relaxed font-normal">{msg.text}</p>
                {msg.source && (
                  <div className="pt-2 border-t border-[#E5E3DD]/60 flex items-center justify-between text-[10px] text-[#6B7280]">
                    <span className="font-mono flex items-center space-x-1">
                      <ShieldCheck className="w-3 h-3 text-[#C5A25D]" />
                      <span>{msg.source}</span>
                    </span>
                    <span className="font-mono text-[#9CA3AF]">Verified</span>
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-start space-x-3.5">
              <div className="w-8 h-8 rounded-lg bg-[#FAF3DE] text-[#996D19] border border-[#EADBAC] flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-[#FAF9F5] border border-[#E5E3DD] px-4 py-3 rounded-2xl rounded-tl-xs text-xs text-[#6B7280] flex items-center space-x-2.5 shadow-xs">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#C5A25D]" />
                <span className="font-mono">CounselAI is evaluating cutoff matrices and database records...</span>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-[#FAF9F5] border-t border-[#E5E3DD]">
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
              placeholder="Inquire regarding college cutoffs, department options, or strategy..."
              className="flex-1 px-4 py-3 rounded-xl bg-white border border-[#E5E3DD] text-sm text-[#0A0B0E] placeholder-[#9CA3AF] focus:ring-2 focus:ring-[#C5A25D] focus:border-[#C5A25D] focus:outline-none transition shadow-inner"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="px-5 py-3 rounded-xl bg-[#0A0B0E] hover:bg-[#1C202C] disabled:opacity-40 text-white font-medium text-xs flex items-center space-x-2 transition shadow-sm shrink-0 border border-[#1C202C]"
            >
              <span>Inquire</span>
              <Send className="w-3.5 h-3.5 text-[#C5A25D]" />
            </button>
          </form>
          <div className="mt-2 text-center">
            <span className="text-[10px] text-[#9CA3AF]">
              Recommendations are mathematically synthesized from official historical cutoff records and quota metrics.
            </span>
          </div>
        </div>

      </div>

    </div>
  );
}

