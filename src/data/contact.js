// Public contact information shared by the contact page and assistant.
export const CONTACT = {
  email: 'arvind889481@gmail.com',
  phone: '+91 8894810531',
  whatsapp: 'https://wa.me/918894810531',
  location: 'India — Remote Worldwide',
  path: '/contact'
};

export const whatsappLink = (summary = '') =>
  `${CONTACT.whatsapp}?text=${encodeURIComponent(summary ? `Hi MakeASite, I'd like to discuss this project:\n\n${summary.slice(0, 1200)}` : "Hi MakeASite, I'd like to discuss a website project.")}`;
