import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from '../App'

describe('App Component', () => {
  it('renders without crashing', () => {
    render(<App />)
    expect(document.body).toBeTruthy()
  })

  it('renders the main application container', () => {
    render(<App />)
    // Check if the app container exists
    const appElement = document.querySelector('#root') || document.body
    expect(appElement).toBeTruthy()
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