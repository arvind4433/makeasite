import { useEffect, useRef, useState } from 'react';
import { sendChatMessage } from '../../services/chatApi';
import { conversationHistory, MAX_MESSAGE } from './chatUtils';

const greeting = () => ({ role: 'assistant', text: 'Hey! How can I help you with your website?', greeting: true });

export default function useChat() {
  const [messages, setMessages] = useState([greeting()]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [summary, setSummary] = useState('');
  const [handoff, setHandoff] = useState(false);
  const request = useRef(null);
  const retryRequest = useRef(null);
  useEffect(() => () => request.current?.abort(), []);

  const send = async (value, retry = false) => {
    const text = value.trim();
    if (!text || text.length > MAX_MESSAGE || request.current) return false;
    const snapshot = retry ? retryRequest.current : { text, history: conversationHistory(messages) };
    if (!snapshot) return false;
    const controller = new AbortController();
    request.current = controller;
    retryRequest.current = snapshot;
    setLoading(true); setError('');
    if (!retry) setMessages(previous => [...previous, { role: 'user', text }].slice(-33));
    const timer = setTimeout(() => controller.abort('timeout'), 25000);
    try {
      const data = await sendChatMessage(snapshot.text, snapshot.history, controller.signal);
      if (request.current !== controller) return false;
      setMessages(previous => [...previous, { role: 'assistant', text: data.reply, sources: data.sources }].slice(-32));
      setSummary(typeof data.projectSummary === 'string' ? data.projectSummary.slice(0, 1000) : '');
      setHandoff(data.handoff === true);
      retryRequest.current = null;
      return true;
    } catch (err) {
      if (request.current !== controller) return false;
      setError(controller.signal.aborted ? 'The reply took too long. Please retry or contact the team.' : err.message);
      return false;
    } finally {
      clearTimeout(timer);
      if (request.current === controller) { request.current = null; setLoading(false); }
    }
  };
  const reset = () => {
    request.current?.abort(); request.current = null; retryRequest.current = null;
    setMessages([greeting()]); setLoading(false); setError(''); setSummary(''); setHandoff(false);
  };
  return { messages, loading, error, summary, setSummary, handoff, send, reset,
    retry: () => send(retryRequest.current?.text || '', true) };
}
