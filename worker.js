// Cloudflare Workers static assets entry point for zashboard.
// Serves the dist/ directory via Workers Static Assets with SPA fallback.
export default {
  async fetch(request, env) {
    const url = new URL(request.url)

    // Try to serve the exact asset first.
    let response = await env.ASSETS.fetch(request)

    // If the asset was not found (404) and the request is not for a file
    // (no file extension in the last path segment), serve index.html
    // for client-side routing (SPA fallback).
    if (response.status === 404) {
      const pathname = url.pathname
      const lastSegment = pathname.split('/').pop() || ''

      // If the path doesn't look like a static file, serve index.html
      if (!lastSegment.includes('.')) {
        response = await env.ASSETS.fetch(new Request(new URL('/index.html', request.url), request))
      }
    }

    return response
  },
}
