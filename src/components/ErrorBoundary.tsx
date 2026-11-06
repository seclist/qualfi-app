"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallbackTitle?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("[Qualfi ErrorBoundary]", error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="mx-auto my-12 max-w-xl px-4">
          <div className="card p-6 sm:p-8 text-center">
            <p className="font-mono text-[11px] font-bold uppercase tracking-wider text-brand-cyan">
              COMPONENT RECOVERY
            </p>
            <h3 className="mt-2 text-lg font-bold tracking-tight text-fg">
              {this.props.fallbackTitle ?? "Interactive module encountered an unexpected error"}
            </h3>
            <p className="mt-1.5 text-xs leading-relaxed text-muted">
              Your session data is safe. Click below to reload this interactive module.
            </p>
            <button
              type="button"
              onClick={this.handleReset}
              className="btn-primary mt-5 inline-flex items-center justify-center rounded-full px-5 py-2.5 text-xs font-semibold cursor-pointer"
            >
              Reload Module
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
