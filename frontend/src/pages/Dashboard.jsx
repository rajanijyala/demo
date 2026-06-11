import { motion } from 'framer-motion';
import { CalendarDays, ShieldCheck, Sparkles } from 'lucide-react';
import { formatDate } from '../utils/helpers';
import { useAuth } from '../hooks/useAuth';
import { fadeInUp } from '../utils/animations';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <main className="mx-auto flex min-h-[75vh] max-w-7xl flex-col gap-8 px-6 py-12 lg:px-8">
      <motion.section {...fadeInUp(16)} className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-2xl shadow-slate-950/30">
        <p className="text-sm uppercase tracking-[0.35em] text-sky-200">Protected area</p>
        <h1 className="mt-3 text-3xl font-semibold text-white">Welcome, {user?.name || 'there'}.</h1>
        <p className="mt-2 max-w-2xl text-slate-300">This page is only visible after authentication. It is a good space for dashboards, reports, and account insights.</p>
      </motion.section>

      <section className="grid gap-6 md:grid-cols-3">
        {[
          { label: 'Status', value: 'Active', icon: ShieldCheck },
          { label: 'Last login', value: formatDate(new Date()), icon: CalendarDays },
          { label: 'Experience', value: 'Production-ready', icon: Sparkles },
        ].map((item) => (
          <article key={item.label} className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 text-left shadow-lg shadow-slate-950/30">
            <item.icon className="h-5 w-5 text-sky-300" />
            <p className="mt-3 text-sm text-slate-400">{item.label}</p>
            <p className="text-xl font-semibold text-white">{item.value}</p>
          </article>
        ))}
      </section>
    </main>
  );
};

export default Dashboard;
