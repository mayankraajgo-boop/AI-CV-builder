import React from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    color: '#64748B',
    features: [
      '3 Resume limit',
      '3 Basic templates',
      'PDF export',
      'Manual editing',
      'Basic formatting',
    ],
    missing: ['AI features', 'Premium templates', 'ATS optimizer', 'Priority support'],
    cta: 'Get Started Free',
    href: '/auth?mode=register',
    highlight: false,
  },
  {
    name: 'Pro',
    price: '$12',
    period: 'per month',
    color: '#4F46E5',
    features: [
      'Unlimited resumes',
      '20+ Premium templates',
      'AI resume generation',
      'ATS optimization',
      'AI section improver',
      'Action word enhancer',
      'Resume score analyzer',
      'Priority support',
      'PDF export',
    ],
    missing: [],
    cta: 'Upgrade to Pro',
    href: '/auth?mode=register',
    highlight: true,
  },
];

const faq = [
  { q: 'Can I cancel anytime?', a: 'Yes, you can cancel your Pro subscription at any time. You\'ll retain access until the end of your billing period.' },
  { q: 'Is my data secure?', a: 'Absolutely. We use industry-standard encryption and never share your data with third parties.' },
  { q: 'Do I need a credit card for the free plan?', a: 'No credit card required. Sign up with just your email and start building immediately.' },
  { q: 'How does the AI work?', a: 'We use OpenAI\'s GPT models to generate professional content, optimize for ATS systems, and suggest improvements.' },
];

export default function Pricing() {
  return (
    <MainLayout>
      <div style={{ paddingTop: 100, paddingBottom: 80, minHeight: '100vh' }}>
        <div className="container">
          {/* Header */}
          <div className="text-center mb-5">
            <span style={{ color: '#818CF8', fontWeight: 600, fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: 2 }}>Pricing</span>
            <h1 style={{ color: '#E2E8F0', fontWeight: 800, fontSize: '2.5rem', marginTop: 8 }}>Simple, Transparent Pricing</h1>
            <p style={{ color: '#64748B', maxWidth: 500, margin: '12px auto 0' }}>
              Start free, upgrade when you need AI superpowers.
            </p>
          </div>

          {/* Plans */}
          <div className="row g-4 justify-content-center mb-5">
            {plans.map((plan) => (
              <div className="col-lg-5 col-md-8" key={plan.name}>
                <div
                  className="card p-4 h-100"
                  style={{
                    border: plan.highlight ? `2px solid ${plan.color}` : '1px solid #334155',
                    boxShadow: plan.highlight ? `0 0 40px rgba(79,70,229,0.2)` : '',
                    position: 'relative',
                  }}
                >
                  {plan.highlight && (
                    <div style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(135deg,#4F46E5,#7C3AED)', color: 'white', padding: '4px 20px', borderRadius: 20, fontSize: '0.8rem', fontWeight: 700, whiteSpace: 'nowrap' }}>
                      Most Popular
                    </div>
                  )}

                  <div className="mb-4">
                    <h3 style={{ color: '#E2E8F0', fontWeight: 700, marginBottom: 4 }}>{plan.name}</h3>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                      <span style={{ fontSize: '3rem', fontWeight: 800, color: plan.highlight ? plan.color : '#E2E8F0' }}>{plan.price}</span>
                      <span style={{ color: '#64748B', fontSize: '0.9rem' }}>/{plan.period}</span>
                    </div>
                  </div>

                  <ul style={{ listStyle: 'none', padding: 0, marginBottom: 24, flex: 1 }}>
                    {plan.features.map((f) => (
                      <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, color: '#E2E8F0', fontSize: '0.9rem' }}>
                        <i className="fas fa-check-circle" style={{ color: '#10B981', flexShrink: 0 }}></i>{f}
                      </li>
                    ))}
                    {plan.missing.map((f) => (
                      <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, color: '#475569', fontSize: '0.9rem' }}>
                        <i className="fas fa-times-circle" style={{ color: '#334155', flexShrink: 0 }}></i>{f}
                      </li>
                    ))}
                  </ul>

                  <Link
                    to={plan.href}
                    className={plan.highlight ? 'btn btn-primary w-100' : 'btn btn-outline-primary w-100'}
                    style={{ padding: '12px' }}
                  >
                    {plan.cta}
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* FAQ */}
          <div style={{ maxWidth: 700, margin: '0 auto' }}>
            <h2 style={{ color: '#E2E8F0', fontWeight: 700, textAlign: 'center', marginBottom: 32 }}>Frequently Asked Questions</h2>
            {faq.map((item, i) => (
              <div key={i} style={{ background: '#1E293B', border: '1px solid #334155', borderRadius: 12, padding: '20px 24px', marginBottom: 12 }}>
                <h6 style={{ color: '#E2E8F0', fontWeight: 700, marginBottom: 8 }}>{item.q}</h6>
                <p style={{ color: '#64748B', marginBottom: 0, fontSize: '0.9rem', lineHeight: 1.7 }}>{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
