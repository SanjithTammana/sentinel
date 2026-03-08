'use client';

import { useMemo, useState } from 'react';
import { Bot, SendHorizonal } from 'lucide-react';

export default function ChatPanel({ userId, location, alerts = [] }) {
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Sentinel AI online. Ask about local hazards, preparedness steps, evacuation planning, or emergency kits.',
    },
  ]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);

  const chatContext = useMemo(
    () => ({
      location,
      alerts: alerts.slice(0, 5).map((a) => ({
        type: a.type,
        severity: a.severity,
        title: a.title,
      })),
    }),
    [alerts, location]
  );

  async function handleSend(e) {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || sending) return;

    const userMessage = { id: `u-${Date.now()}`, role: 'user', content: trimmed };
    const assistantId = `a-${Date.now()}`;

    const nextMessages = [...messages, userMessage];
    setMessages([...nextMessages, { id: assistantId, role: 'assistant', content: '' }]);
    setInput('');
    setSending(true);

    try {
      const res = await fetch('/api/chat/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          context: chatContext,
          messages: nextMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!res.ok || !res.body) {
        const payload = await res.json().catch(() => ({}));
        throw new Error(payload.error || 'Chat request failed.');
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let done = false;

      while (!done) {
        const chunk = await reader.read();
        done = chunk.done;
        if (done) break;

        const text = decoder.decode(chunk.value, { stream: true });
        setMessages((prev) => prev.map((msg) => (msg.id === assistantId ? { ...msg, content: msg.content + text } : msg)));
      }
    } catch (error) {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantId
            ? { ...msg, content: `Unable to complete request: ${error.message}` }
            : msg
        )
      );
    } finally {
      setSending(false);
    }
  }

  return (
    <section className="portal-panel chat-panel" id="chat">
      <div className="chat-header">
        <p className="portal-chip"><Bot size={14} /> Sentinel Chat</p>
        <p className="small-muted">Safety scope only</p>
      </div>

      <div className="chat-thread" role="log" aria-live="polite">
        {messages.map((message) => (
          <article key={message.id} className={`chat-bubble ${message.role === 'user' ? 'user' : 'assistant'}`}>
            <p className="chat-role">{message.role === 'user' ? 'You' : 'Sentinel AI'}</p>
            <p>{message.content || (message.role === 'assistant' ? '...' : '')}</p>
          </article>
        ))}
      </div>

      <form className="chat-form" onSubmit={handleSend}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="portal-input"
          placeholder="Ask about preparedness, evacuation, shelters, alerts..."
          disabled={sending}
        />
        <button type="submit" className="portal-btn" disabled={sending || !input.trim()}>
          {sending ? 'Streaming...' : <><SendHorizonal size={16} /> Send</>}
        </button>
      </form>
    </section>
  );
}
