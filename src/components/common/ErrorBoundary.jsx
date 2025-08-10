import React from 'react'

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    console.error('UI ErrorBoundary caught an error:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6">
          <div className="modern-card p-8 max-w-lg text-left">
            <h1 className="text-2xl font-bold heading-gradient mb-2">Something went wrong</h1>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              An unexpected error occurred. Try refreshing the page. If the problem persists, please
              contact support.
            </p>
            <button className="btn-primary" onClick={() => window.location.reload()}>
              Reload
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
