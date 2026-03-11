import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from './Button';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

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
    }

    private handleReset = () => {
        this.setState({ hasError: false, error: null });
        window.location.href = '/';
    };

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-[400px] flex items-center justify-center p-6">
                    <div className="card glass max-w-md w-full text-center p-8 space-y-6">
                        <div className="flex justify-center">
                            <div className="p-4 bg-red-500/10 rounded-full text-red-500">
                                <AlertTriangle size={48} strokeWidth={1.5} />
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

        return this.children;
    }
}
极
