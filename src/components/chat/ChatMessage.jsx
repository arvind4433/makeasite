import { Link } from 'react-router-dom';
import { safeChatLink } from './chatUtils';

function LinkedText({ text }) {
  const pattern = /\[([^\]\n]+)\]\(([^\s)]+)\)|(https?:\/\/[^\s<>]+|mailto:[^\s<>]+|tel:\+?[\d]+)/g;
  const parts = [];
  let start = 0;
  for (const match of text.matchAll(pattern)) {
    parts.push(text.slice(start, match.index));
    const raw = match[2] || match[3].replace(/[.,!?;:)]+$/, '');
    const suffix = match[3] ? match[3].slice(raw.length) : '';
    const href = safeChatLink(raw);
    const label = match[1] || raw;
    parts.push(href ? (href.startsWith('/')
      ? <Link key={match.index} to={href} className="underline underline-offset-2">{label}</Link>
      : <a key={match.index} href={href} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">{label}</a>) : label);
    parts.push(suffix);
    start = match.index + match[0].length;
  }
  parts.push(text.slice(start));
  return parts;
}

export default function ChatMessage({ message }) {
  const assistant = message.role === 'assistant';
  return <div className={`flex ${assistant ? 'justify-start' : 'justify-end'}`}>
    <div className={`max-w-[90%] min-w-0 rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap [overflow-wrap:anywhere] shadow-sm ${assistant ? 'border' : 'text-white'}`}
      style={assistant ? { background: 'var(--bg-card-inner)', borderColor: 'var(--border)' } : { background: 'linear-gradient(135deg, #dc2626, #ea580c)' }}>
      <LinkedText text={message.text} />
      {assistant && Array.isArray(message.sources) && message.sources.length > 0 && <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-red-600 dark:text-red-400">
        {message.sources.slice(0, 3).map(source => {
          const href = typeof source.path === 'string' ? safeChatLink(source.path) : null;
          return href?.startsWith('/') ? <Link key={href} to={href} className="underline">{source.label}</Link> : null;
        })}
      </div>}
    </div>
  </div>;
}
