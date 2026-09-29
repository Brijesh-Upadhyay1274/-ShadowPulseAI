import { Component, ErrorInfo, ReactNode } from 'react';
import { ShieldAlert, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ShadowPulse Uncaught UI Exception:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="bg-[#0B1020] border border-[#FF3B30]/40 rounded-xl p-6 text-gray-200 shadow-[0_0_25px_rgba(255,59,48,0.2)] font-mono text-xs">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded bg-[#FF3B30]/20 text-[#FF3B30] border border-[#FF3B30]/40">
              <ShieldAlert size={20} />
            </div>
            <div>
              <div className="text-sm font-bold text-white">
                {this.props.fallbackTitle || 'Component Visualizer Notice'}
              </div>
              <div className="text-[10px] text-gray-400">
                Passive data telemetry rendered with fallback
              </div>
            </div>
          </div>
          <div className="bg-[#050811] p-3 rounded text-red-400 border border-white/5 mb-4">
            {this.state.error?.message || 'Visualization render exception caught.'}
          </div>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="px-3 py-1.5 rounded bg-[#00E5FF]/20 hover:bg-[#00E5FF]/30 text-[#00E5FF] border border-[#00E5FF]/40 text-xs font-bold transition flex items-center gap-1.5"
          >
            <RefreshCw size={13} />
            <span>Reset Visualizer</span>
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
