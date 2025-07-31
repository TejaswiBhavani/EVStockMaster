// Test setup file for Vitest
import { expect, afterEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'
import * as matchers from '@testing-library/jest-dom/matchers'

// Extend Vitest's expect with Testing Library matchers
expect.extend(matchers)

// Clean up after each test case
afterEach(() => {
  cleanup()
})

// Mock Firebase to avoid authentication errors in tests
const mockFirebase = {
  auth: {
    currentUser: null,
    signInWithPopup: vi.fn(),
    signOut: vi.fn(),
    onAuthStateChanged: vi.fn((callback) => {
      // Call callback immediately with null user
      if (callback) callback(null)
      // Return unsubscribe function
      return vi.fn()
    }),
  },
  db: {
    collection: vi.fn(),
    doc: vi.fn(),
  },
}

// Mock Firebase modules
vi.mock('../config/firebase', () => ({
  auth: mockFirebase.auth,
  db: mockFirebase.db,
  googleProvider: {},
}))

// Mock react-firebase-hooks to prevent listener errors
vi.mock('react-firebase-hooks/auth', () => ({
  useAuthState: vi.fn(() => [null, false, null]),
  useSignInWithPopup: vi.fn(() => [vi.fn(), null, false, null]),
}))

// Mock Three.js modules to avoid WebGL errors in tests
vi.mock('three', () => ({
  Scene: vi.fn(() => ({ add: vi.fn(), remove: vi.fn() })),
  PerspectiveCamera: vi.fn(),
  WebGLRenderer: vi.fn(() => ({
    setSize: vi.fn(),
    render: vi.fn(),
    domElement: document.createElement('canvas'),
  })),
  BoxGeometry: vi.fn(),
  MeshBasicMaterial: vi.fn(),
  Mesh: vi.fn(),
}))

// Mock @react-three/fiber to avoid canvas errors
vi.mock('@react-three/fiber', () => ({
  Canvas: vi.fn().mockImplementation(({ children }) => children),
  useFrame: vi.fn(),
  useThree: vi.fn(() => ({
    camera: {},
    scene: {},
    gl: {},
  })),
}))

// Mock @react-three/drei components
vi.mock('@react-three/drei', () => ({
  OrbitControls: vi.fn(),
  Environment: vi.fn(),
  ContactShadows: vi.fn(),
  useGLTF: vi.fn(() => ({
    scene: { clone: vi.fn() },
    nodes: {},
    materials: {},
  })),
}))

// Global test utilities
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})