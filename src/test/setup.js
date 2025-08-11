import '@testing-library/jest-dom'

// Polyfill window.matchMedia for jsdom tests (jsdom doesn't implement it by default)
if (typeof window !== 'undefined' && !window.matchMedia) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query) => ({
      matches: false, // default to light mode; adjust in tests if needed
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      // Legacy API used by some libs
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }),
  })
}
