
export async function aiRewrite(mode, text, context) {
  const res = await fetch('/api/ai-rewrite', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mode, text, context }),
  })

  const data = await res.json().catch(() => ({}))

  if (!res.ok) {
    throw new Error(data.error || 'AI rewrite failed.')
  }

  return data.result
}
