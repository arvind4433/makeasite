import { describe, expect, it } from 'vitest';
import { conversationHistory, safeChatLink } from './chatUtils';

describe('chat utilities', () => {
  it('keeps only completed conversation pairs within the request limit', () => {
    const messages = [
      { role: 'assistant', text: 'Greeting', greeting: true },
      { role: 'user', text: 'I need an ecommerce website' },
      { role: 'assistant', text: 'How many products do you expect?' },
      { role: 'user', text: 'Around 100 products' }
    ];
    expect(conversationHistory(messages)).toEqual([
      { role: 'user', text: 'I need an ecommerce website' },
      { role: 'assistant', text: 'How many products do you expect?' }
    ]);
  });

  it('allows only official site, contact and WhatsApp links', () => {
    expect(safeChatLink('/pricing')).toBe('/pricing');
    expect(safeChatLink('https://www.makeasite.online/contact')).toBe('/contact');
    expect(safeChatLink('https://wa.me/918894810531?text=Hello')).toContain('wa.me/918894810531');
    expect(safeChatLink('https://attacker.example/collect')).toBeNull();
    expect(safeChatLink('javascript:alert(1)')).toBeNull();
  });
});
