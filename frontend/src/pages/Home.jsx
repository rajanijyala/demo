import { motion } from 'framer-motion';
import { ArrowRight, BarChart3, Brain, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { FEATURE_CARDS } from '../constants/app';
import Button from '../components/ui/Button';
import { useAuth } from '../hooks/useAuth';

const Home = () => {
  const { isAuthenticated } = useAuth();
  const primaryTarget = isAuthenticated ? '/interview/configure' : '/login';
  const secondaryTarget = isAuthenticated ? '/dashboard' : '/register';

  return (
  <main className="mx-auto flex min-h-[70vh] max-w-7xl flex-col gap-10 px-6 py-12 lg:px-8">
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="grid items-center gap-10 rounded-3xl border border-slate-800 bg-slate-900/70 p-8 shadow-2xl shadow-slate-950/30 lg:grid-cols-[1.1fr_0.9fr] lg:p-12"
    >
      <div className="space-y-6 text-left">
        <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-400/10 px-3 py-1 text-sm text-sky-100">
          <Sparkles className="h-4 w-4" />
          AI Mock Interview Ecosystem
        </div>
        <h1 className="max-w-xl text-4xl font-semibold tracking-tight text-white md:text-5xl">AMIE</h1>
        <p className="max-w-2xl text-lg text-slate-300">A complete mock interview workflow with real sessions, saved responses, deterministic feedback, practice planning, and analytics.</p>
        <div className="flex flex-wrap gap-3">
          <Link to={primaryTarget}><Button>Start Interview</Button></Link>
          <Link to={secondaryTarget}><Button variant="secondary">{isAuthenticated ? 'View dashboard' : 'Create account'}</Button></Link>
        </div>
      </div>

      <div className="grid gap-4 rounded-3xl border border-slate-800 bg-slate-950/80 p-6 text-left">
        {[
          { icon: Brain, title: 'Question generation', text: 'OpenAI when configured, intelligent fallback when it is not.' },
          { icon: BarChart3, title: 'Analytics', text: 'Scores, trends, completion rate, and practice consistency.' },
        ].map((item) => (
          <article key={item.title} className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
            <item.icon className="mb-2 h-5 w-5 text-sky-300" />
            <h2 className="text-lg font-semibold text-white">{item.title}</h2>
            <p className="text-sm text-slate-300">{item.text}</p>
          </article>
        ))}
      </div>
    </motion.section>

    <section className="grid gap-6 md:grid-cols-3">
      {FEATURE_CARDS.map((card, index) => (
        <motion.article
          key={card.title}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.08 }}
          className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 text-left shadow-lg shadow-slate-950/30"
        >
          <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-400/10 text-sky-200"><ArrowRight className="h-4 w-4" /></div>
          <h3 className="text-xl font-semibold text-white">{card.title}</h3>
          <p className="mt-2 text-slate-300">{card.description}</p>
        </motion.article>
      ))}
    </section>
  </main>
  );
};

export default Home;
