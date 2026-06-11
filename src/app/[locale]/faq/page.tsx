'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import { ChevronDown, ChevronUp } from 'lucide-react';
import styles from './Faq.module.css';

const FAQS = [
  {
    category: "Orders & Shipping",
    items: [
      { q: "How long does a bespoke order take?", a: "Handcrafted bespoke items typically take 2-4 weeks to complete, depending on the complexity of the design and the availability of exotic materials. We will provide a precise timeline during your consultation." },
      { q: "Do you ship internationally?", a: "Yes, we ship our leather goods and fragrances worldwide. International shipping usually takes 5-10 business days via premium couriers." },
      { q: "Can I track my order?", a: "Absolutely. Once your item is dispatched, you will receive a tracking number to monitor your package's journey." }
    ]
  },
  {
    category: "Materials & Care",
    items: [
      { q: "How do I care for my NOUR ALFY leather bag?", a: "Keep your leather goods away from direct sunlight and extreme moisture. Use a premium leather conditioner every 3-6 months to keep the grain supple. Always store it in its original dust bag when not in use." },
      { q: "Are your perfumes long-lasting?", a: "Our fragrances are formulated as Eau de Parfum (EDP) or Extrait de Parfum, using high concentrations of pure oils. You can expect them to last 8-12 hours on skin and days on fabric." }
    ]
  },
  {
    category: "Returns & Exchanges",
    items: [
      { q: "What is your return policy?", a: "We accept returns on unused, standard collection items within 14 days of delivery. The item must be in its original packaging with all tags attached." },
      { q: "Can I return a bespoke or customized item?", a: "Due to the highly personalized nature of bespoke orders, they are non-refundable and cannot be exchanged. However, we guarantee our craftsmanship and will address any manufacturing defects immediately." }
    ]
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<string | null>(null);

  const toggleFaq = (idx: string) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <main className={styles.main}>
      <Navbar />
      
      <div className={styles.header}>
        <h1 className="text-accent animate-fade-in">Client Services</h1>
        <p className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
          Frequently Asked Questions & Policies
        </p>
      </div>

      <div className={styles.container}>
        {FAQS.map((section, sIdx) => (
          <div key={section.category} className={styles.section}>
            <h2 className="text-accent">{section.category}</h2>
            <div className={styles.faqList}>
              {section.items.map((item, iIdx) => {
                const idx = `${sIdx}-${iIdx}`;
                const isOpen = openIndex === idx;
                return (
                  <div key={idx} className={`${styles.faqItem} glass-panel`} onClick={() => toggleFaq(idx)}>
                    <div className={styles.faqQuestion}>
                      <h3>{item.q}</h3>
                      {isOpen ? <ChevronUp className="text-accent" /> : <ChevronDown className="text-accent" />}
                    </div>
                    {isOpen && (
                      <div className={styles.faqAnswer}>
                        <p>{item.a}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
