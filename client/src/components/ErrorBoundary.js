import { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("Buy-Wise render error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="app-error" role="alert">
          <div className="container app-error__inner">
            <h1>Something went wrong</h1>
            <p>Refresh the page or try again in a moment.</p>
            <button className="btn-primary" onClick={() => window.location.reload()}>
              Refresh
            </button>
          </div>
        </main>
      );
    }

    return this.props.children;
  }
}
