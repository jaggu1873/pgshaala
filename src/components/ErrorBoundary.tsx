import React, { Component, ErrorInfo, ReactNode } from "react";
import * as Sentry from "@sentry/react";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCcw } from "lucide-react";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    Sentry.captureException(error, { extra: errorInfo as any });
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-background">
          <div className="max-w-md w-full p-8 rounded-3xl border border-border bg-card shadow-xl text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center mx-auto">
              <AlertCircle className="w-8 h-8 text-destructive" />
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-display font-bold text-foreground">Something went wrong</h1>
              <p className="text-muted-foreground text-sm">
                We've encountered an unexpected error. Don't worry, our team has been notified.
              </p>
            </div>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="p-4 rounded-xl bg-destructive/5 border border-destructive/10 text-left overflow-auto max-h-40">
                <code className="text-[10px] text-destructive font-mono break-all">
                  {this.state.error.toString()}
                </code>
              </div>
            )}
            <Button 
              onClick={() => window.location.reload()}
              className="w-full gap-2 py-6 rounded-2xl"
            >
              <RefreshCcw className="w-4 h-4" />
              Reload Application
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
