import { Component } from 'react';
import Button from './Button';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <main className="mx-auto flex min-h-[75vh] max-w-3xl flex-col items-center justify-center px-6 py-12 text-center lg:px-8">
          <p className="text-sm uppercase tracking-[0.35em] text-rose-300">Something went wrong</p>
          <h1 className="mt-3 text-4xl font-semibold text-white">Unexpected error</h1>
          <p className="mt-3 max-w-xl text-slate-300">
            {this.state.error?.message || 'An unexpected error occurred. Please try again.'}
          </p>
          <Button className="mt-6" onClick={this.handleReset}>Try again</Button>
        </main>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
