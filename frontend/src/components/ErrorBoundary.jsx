import React from 'react';
import { AlertCircle, RotateCcw, Home } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Application Error caught by ErrorBoundary:', error, errorInfo);
  }

  handleReset = () => {
    try {
      localStorage.clear();
    } catch (e) {
      console.error(e);
    }
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-xl text-center space-y-5">
            <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto shadow-xs">
              <AlertCircle className="w-7 h-7" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Something went wrong</h2>
              <p className="text-xs text-slate-500 leading-relaxed">
                An unexpected UI state occurred. You can reset your session to restore the landing page.
              </p>
              {this.state.error && (
                <pre className="text-[11px] font-mono text-rose-700 bg-rose-50 p-2.5 rounded-xl border border-rose-100 text-left overflow-x-auto max-h-32">
                  {this.state.error.message || String(this.state.error)}
                </pre>
              )}
            </div>
            <button
              onClick={this.handleReset}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-600/20 flex items-center justify-center space-x-2 transition"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset Session & Return Home</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
