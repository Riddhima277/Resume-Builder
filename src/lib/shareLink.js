// Client-side "shareable link" — encodes the full resume data into the
// URL itself (base64 of JSON), so no backend/database is needed. The
// resume opens read-only when the URL contains ?view=<encoded>.
// Trade-off: long URLs for big resumes, but zero infra and works on
// the free Vercel Hobby tier with no server code at all.

export function encodeShareData(data, template) {
  try {
    const payload = JSON.stringify({ d: data, t: template })
    const b64 = btoa(unescape(encodeURIComponent(payload)))
    return b64
  } catch {
    return null
  }
}

export function decodeShareData(encoded) {
  try {
    const json = decodeURIComponent(escape(atob(encoded)))
    const payload = JSON.parse(json)
    return { data: payload.d, template: payload.t }
  } catch {
    return null
  }
}

export function buildShareUrl(data, template) {
  const encoded = encodeShareData(data, template)
  if (!encoded) return null
  const url = new URL(window.location.href)
  url.search = ''
  url.searchParams.set('view', encoded)
  return url.toString()
}

export function getShareParamFromUrl() {
  const params = new URLSearchParams(window.location.search)
  return params.get('view')
}
