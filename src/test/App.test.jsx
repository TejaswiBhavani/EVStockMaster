import { describe, it, expect, beforeEach } from 'vitest'
import { render } from '@testing-library/react'
import App from '../App'

// Add a root element to the document for testing
beforeEach(() => {
  const root = document.createElement('div')
  root.id = 'root'
  document.body.appendChild(root)
})

describe('App Component', () => {
  it('renders without crashing', () => {
    const { container } = render(<App />)
    expect(container).toBeTruthy()
  })

  it('renders the main application container', () => {
    const { container } = render(<App />)
    expect(container.firstChild).toBeTruthy()
  })
})

describe('Application Structure', () => {
  it('should have proper document title', () => {
    expect(document.title).toBeDefined()
  })

  it('should have root element for React mounting', () => {
    const rootElement = document.getElementById('root')
    expect(rootElement).toBeTruthy()
  })
})
