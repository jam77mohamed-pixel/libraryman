import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Application Error Boundary caught an error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#fff7ed] flex items-center justify-center p-6 text-center">
          <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-orange-200/90 shadow-xl shadow-orange-500/10">
            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-black text-slate-900 mb-2">
              Temporary Display Notice
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed mb-6">
              The application encountered a display refresh notice. Click below to reload the library dashboard.
            </p>
            <button
              onClick={this.handleReload}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 text-white font-bold text-sm shadow-md shadow-orange-400/30 cursor-pointer hover:brightness-105 transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Reload Athenaeum</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
