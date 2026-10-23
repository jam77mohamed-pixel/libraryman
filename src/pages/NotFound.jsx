import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass, ArrowLeft, Home } from 'lucide-react';
import Button from '../components/common/Button';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-center">
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200/90 shadow-xl p-8 sm:p-10">
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4">
          <Compass className="w-8 h-8 animate-spin-slow" />
        </div>
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">404</h1>
        <h2 className="text-lg font-bold text-slate-800 mt-2">Page Not Found</h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-2">
          The catalog shelf or page you are looking for has been moved or does not exist.
        </p>

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            variant="secondary"
            size="sm"
            icon={ArrowLeft}
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto"
          >
            Go Back
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={Home}
            onClick={() => navigate('/')}
            className="w-full sm:w-auto"
          >
            Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
