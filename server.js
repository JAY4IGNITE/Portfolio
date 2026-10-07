import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

const USERNAME_PATTERN = /^[a-zA-Z0-9_]{3,30}$/;
const SOURCE_API_URL = 'https://codeindex.vercel.app/api/codechef';

// Health / keep-alive endpoint — ping this every 5 min with an uptime monitor
// (e.g. UptimeRobot, BetterStack) to prevent Render free-tier cold starts.
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', uptime: process.uptime() });
});

// API route
app.get('/api/codechef', async (req, res) => {
  const username = String(req.query?.username || '').trim();

  if (!USERNAME_PATTERN.test(username)) {
    return res.status(400).json({ success: false, error: 'Invalid CodeChef username' });
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
    res.set('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
    return res.status(200).json(data);
  } catch (error) {
    const timedOut = error instanceof Error && error.name === 'AbortError';
    return res.status(timedOut ? 504 : 502).json({
      success: false,
      error: timedOut ? 'CodeChef request timed out' : 'Unable to load CodeChef stats',
    });
  } finally {
    clearTimeout(timeout);
  }
});

// Serve static files from the Vite build output
app.use(express.static(path.join(__dirname, 'dist')));

// Handle React routing, return all requests to React app
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
