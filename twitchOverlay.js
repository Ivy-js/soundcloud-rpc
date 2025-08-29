const express = require("express");
const app = express();
const port = 3554;

app.use(express.json());
app.use(express.static(__dirname + '/public'));

// Store latest track info
let latestTrack = {
  title: '',
  artist: '',
  cover: '',
  trackLink: '',
  isPlaying: false,
  duration: null,      // in seconds
  position: null,      // in seconds
  startTimestamp: null, // ms epoch
  updatedAt: Date.now()
};

// SSE clients
let sseClients = [];

// Endpoint to receive update-rpc event data
app.post('/update-rpc', (req, res) => {
  const payload = req.body || {};
  
  console.log('[OVERLAY] Raw payload received:', JSON.stringify(payload, null, 2));
  
  // Accept both old (name) and new (title) keys
  latestTrack.title = payload.title || payload.name || '';
  latestTrack.artist = payload.artist || '';
  latestTrack.cover = payload.cover || '';
  latestTrack.trackLink = payload.trackLink || payload.track || '';
  
  // Handle isPlaying with proper fallback
  latestTrack.isPlaying = payload.isPlaying === true || payload.isPlaying === 'true' || payload.lastState === true;
  
  // Handle duration and position with proper null fallback and conversion
  let rawDuration = payload.duration;
  let rawPosition = payload.position;
  
  console.log('[OVERLAY] Raw time values:', { rawDuration, rawPosition });
  
  // Convert duration (likely in milliseconds to seconds)
  if (typeof rawDuration === 'number' && !isNaN(rawDuration)) {
    // If duration seems too large (> 3600), assume it's in milliseconds
    latestTrack.duration = rawDuration > 3600 ? Math.floor(rawDuration / 1000) : rawDuration;
  } else if (typeof rawDuration === 'string' && !isNaN(Number(rawDuration))) {
    const numDuration = Number(rawDuration);
    latestTrack.duration = numDuration > 3600 ? Math.floor(numDuration / 1000) : numDuration;
  } else {
    latestTrack.duration = null;
  }
  
  // Convert position (likely in milliseconds to seconds)  
  if (typeof rawPosition === 'number' && !isNaN(rawPosition)) {
    // If position seems too large (> 3600), assume it's in milliseconds
    latestTrack.position = rawPosition > 3600 ? Math.floor(rawPosition / 1000) : rawPosition;
  } else if (typeof rawPosition === 'string' && !isNaN(Number(rawPosition))) {
    const numPosition = Number(rawPosition);
    latestTrack.position = numPosition > 3600 ? Math.floor(numPosition / 1000) : numPosition;
  } else {
    latestTrack.position = null;
  }
  
  latestTrack.startTimestamp = payload.startTimestamp || 
                              (latestTrack.isPlaying ? Date.now() - ((latestTrack.position || 0) * 1000) : null);
  
  latestTrack.updatedAt = Date.now();

  console.log('[OVERLAY] Processed track data:', {
    title: latestTrack.title,
    artist: latestTrack.artist,
    isPlaying: latestTrack.isPlaying,
    duration: latestTrack.duration,
    position: latestTrack.position,
    startTimestamp: latestTrack.startTimestamp
  });

  // Broadcast to SSE clients
  const data = `data: ${JSON.stringify(latestTrack)}\n\n`;
  sseClients.forEach(clientRes => {
    try { clientRes.write(data); } catch (e) { /* ignore */ }
  });

  res.json({ ok: true });
});

// Endpoint to get latest track info (for overlay polling)
app.get('/track', (req, res) => {
  res.json(latestTrack);
});

// SSE endpoint for real-time overlay updates
app.get('/events', (req, res) => {
  // Set headers for SSE
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
  });

  // Send current state immediately
  res.write(`data: ${JSON.stringify(latestTrack)}\n\n`);

  // Keep track of client
  sseClients.push(res);
  req.on('close', () => {
    sseClients = sseClients.filter(r => r !== res);
  });
});

// Simple root
app.get('/', (req, res) => {
  res.redirect('/overlay');
});

// Overlay page (1200x350) - serve static HTML file
app.get('/overlay', (req, res) => {
  res.sendFile(__dirname + '/overlay.html');
});

app.listen(port, () => {
  console.log(`Twitch overlay server running at http://localhost:${port}/overlay`);
});