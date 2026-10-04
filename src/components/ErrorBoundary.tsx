import { Component, type ErrorInfo, type ReactNode } from "react";

export class ErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(error: Error, info: ErrorInfo) { console.error("Runtime UI failure", error, info); }
  render() {
    if (this.state.failed) return <main className="error-state"><span>SYSTEM.ERROR / UI_FAILURE</span><h1>The interface stopped unexpectedly.</h1><p>Reload the page to restart this runtime.</p><button onClick={() => window.location.reload()}>Restart interface</button></main>;
    return this.props.children;
  }
}

