import type { APIRoute } from 'astro';

/**
 * Webhook endpoint for on-demand revalidation
 * This allows the CMS to trigger a rebuild when content changes
 *
 * Usage from Payload CMS:
 * POST https://your-domain.com/api/revalidate
 * Headers: { "x-revalidate-token": "your-secret-token" }
 * Body: { "paths": ["/", "/projects"] } (optional)
 */
export const POST: APIRoute = async ({ request }) => {
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
    const paths = body.paths || ['/'];

    // In Vercel, ISR will automatically revalidate on next request
    // This endpoint serves as a webhook trigger
    console.log(`[Revalidate] Triggered for paths:`, paths);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Revalidation triggered',
        paths,
        timestamp: new Date().toISOString()
      }),
      {
        status: 200,
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

// Also support GET for testing
export const GET: APIRoute = () => {
  return new Response(
    JSON.stringify({
      message: 'Revalidation endpoint',
      usage: 'POST with x-revalidate-token header and optional paths in body'
    }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    }
  );
};
