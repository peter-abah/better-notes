import { Component } from "react";

type State = { error: any };
type Props = { children: React.ReactNode };

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: any) {
    // Update state so the next render will show the fallback UI.
    return { error: JSON.stringify(error, Object.getOwnPropertyNames(error)) };
  }

  render() {
    const { error } = this.state;
    const { children } = this.props;
    if (error) {
      return (
        <div>
          <h1>Something went wrong.</h1>
          <p>{error}</p>
        </div>
      );
    }

    return children;
  }
}

export default ErrorBoundary;
