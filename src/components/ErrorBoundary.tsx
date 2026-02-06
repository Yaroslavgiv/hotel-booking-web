import { Component, ErrorInfo, ReactNode } from 'react';
import './ErrorBoundary.css';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <div className="error-boundary-content">
            <h2>Что-то пошло не так</h2>
            <p>Произошла ошибка при загрузке страницы.</p>
            {this.state.error && (
              <details className="error-details">
                <summary>Детали ошибки</summary>
                <pre>{this.state.error.toString()}</pre>
              </details>
            )}
            <button onClick={this.handleReset} className="error-reset-button">
              Вернуться на главную
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
