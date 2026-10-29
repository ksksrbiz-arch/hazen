export const siteOrigin = 'https://bradhazen.com';

// Legacy manual listings remain available, but the Ylopo gallery is the public listing destination.
export function publicSearchPath(pathname) {
  return !/^\/(?:studio|api|media|agent-login|listing-widget|properties|testimonials)(?:\/|$)/.test(pathname);
}

export async function domainResponse(request, response) {
  const url = new URL(request.url);
  const production = url.origin === siteOrigin;
  const headers = new Headers(response.headers);
  const html = headers.get('Content-Type')?.includes('text/html');
  const indexable = production && response.status === 200 && html && publicSearchPath(url.pathname);
  headers.set('X-Robots-Tag', indexable ? 'index, follow' : 'noindex, nofollow');
  const result = new Response(response.body, {status: response.status, statusText: response.statusText, headers});
  if (!indexable) return result;
  return new HTMLRewriter()
    .on('meta[name="robots"]', {
      element(el) {
        el.setAttribute('content', 'index,follow');
      }
    })
    .on('.preview-note', {
      element(el) {
        el.setInnerContent('Inquiry forms prepare an email draft; you send it from your email application.');
      }
    })
    .transform(result);
}
