import { motion } from 'framer-motion';
import { ArrowRight, BrainCircuit, FileText, Mic, BarChart3, Shield, Sparkles, Star, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const features = [
  { icon: BrainCircuit, title: 'AI-Powered Questions', desc: 'Generate tailored interview questions using OpenAI based on your role and tech stack.' },
  { icon: FileText, title: 'Resume Analysis', desc: 'Upload your resume and get an AI-powered score with skill gap analysis.' },
  { icon: Mic, title: 'Voice Interviews', desc: 'Practice speaking your answers with real-time speech recognition.' },
  { icon: BarChart3, title: 'Analytics Dashboard', desc: 'Track your progress, identify weak areas, and measure improvement over time.' },
  { icon: Shield, title: 'Detailed Feedback', desc: 'Receive per-answer feedback on technical accuracy, communication, and confidence.' },
  { icon: Sparkles, title: 'Multiple Formats', desc: 'Practice technical, behavioral, and HR interviews all in one platform.' },
];

const steps = [
  { step: '01', title: 'Create Account', desc: 'Sign up in seconds and set up your profile.' },
  { step: '02', title: 'Choose Interview', desc: 'Select your role, experience level, and tech stack.' },
  { step: '03', title: 'Practice & Learn', desc: 'Answer AI-generated questions and get instant feedback.' },
  { step: '04', title: 'Track Progress', desc: 'View analytics and improve your weak areas.' },
];

const testimonials = [
  { name: 'Sarah Chen', role: 'Frontend Developer', text: 'This platform helped me land my dream job at a FAANG company. The AI feedback was incredibly insightful.', rating: 5 },
  { name: 'Marcus Johnson', role: 'Full Stack Engineer', text: 'The behavioral question practice was a game-changer. I felt so much more confident in my interviews.', rating: 5 },
  { name: 'Priya Sharma', role: 'Backend Developer', text: 'Resume analysis feature pointed out skills I was missing. Updated my resume and got 3x more callbacks.', rating: 5 },
];

const pricing = [
  { name: 'Free', price: '$0', period: '/month', features: ['5 interviews/month', 'Basic AI feedback', 'Score tracking', 'Community support'], cta: 'Get Started' },
  { name: 'Pro', price: '$19', period: '/month', features: ['Unlimited interviews', 'Advanced AI feedback', 'Resume analysis', 'Voice interviews', 'Priority support'], cta: 'Start Pro', popular: true },
  { name: 'Team', price: '$49', period: '/month', features: ['Everything in Pro', 'Team analytics', 'Custom questions', 'API access', 'Dedicated support'], cta: 'Contact Sales' },
];

const Home = () => (
  <main className="mx-auto max-w-7xl px-6 lg:px-8">
    {/* Hero */}
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="flex min-h-[70vh] flex-col items-center justify-center gap-6 py-20 text-center"
    >
      <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-400/10 px-4 py-1.5 text-sm text-sky-100">
        <Sparkles className="h-4 w-4" />
        AI-Powered Interview Preparation
      </div>
      <h1 className="max-w-4xl text-5xl font-bold tracking-tight text-white md:text-6xl lg:text-7xl">
        Ace Your Next Interview with{' '}
        <span className="bg-gradient-to-r from-sky-400 to-cyan-300 bg-clip-text text-transparent">AI Coaching</span>
      </h1>
      <p className="max-w-2xl text-lg text-slate-300">
        Practice technical, behavioral, and HR interviews with AI-generated questions. Get real-time feedback, track your progress, and land your dream job.
      </p>
      <div className="flex flex-wrap gap-4">
        <Link to="/register"><Button className="px-8 py-3 text-base">Get Started Free <ArrowRight className="ml-2 h-4 w-4" /></Button></Link>
        <Link to="/login"><Button variant="secondary" className="px-8 py-3 text-base">Log in</Button></Link>
      </div>
    </motion.section>

    {/* Features */}
    <section className="py-20">
      <div className="mb-12 text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-sky-200">Features</p>
        <h2 className="mt-3 text-3xl font-bold text-white md:text-4xl">Everything you need to prepare</h2>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {features.map((f, i) => (
          <motion.div key={f.title} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
            <Card className="h-full text-left">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-400/10 text-sky-300">
                <f.icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-white">{f.title}</h3>
              <p className="mt-2 text-sm text-slate-300">{f.desc}</p>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>

    {/* How It Works */}
    <section className="py-20">
      <div className="mb-12 text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-sky-200">How It Works</p>
        <h2 className="mt-3 text-3xl font-bold text-white md:text-4xl">Simple 4-step process</h2>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {steps.map((s, i) => (
          <motion.div key={s.step} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <Card className="text-left">
              <span className="text-4xl font-bold text-sky-400/30">{s.step}</span>
              <h3 className="mt-2 text-lg font-semibold text-white">{s.title}</h3>
              <p className="mt-1 text-sm text-slate-300">{s.desc}</p>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>

    {/* Testimonials */}
    <section className="py-20">
      <div className="mb-12 text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-sky-200">Testimonials</p>
        <h2 className="mt-3 text-3xl font-bold text-white md:text-4xl">Loved by developers</h2>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {testimonials.map((t, i) => (
          <motion.div key={t.name} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <Card className="text-left">
              <div className="mb-3 flex gap-1">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-sm text-slate-300">&ldquo;{t.text}&rdquo;</p>
              <div className="mt-4">
                <p className="font-semibold text-white">{t.name}</p>
                <p className="text-xs text-slate-400">{t.role}</p>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>

    {/* Pricing */}
    <section className="py-20">
      <div className="mb-12 text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-sky-200">Pricing</p>
        <h2 className="mt-3 text-3xl font-bold text-white md:text-4xl">Plans for every stage</h2>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {pricing.map((p, i) => (
          <motion.div key={p.name} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <Card className={`relative text-left ${p.popular ? 'border-sky-400/50 ring-1 ring-sky-400/20' : ''}`}>
              {p.popular && (
                <span className="absolute -top-3 left-6 rounded-full bg-sky-500 px-3 py-0.5 text-xs font-semibold text-slate-950">
                  Most Popular
                </span>
              )}
              <h3 className="text-lg font-semibold text-white">{p.name}</h3>
              <div className="mt-3">
                <span className="text-4xl font-bold text-white">{p.price}</span>
                <span className="text-slate-400">{p.period}</span>
              </div>
              <ul className="mt-6 space-y-3">
                {p.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-slate-300">
                    <Check className="h-4 w-4 text-sky-400" /> {f}
                  </li>
                ))}
              </ul>
              <Link to="/register" className="mt-6 block">
                <Button className="w-full" variant={p.popular ? 'primary' : 'secondary'}>{p.cta}</Button>
              </Link>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  </main>
);

export default Home;
