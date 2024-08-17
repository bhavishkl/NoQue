// components/QueueListErrorBoundary.js
import React from 'react'
import { FiAlertCircle } from 'react-icons/fi'

class QueueListErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Queue list error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 my-4" role="alert">
          <div className="flex items-center">
            <FiAlertCircle className="mr-2" />
            <p className="font-bold">Error loading queues</p>
          </div>
          <p>We're sorry, but there was an error loading the queue list. Please try refreshing the page.</p>
        </div>
      )
    }

    return this.props.children
  }
}

export default QueueListErrorBoundary