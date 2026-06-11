const Footer = () => (
  <footer className="border-t border-slate-800/80 bg-slate-950/95">
    <div className="mx-auto flex max-w-7xl flex-col gap-2 px-6 py-6 text-sm text-slate-400 md:flex-row md:items-center md:justify-between lg:px-8">
      <p>&copy; {new Date().getFullYear()} AI Interview Mocker. Practice smarter, interview better.</p>
      <p>React &bull; Node.js &bull; OpenAI &bull; MongoDB</p>
    </div>
  </footer>
);

export default Footer;
