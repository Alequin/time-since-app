import React from "react";

// https://reactjs.org/docs/error-boundaries.html
export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, ...props };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this?.state?.onError(error, errorInfo);
  }

  render() {
    return !this?.state?.hasError ? this.props.children : null;
  }
}
