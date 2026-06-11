import { motion } from 'framer-motion';
import { fadeInUp } from '../../utils/animations';

const AuthFormLayout = ({ heading, subtitle, description, children }) => (
  <main className="mx-auto flex min-h-[75vh] max-w-5xl items-center justify-center px-6 py-12 lg:px-8">
    <motion.section
      {...fadeInUp()}
      className="grid w-full gap-8 rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-2xl shadow-slate-950/30 lg:grid-cols-[0.9fr_1.1fr] lg:p-10"
    >
      <div className="space-y-4 text-left">
        <p className="text-sm uppercase tracking-[0.3em] text-sky-200">{subtitle}</p>
        <h1 className="text-3xl font-semibold text-white">{heading}</h1>
        <p className="text-slate-300">{description}</p>
      </div>
      {children}
    </motion.section>
  </main>
);

export default AuthFormLayout;
