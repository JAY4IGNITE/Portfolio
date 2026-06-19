const USERNAME_PATTERN = /^[a-zA-Z0-9_]{3,30}$/;
const SOURCE_API_URL = 'https://codeindex.vercel.app/api/codechef';

export default async function handler(request, response) {
  const username = String(request.query?.username || '').trim();

  if (!USERNAME_PATTERN.test(username)) {
    return response.status(400).json({ success: false, error: 'Invalid CodeChef username' });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const sourceUrl = new URL(SOURCE_API_URL);
    sourceUrl.searchParams.set('username', username);

    const sourceResponse = await fetch(sourceUrl, {
      cache: 'no-store',
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    });

    if (!sourceResponse.ok) {
      throw new Error(`CodeChef source returned ${sourceResponse.status}`);
    }

    const data = await sourceResponse.json();
    response.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
    return response.status(200).json(data);
  } catch (error) {
    const timedOut = error instanceof Error && error.name === 'AbortError';
    return response.status(timedOut ? 504 : 502).json({
      success: false,
      error: timedOut ? 'CodeChef request timed out' : 'Unable to load CodeChef stats',
    });
  } finally {
    clearTimeout(timeout);
  }
}
