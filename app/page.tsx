'use client';

import { useEffect, useRef, useState } from 'react';

type ChatTurn = {
  role: 'assistant' | 'user';
  content: string;
};

const suggestions = [
  "What are Abdulaziz's strongest projects?",
  'Summarize his experience with backend systems.',
  'How has he applied research in production?',
];

export default function Home() {
  const [message, setMessage] = useState('');
  const [history, setHistory] = useState<ChatTurn[]>([]);
  const [loading, setLoading] = useState(false);
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
  const chatBodyRef = useRef<HTMLDivElement | null>(null);
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const pillRowRef = useRef<HTMLDivElement | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(true);

  const autoResize = () => {
    const el = textAreaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 220)}px`;
  };

  const scrollToBottom = () => {
    requestAnimationFrame(() => {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setLoading(true);

    const userText = message.trim();
    setHistory((prev) => [...prev, { role: 'user', content: userText }]);
    setMessage('');
    setTimeout(autoResize, 0);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userText }),
      });

      if (!res.ok) {
        let serverMessage = 'Sorry, something went wrong. Please try again.';
        try {
          const errJson = await res.json();
          serverMessage = errJson?.response || serverMessage;
        } catch {
          const text = await res.text();
          if (text) serverMessage = text;
        }
        throw new Error(serverMessage);
      }

      const data = await res.json();
      setHistory((prev) => [...prev, { role: 'assistant', content: data.response }]);
      scrollToBottom();
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Sorry, something went wrong. Please try again.';
      setHistory((prev) => [...prev, { role: 'assistant', content: errorMsg }]);
      scrollToBottom();
    }

    setLoading(false);
  };

  useEffect(() => {
    autoResize();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [history]);

  const renderMessage = (text: string) => {
    const escapeHtml = (str: string) =>
      str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');

    const escaped = escapeHtml(text);
    const linked = escaped.replace(
      /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
    );
    const withBreaks = linked.replace(/\n/g, '<br />');
    return { __html: withBreaks };
  };

  useEffect(() => {
    const checkSuggestionsFit = () => {
      const row = pillRowRef.current;
      if (!row) return;
      const isMobile = window.innerWidth <= 720;
      if (isMobile) {
        setShowSuggestions(true);
        return;
      }
      const fits = row.scrollWidth <= row.clientWidth + 1;
      setShowSuggestions(fits);
    };

    checkSuggestionsFit();
    window.addEventListener('resize', checkSuggestionsFit);
    return () => window.removeEventListener('resize', checkSuggestionsFit);
  }, []);

  return (
    <main className="chat-shell">
      <header className="chat-header">
        <div className="chat-brand">
          <div className="chat-logo">
            <img src="/aztech-logo.svg" alt="AztechAI logo" />
          </div>
          <span className="chat-title">AZTech AI</span>
        </div>
        <div className="chat-powered-chip">Powered by Gemini</div>
        <a
          className="chat-portfolio-link"
          href="https://abdulaziz-04.github.io"
          target="_blank"
          rel="noopener noreferrer"
        >
          View My Portfolio
        </a>
      </header>

      <div className="hero-wrap">
        <div className="hero-card">
          <div className="hero-brand">
            <div className="hero-logo">
              <img src="/aztech-logo.svg" alt="AztechAI logo" />
            </div>
            <div className="brand-title">AZTech AI</div>
          </div>
          <div className="brand-subtitle">Aziz + Tech - AI assistant for Abdulaziz Suria</div>
          <h1 className="hero-title">Ask anything about Abdulaziz.</h1>
          <p className="hero-copy">
            Get concise answers about his background, projects, certifications, and how he builds
            production-ready systems.
          </p>
        </div>
      </div>

      <div className="chat-body" ref={chatBodyRef}>
        {history.map((turn, idx) => (
          <div
            key={idx}
            className={`message-row ${turn.role === 'user' ? 'user' : 'assistant'}`}
          >
            <div
              className="message-bubble"
              dangerouslySetInnerHTML={renderMessage(turn.content)}
            />
          </div>
        ))}
        {loading && (
          <div className="message-row assistant">
            <div className="message-bubble typing">Thinking...</div>
          </div>
        )}
        <div className="chat-spacer" aria-hidden />
        <div ref={chatEndRef} />
      </div>

      {showSuggestions && (
        <div className="chat-suggestions">
          <div className="pill-row" ref={pillRowRef}>
            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                className="pill"
                onClick={() => {
                  setMessage(suggestion);
                  setTimeout(autoResize, 0);
                }}
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      <form className="chat-input-bar" onSubmit={handleSubmit}>
        <textarea
          ref={textAreaRef}
          className="chat-input"
          placeholder="Ask me anything about Abdulaziz"
          value={message}
          rows={1}
          onChange={(e) => {
            setMessage(e.target.value);
            autoResize();
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
        />
        <button className="send-btn" type="submit" disabled={loading} aria-label="Send">
          Send
        </button>
      </form>
    </main>
  );
}
