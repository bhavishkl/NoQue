import React from 'react';
import { FiAlertTriangle } from 'react-icons/fi';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
          <FiAlertTriangle className="text-6xl text-red-500 mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Oops! Something went wrong.</h1>
          <p className="text-gray-600 mb-4">We're sorry for the inconvenience. Please try refreshing the page.</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-200"
          >
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;