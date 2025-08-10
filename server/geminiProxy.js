import 'dotenv/config'
import express from 'express'
import axios from 'axios'
import rateLimit from 'express-rate-limit'
import cors from 'cors'
import helmet from 'helmet'

const app = express()
app.use(express.json({ limit: '1mb' }))
app.use(helmet())

// Allow CORS if explicitly configured; default same-origin
const corsOrigin = process.env.CORS_ORIGIN || true
app.use(cors({ origin: corsOrigin, credentials: true }))

const limiter = rateLimit({ windowMs: 60 * 1000, max: 30 })
app.use('/api/', limiter)

const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent'

app.post('/api/chat', async (req, res) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) return res.status(500).json({ error: 'Server not configured: missing GEMINI_API_KEY' })

    const { input, system } = req.body || {}
    if (!input || typeof input !== 'string') {
      return res.status(400).json({ error: 'Missing input (string)' })
    }

    const prompt = system ? `${system}\n\nUser: ${input}` : input

    const { data } = await axios.post(
      `${GEMINI_URL}?key=${encodeURIComponent(apiKey)}`,
      { contents: [{ parts: [{ text: prompt }] }] },
      { timeout: 20000 }
    )

    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I could not generate a response.'
    res.json({ text })
  } catch (err) {
    const status = err?.response?.status || 500
    res.status(status).json({ error: 'Model call failed' })
  }
})

const port = Number(process.env.PORT || 8080)
app.listen(port, () => console.log(`[gemini-proxy] listening on :${port}`))