export const prerender = false;

import type { APIRoute } from 'astro';

/**
 * Webhook endpoint for on-demand ISR revalidation
 * Triggers cache invalidation for specified routes using Vercel's ISR
 *
 * Usage from Payload CMS:
 * POST https://karenortiz.space/api/revalidate
 * Headers: { "x-revalidate-token": "your-secret-token" }
 * Body: { "routes": ["/", "/projects"] } (optional)
 */
export const POST: APIRoute = async ({ request, url }) => {
  try {
    // Verify secret token
    const token = request.headers.get('x-revalidate-token');
    const secret = import.meta.env.REVALIDATE_TOKEN;

    if (!secret) {
      return new Response(
        JSON.stringify({
          error: 'REVALIDATE_TOKEN not configured',
          message: 'Please set REVALIDATE_TOKEN in your environment variables'
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    if (token !== secret) {
      return new Response(
        JSON.stringify({
          error: 'Invalid token',
          message: 'The provided revalidation token is invalid'
        }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Parse request body
    const body = await request.json().catch(() => ({}));
    const routes = body.routes || ['/'];
    const bypassToken = import.meta.env.ISR_BYPASS_TOKEN;

    if (!bypassToken) {
      return new Response(
        JSON.stringify({
          error: 'ISR_BYPASS_TOKEN not configured',
          message: 'Please set ISR_BYPASS_TOKEN in your environment variables'
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Trigger revalidation for each route
    const results = await Promise.all(
      routes.map(async (route: string) => {
        try {
          // Send HEAD request with x-prerender-revalidate header
          const response = await fetch(`https://${url.host}${route}`, {
            method: 'HEAD',
            headers: {
              'x-prerender-revalidate': bypassToken
            }
          });

          const cacheStatus = response.headers.get('x-vercel-cache');
          const success = cacheStatus === 'REVALIDATED';

          return {
            route,
            success,
            cacheStatus,
            status: response.status
          };
        } catch (error) {
          return {
            route,
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
          };
        }
      })
    );

    const allSuccess = results.every(r => r.success);

    console.log(`[Revalidate] Results:`, results);

    return new Response(
      JSON.stringify({
        success: allSuccess,
        message: allSuccess ? 'All routes revalidated successfully' : 'Some routes failed to revalidate',
        results,
        timestamp: new Date().toISOString()
      }),
      {
        status: allSuccess ? 200 : 207, // 207 Multi-Status for partial success
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('[Revalidate] Error:', error);
    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
};

// GET endpoint for testing
export const GET: APIRoute = () => {
  return new Response(
    JSON.stringify({
      message: 'On-Demand ISR Revalidation Endpoint',
      usage: {
        method: 'POST',
        headers: {
          'x-revalidate-token': 'your-secret-token',
          'Content-Type': 'application/json'
        },
        body: {
          routes: ['/', '/projects', '/about']
        }
      },
      example: `curl -X POST https://karenortiz.space/api/revalidate \\
  -H "x-revalidate-token: your-token" \\
  -H "Content-Type: application/json" \\
  -d '{"routes": ["/"]}'`
    }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    }
  );
};
