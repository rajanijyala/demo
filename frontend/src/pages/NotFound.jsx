import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

const NotFound = () => (
  <main className="mx-auto flex min-h-[75vh] max-w-3xl flex-col items-center justify-center px-6 py-12 text-center lg:px-8">
    <p className="text-sm uppercase tracking-[0.35em] text-sky-200">404</p>
    <h1 className="mt-3 text-4xl font-semibold text-white">Page not found</h1>
    <p className="mt-3 max-w-xl text-slate-300">The route you requested does not exist. Return to the home page to continue.</p>
    <Link to="/" className="mt-6"><Button>Go home</Button></Link>
  </main>
);

export default NotFound;
