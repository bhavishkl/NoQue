import React from 'react';
import { FiAlertCircle } from 'react-icons/fi';
import Link from 'next/link';

class QueueErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('QueueErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-64">
          <FiAlertCircle className="text-5xl text-red-500 mb-4" />
          <h2 className="text-2xl font-semibold text-gray-700">Error loading queue</h2>
          <p className="mt-2 text-gray-500">We're having trouble loading this queue. Please try again later.</p>
          <Link href="/user/queues" className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200">
            Browse Queues
          </Link>
        </div>
      );
    }

    return this.props.children;
  }
}

export default QueueErrorBoundary;