export const prerender = false;

import type { APIRoute } from 'astro';

/**
 * Diagnostic endpoint to verify ISR configuration
 * This helps debug why revalidation might return HIT instead of REVALIDATED
 */
export const GET: APIRoute = () => {
  const token = import.meta.env.ISR_BYPASS_TOKEN;

  // Security: Only show partial token info
  const tokenInfo = token
    ? {
        configured: true,
        length: token.length,
        preview: `${token.substring(0, 8)}...${token.substring(token.length - 4)}`,
        meetsMinLength: token.length >= 32
      }
    : {
        configured: false,
        error: 'ISR_BYPASS_TOKEN not set in environment variables'
      };

  return new Response(
    JSON.stringify({
      isr: {
        bypassToken: tokenInfo,
        environment: import.meta.env.MODE,
        timestamp: new Date().toISOString()
      },
      instructions: {
        message: 'Verify this token matches the one sent from your CMS',
        cms_should_send: 'x-prerender-revalidate header with the same bypass token',
        expected_response: 'X-Vercel-Cache: REVALIDATED'
      }
    }, null, 2),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store'
      }
    }
  );
};
