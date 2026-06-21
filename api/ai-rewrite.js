

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions'
const MODEL = 'llama-3.3-70b-versatile'

// Per-task system prompts. Kept short and specific so the model
// stays on-task and doesn't pad responses with commentary.
const PROMPTS = {
  bullet: `You rewrite resume bullet points to be stronger.
The input may be one bullet or several, one per line.
Rules:
- Rewrite EVERY line given, in the same order, same number of lines
- Each line starts with a strong action verb (Built, Led, Reduced, Designed, Implemented, etc.)
- Keep each line to one sentence, under 25 words
- Preserve every fact in each line — never invent numbers, tools, or outcomes that weren't mentioned
- If a line has no metric, do NOT invent one — just tighten the wording and verb
- Return ONLY the rewritten lines, one per line, no quotes, no numbering, no explanation, no markdown`,

  summary: `You rewrite a resume professional summary to be more polished and concise.
Rules:
- 2-3 sentences, under 60 words total
- Preserve every fact the user gave you (degree, skills, experience) — never invent new ones
- Confident, professional tone — no clichés like "team player" or "hard worker" with no evidence
- Return ONLY the rewritten summary text, no quotes, no explanation, no markdown`,

  project: `You rewrite a resume project description to be clearer and more outcome-focused.
Rules:
- Keep it to 1-2 sentences, under 40 words
- Preserve every fact given — never invent tools, numbers, or results not mentioned
- Lead with what was built/done, not the process
- Return ONLY the rewritten text, no quotes, no explanation, no markdown`,
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) {
    res.status(500).json({ error: 'Server is not configured with an API key yet.' })
    return
  }

  const { mode, text, context } = req.body || {}

  if (!text || typeof text !== 'string' || !text.trim()) {
    res.status(400).json({ error: 'No text provided.' })
    return
  }
  if (text.length > 1200) {
    res.status(400).json({ error: 'Text is too long for a single rewrite. Try a shorter block.' })
    return
  }

  const systemPrompt = PROMPTS[mode] || PROMPTS.bullet
  const userContent = context
    ? `Context: ${context}\n\nText to rewrite:\n${text}`
    : `Text to rewrite:\n${text}`

  try {
    const groqRes = await fetch(GROQ_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userContent },
        ],
        temperature: 0.4,
        max_tokens: 400,
      }),
    })

    if (!groqRes.ok) {
      const errBody = await groqRes.text()
      // Pass through a clean message without leaking the key or raw provider response
      const status = groqRes.status === 429 ? 429 : 502
      res.status(status).json({
        error: groqRes.status === 429
          ? 'AI assistant is busy right now (rate limit). Try again in a minute.'
          : 'AI assistant is temporarily unavailable.',
      })
      console.error('Groq error', groqRes.status, errBody)
      return
    }

    const data = await groqRes.json()
    const result = data?.choices?.[0]?.message?.content?.trim()

    if (!result) {
      res.status(502).json({ error: 'AI assistant returned an empty response.' })
      return
    }

    res.status(200).json({ result })
  } catch (err) {
    console.error('ai-rewrite handler error', err)
    res.status(500).json({ error: 'Something went wrong reaching the AI assistant.' })
  }
}
