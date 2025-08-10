// Common domains that need to be authorized in Firebase Console
// Go to: Firebase Console > Authentication > Settings > Authorized domains

export const REQUIRED_AUTHORIZED_DOMAINS = [
  // Development domains
  'localhost',
  '127.0.0.1',

  // Common deployment platforms
  'vercel.app',
  'netlify.app',
  'firebase.app',
  'firebaseapp.com',
  'web.app',

  // Add your custom domain here if you have one
  // 'yourdomain.com',
]

// Get current domain info for debugging
export const getCurrentDomainInfo = () => {
  const hostname = window.location.hostname
  const port = window.location.port
  const protocol = window.location.protocol
  const origin = window.location.origin

  return {
    hostname,
    port,
    protocol,
    origin,
    fullDomain: port ? `${hostname}:${port}` : hostname,
  }
}

// Check if current domain might cause auth issues
export const isDomainLikelyUnauthorized = () => {
  const { hostname } = getCurrentDomainInfo()

  // Common unauthorized domains during development
  const problematicDomains = [
    'localhost',
    '127.0.0.1',
    'local.',
    '.local',
    '.ngrok.io',
    'codesandbox.io',
    'stackblitz.com',
    'codepen.io',
  ]

  return problematicDomains.some((domain) => hostname === domain || hostname.includes(domain))
}

// Generate Firebase console URL for easy access
export const getFirebaseConsoleAuthURL = (projectId) => {
  return `https://console.firebase.google.com/project/${projectId}/authentication/settings`
}
