import {galleryResponse} from '../server/ylopo-gallery.js';
import {searchWidgetResponse} from '../server/search-widget.js';
import {publicRecoveryResponse} from '../server/public-recovery.js';
import {editor, ConfigError} from '../server/auth.js';
import {detail, published, collection} from '../server/public.js';
import {idPattern} from '../server/listings.js';
import {secureResponse} from '../server/response-security.js';
import {domainResponse, siteOrigin} from '../server/site-domain.js';
export async function onRequest(context) {
  const url = new URL(context.request.url);
  if (url.hostname === 'www.bradhazen.com' || (url.hostname === 'bradhazen.com' && url.protocol !== 'https:')) {
    return Response.redirect(siteOrigin + url.pathname + url.search, 301);
  }
  if (url.pathname === '/robots.txt') {
    return new Response(
      url.origin === siteOrigin
        ? `User-agent: *\nAllow: /\nDisallow: /studio\nDisallow: /api/\nDisallow: /agent-login\nDisallow: /listing-widget\nDisallow: /search-widget\nDisallow: /properties\nDisallow: /testimonials\nSitemap: ${siteOrigin}/sitemap.xml\n`
        : 'User-agent: *\nDisallow: /\n',
      {headers: {'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store'}}
    );
  }
  if (url.pathname === '/sitemap.xml' && url.origin !== siteOrigin) {
    return new Response('Not found', {status: 404, headers: {'X-Robots-Tag': 'noindex'}});
  }
  if (url.pathname.replace(/\/$/, '') === '/listing-widget') return galleryResponse();
  if (url.pathname.replace(/\/$/, '') === '/search-widget') return searchWidgetResponse();
  return secureResponse(await domainResponse(context.request, await handleRequest(context)));
}
async function handleRequest(context) {
  const {request, env} = context,
    url = new URL(request.url),
    path = url.pathname;
  if (path === '/studio' || path.startsWith('/studio/')) {
    try {
      await editor(request, env);
    } catch (error) {
      if (error instanceof ConfigError) {
        console.error('Editor authentication is not configured');
        return new Response('The listing studio is not configured. Contact the developer.', {
          status: 503,
          headers: {'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex'}
        });
      }
      return new Response('Sign in to the private listing studio.', {
        status: 401,
        headers: {'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex'}
      });
    }
    if (path.startsWith('/studio/preview/')) {
      const id = path.slice('/studio/preview/'.length).replace(/\/$/, '');
      const headers = {
        'Cache-Control': 'private, no-store',
        'X-Robots-Tag': 'noindex, nofollow',
        'X-Content-Type-Options': 'nosniff',
        'Referrer-Policy': 'no-referrer'
      };
      if (!['GET', 'HEAD'].includes(request.method)) return new Response('Method not allowed', {status: 405, headers});
      if (!idPattern.test(id)) return new Response('Draft not found.', {status: 404, headers});
      if (!env.DB) return new Response('Draft preview is temporarily unavailable.', {status: 503, headers});
      let row, item;
      try {
        row = await env.DB.prepare('SELECT draft_json FROM listings WHERE id=?').bind(id).first();
        if (row) item = JSON.parse(row.draft_json);
      } catch (error) {
        console.error('Draft preview failed', error?.name);
        return new Response('Draft preview is temporarily unavailable.', {status: 503, headers});
      }
      if (!row) return new Response('Draft not found.', {status: 404, headers});
      const shell = await env.ASSETS.fetch(new Request(url.origin + '/properties/'));
      const response = new Response(shell.body, {
        status: shell.status,
        headers: {...Object.fromEntries(shell.headers), ...headers}
      });
      return new HTMLRewriter()
        .on('main', {
          element(el) {
            el.setInnerContent(detail(id, item, {preview: true}), {html: true});
          }
        })
        .on('title', {
          element(el) {
            el.setInnerContent('Private preview: ' + (item.title || 'Untitled listing') + ' | Brad Hazen');
          }
        })
        .on('meta[property^="og:"]', {
          element(el) {
            el.remove();
          }
        })
        .on('meta[name="description"]', {
          element(el) {
            el.remove();
          }
        })
        .on('link[rel="canonical"]', {
          element(el) {
            el.remove();
          }
        })
        .on('.mobile-contact', {
          element(el) {
            el.remove();
          }
        })
        .transform(response);
    }
    const response = await context.next(),
      headers = new Headers(response.headers);
    headers.set('Cache-Control', 'private, no-store');
    return new Response(response.body, {status: response.status, headers});
  }
  if (path !== '/' && path !== '/properties' && !path.startsWith('/properties/')) return context.next();
  if (request.method !== 'GET' && request.method !== 'HEAD') return new Response('Method not allowed', {status: 405});
  if (path === '/') {
    // The homepage featured section is the static Ylopo gallery (#brad-mls-listings) and no longer reads D1.
    const shell = await context.next(),
      headers = new Headers(shell.headers);
    headers.set('Cache-Control', 'no-store');
    return new Response(shell.body, {status: shell.status, headers});
  }
  let items;
  try {
    items = await published(env);
  } catch {
    return publicRecoveryResponse(context, 'listings');
  }
  let response,
    rewriter = new HTMLRewriter();
  if (path === '/properties/' || path === '/properties') {
    response = await context.next();
    rewriter.on('.inner-content', {
      element(el) {
        el.setInnerContent(collection(items, url), {html: true});
      }
    });
  } else {
    const slug = path.replace(/^\/properties\//, '').replace(/\/$/, '');
    const record = items.find(({item}) => item.slug === slug);
    if (!record) return publicRecoveryResponse(context, 'property');
    response = await env.ASSETS.fetch(new Request(url.origin + '/properties/'));
    rewriter
      .on('main', {
        element(el) {
          el.setInnerContent(detail(record.id, record.item), {html: true});
        }
      })
      .on('title', {
        element(el) {
          el.setInnerContent(record.item.title + ' | Brad Hazen');
        }
      })
      .on('link[rel="canonical"]', {
        element(el) {
          el.setAttribute('href', url.origin + '/properties/' + record.item.slug + '/');
        }
      })
      .on('meta[property="og:title"]', {
        element(el) {
          el.setAttribute('content', record.item.title + ' | Brad Hazen');
        }
      })
      .on('meta[property="og:description"]', {
        element(el) {
          el.setAttribute('content', record.item.description.slice(0, 160));
        }
      })
      .on('meta[property="og:url"]', {
        element(el) {
          el.setAttribute('content', url.origin + '/properties/' + record.item.slug + '/');
        }
      })
      .on('meta[property="og:image"]', {
        element(el) {
          el.setAttribute('content', url.origin + '/media/' + record.id + '/' + record.item.images[0].file);
        }
      })
      .on('meta[name="description"]', {
        element(el) {
          el.setAttribute('content', record.item.description.slice(0, 160));
        }
      });
  }
  const headers = new Headers(response.headers);
  headers.set('Cache-Control', 'no-store');
  headers.set('X-Robots-Tag', 'noindex, nofollow');
  headers.set('X-Content-Type-Options', 'nosniff');
  return rewriter.transform(new Response(response.body, {status: response.status, headers}));
}
