import React, { useState } from 'react';
import {
  HelpCircle,
  Phone,
  Mail,
  Clock,
  Send,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
} from 'lucide-react';
import { useToast } from '@hooks/useToast';

export const CustomerSupportPage: React.FC = () => {
  const { success } = useToast();
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How fast is fresh grocery delivery in Kisii & Nyamira?',
      a: 'We offer guaranteed same-day delivery within 45 to 60 minutes for all orders placed before 8:00 PM. Our dispatch riders prioritize fresh bakery and dairy items in temperature-controlled bags.',
    },
    {
      q: 'How do M-Pesa STK Push payments work?',
      a: 'When you choose M-Pesa at checkout and input your Safaricom number, our Daraja API sends an automatic PIN prompt directly to your phone. Once you enter your PIN, payment is reconciled in real-time and your order receipt is generated instantly.',
    },
    {
      q: 'How do I redeem my loyalty points for discounts?',
      a: 'In your Shopping Basket or Loyalty Dashboard, select any reward tier (500 pts for KSh 50, 1000 pts for KSh 120, or 2000 pts for KSh 250). The discount is deducted immediately from your total payable amount.',
    },
    {
      q: 'What is your freshness & return policy?',
      a: 'We offer a 100% Freshness Guarantee. If any produce or packaged item arrives damaged or past its peak freshness, you can submit a return request directly on the My Orders page for instant replacement or store credit.',
    },
  ];

  const handleSupportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    success('Support ticket submitted! A customer service agent will contact you within 15 minutes.');
    setSubject('');
    setMessage('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Help Center &amp; Customer Support</h1>
        <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
          Have questions about your order, M-Pesa payments, or store pickups? We are here to help.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* FAQs Accordion */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-emerald-600" /> Frequently Asked Questions
          </h2>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs transition"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-4 text-left flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-slate-900 hover:bg-slate-50"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
                  </button>
                  {isOpen && (
                    <div className="p-4 pt-0 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Contact Form & Direct Helpline */}
        <div className="space-y-6">
          <div className="bg-emerald-900 text-white rounded-3xl p-6 shadow-lg space-y-4">
            <h3 className="font-bold text-base">Direct Customer Helpline</h3>
            <p className="text-xs text-emerald-200">Our customer desk operates 7 days a week.</p>

            <div className="space-y-2.5 text-xs text-emerald-100">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-emerald-300" />
                <span className="font-bold text-white">+254 700 000 000</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-emerald-300" />
                <span>support@groceryos.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-emerald-300" />
                <span>7:00 AM – 9:30 PM Everyday</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSupportSubmit} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-emerald-600" /> Send Inquiry / Issue Ticket
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Issue Subject</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Order #ORD-10482 inquiry"
                  required
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Message Description</label>
                <textarea
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Please describe how we can assist you..."
                  required
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 rounded-xl shadow-xs transition flex items-center justify-center gap-1.5"
              >
                <Send className="h-3.5 w-3.5" /> Submit Support Ticket
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
