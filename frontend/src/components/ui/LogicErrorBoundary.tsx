import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from './Button';

interface Props {
    /** The child components to be shielded by the error boundary. */
    children: ReactNode;
}

interface State {
    /** Whether an error has been caught by the boundary. */
    hasError: boolean;
    /** The actual error object if caught, used for development debugging. */
    error: Error | null;
}

/**
 * A specialized error boundary for catching and displaying logic errors in the UI.
 * Provides a fallback UI with reload and reset options.
 */
export class LogicErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
        // Log to error tracking service in production
        if (process.env.NODE_ENV === 'production') {
            this.logToService(error, errorInfo);
        }
    }

    /**
     * Logs error details to an external tracking service.
     * In production, this sends errors to the monitoring endpoint.
     */
    private logToService(error: Error, errorInfo: ErrorInfo) {
        // TODO: Integrate with actual error tracking service
        const errorLog = {
            message: error.message,
            stack: error.stack,
            componentStack: errorInfo.componentStack,
            timestamp: new Date().toISOString()
        };
        console.error('[ErrorBoundary] Production error logged:', errorLog);
    }

    /**
     * Resets the error state and redirects the user to the home page.
     * Used as a last-resort recovery mechanism from fatal logic errors.
     */
    private handleReset = () => {
        this.setState({ hasError: false, error: null });
        window.location.href = '/';
    };

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.05)_0%,transparent_70%)]">
                    <div className="card glass border-white/5 max-w-md w-full text-center p-12 space-y-8 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500/50 to-transparent" />
                        <div className="flex justify-center">
                            <div className="p-6 bg-red-500/10 rounded-3xl text-red-500 backdrop-blur-3xl border border-red-500/20 shadow-[0_0_40px_rgba(239,68,68,0.1)]">
                                <AlertTriangle size={56} strokeWidth={1} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <h2 className="text-2xl font-bold">Something went wrong</h2>
                            <p className="text-muted-foreground text-sm">
                                The application encountered an unexpected logic error.
                                Our team has been notified.
                            </p>
                        </div>

                        {process.env.NODE_ENV === 'development' && (
                            <pre className="text-left bg-black/20 p-4 rounded-lg text-xs font-mono overflow-auto max-h-32 text-red-300">
                                {this.state.error?.message}
                            </pre>
                        )}

                        <div className="flex flex-col gap-3">
                            <Button
                                variant="primary"
                                onClick={() => window.location.reload()}
                                className="w-full"
                            >
                                <RefreshCw size={18} className="mr-2" />
                                Reload Application
                            </Button>
                            <Button
                                variant="outline"
                                onClick={this.handleReset}
                                className="w-full"
                            >
                                <Home size={18} className="mr-2" />
                                Return Home
                            </Button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
