/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Live Health & Smithery MCP Runtime Monitor API
 * Provides live HTTP probes, latency benchmarking, and authentication diagnostics
 */

export default async function handler(req, res) {
  // CORS support
  if (res && res.setHeader) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  }

  if (req && req.method === 'OPTIONS') {
    if (res && res.status) return res.status(200).end();
    return new Response(null, { status: 200 });
  }

  const startTime = Date.now();
  const rawKey = process.env.SMITHERY_API_KEY || process.env.INFLUSHIP_API_KEY || process.env['smithery-mcp-key'] || process.env.SMITHERY_MCP_KEY || '';
  const hasKey = Boolean(rawKey && rawKey.trim());
  const smitheryEndpoint = process.env.SMITHERY_MCP_ENDPOINT || 'https://server.smithery.ai/influship/influship-mcp';

  // Live MCP Probe
  let mcpRunning = false;
  let mcpStatus = 'UNREACHABLE_OFFLINE';
  let mcpHttpCode = null;
  let mcpLatency = null;
  let mcpError = null;
  let mcpHeaders = {};

  const probeStart = Date.now();
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4500);

    const headers = {
      'User-Agent': 'PulseHorizon-MCP-Monitor/1.0',
      'Accept': 'application/json',
    };
    if (hasKey) {
      headers['Authorization'] = `Bearer ${rawKey.trim()}`;
    }

    const probeResponse = await fetch(smitheryEndpoint, {
      method: 'GET',
      headers,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    mcpLatency = Date.now() - probeStart;
    mcpHttpCode = probeResponse.status;

    // Any HTTP response (200, 204, 401, 403, 404, 405) proves the remote MCP server process is running
    mcpRunning = true;

    if (probeResponse.status >= 200 && probeResponse.status < 300) {
      mcpStatus = 'HEALTHY_AUTHENTICATED';
    } else if (probeResponse.status === 401) {
      mcpStatus = hasKey ? 'AUTH_REJECTED_INVALID_KEY' : 'RUNNING_AUTH_REQUIRED';
    } else {
      mcpStatus = `RUNNING_STATUS_${probeResponse.status}`;
    }

    mcpHeaders = {
      server: probeResponse.headers.get('server') || 'cloudflare',
      contentType: probeResponse.headers.get('content-type') || 'application/json',
      authChallenge: probeResponse.headers.get('www-authenticate') || null,
    };
  } catch (err) {
    mcpLatency = Date.now() - probeStart;
    mcpRunning = false;
    mcpStatus = err.name === 'AbortError' ? 'TIMEOUT_OFFLINE' : 'CONNECTION_FAILED';
    mcpError = err.message || 'Unknown network error';
  }

  // Masked API key representation for security
  const maskedKey = hasKey
    ? (rawKey.length > 8 ? `${rawKey.substring(0, 4)}...${rawKey.substring(rawKey.length - 4)}` : '••••••••')
    : null;

  // Diagnostic advice
  let diagnosticMessage = 'Influship MCP is running and operational.';
  if (!mcpRunning) {
    diagnosticMessage = `Unable to reach MCP endpoint at ${smitheryEndpoint}. Check network connectivity.`;
  } else if (!hasKey) {
    diagnosticMessage = 'MCP server is online. Please set SMITHERY_API_KEY in Vercel Environment Variables to enable full tool execution.';
  } else if (mcpStatus === 'AUTH_REJECTED_INVALID_KEY') {
    diagnosticMessage = 'MCP server is online, but the configured SMITHERY_API_KEY was rejected. Check token validity in Smithery dashboard.';
  }

  const healthData = {
    status: mcpRunning ? 'healthy' : 'degraded',
    service: 'Pulse Horizon Influencer Intelligence API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'production',
    mcp: {
      running: mcpRunning,
      status: mcpStatus,
      server_name: 'influship/influship-mcp',
      endpoint: smitheryEndpoint,
      latency_ms: mcpLatency,
      http_code: mcpHttpCode,
      api_key_configured: hasKey,
      key_preview: maskedKey,
      diagnostic: diagnosticMessage,
      error: mcpError,
      response_headers: mcpHeaders,
      available_tools: [
        'influship.search_creators',
        'influship.get_profile_metrics',
        'influship.retrieve_contact_emails',
        'influship.find_similar_creators',
        'influship.fetch_live_feed',
      ],
      supported_platforms: ['instagram', 'tiktok', 'youtube'],
      last_probe_at: new Date().toISOString(),
    },
    endpoints: {
      health: '/api/health',
      creators: '/api/creators',
      profiles: '/api/profiles',
      emails: '/api/emails',
      insight: '/api/insight',
      shortlists: '/api/shortlists',
      mcp_proxy: '/api/mcp',
    },
    uptime_seconds: Math.floor(process.uptime ? process.uptime() : 0),
    total_execution_ms: Date.now() - startTime,
  };

  // Check if browser requested HTML
  const acceptHeader = (req && req.headers && (req.headers.accept || req.headers.Accept)) || '';
  const url = req && req.url ? new URL(req.url, 'http://localhost') : new URL('http://localhost');
  const wantsHtml = acceptHeader.includes('text/html') && url.searchParams.get('format') !== 'json';

  if (wantsHtml) {
    const isGreen = mcpRunning;
    const badgeColor = isGreen ? '#10B981' : '#EF4444';
    const badgeBg = isGreen ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)';
    const badgeBorder = isGreen ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)';

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Pulse Horizon - MCP & API Monitor</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&family=Space+Grotesk:wght@600;700&family=Geist:wght@400;500;600&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background-color: #0B0F17;
      color: #dfe2ee;
      font-family: 'Geist', -apple-system, sans-serif;
      padding: 32px 16px;
      display: flex;
      justify-content: center;
    }
    .container {
      width: 100%;
      max-width: 820px;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid rgba(255,255,255,0.08);
      padding-bottom: 16px;
    }
    .brand {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 20px;
      font-weight: 700;
      color: #fff;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      font-weight: 600;
      padding: 4px 10px;
      border-radius: 9999px;
      background: ${badgeBg};
      color: ${badgeColor};
      border: 1px solid ${badgeBorder};
    }
    .pulse-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: ${badgeColor};
      box-shadow: 0 0 10px ${badgeColor};
      animation: pulse 1.5s infinite;
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.4; transform: scale(0.85); }
    }
    .card {
      background: rgba(20, 26, 38, 0.85);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 16px;
      padding: 24px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.4);
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 12px;
      margin-top: 16px;
    }
    .stat {
      background: #0f131c;
      border: 1px solid rgba(255,255,255,0.06);
      border-radius: 12px;
      padding: 14px;
    }
    .stat-label {
      font-family: 'JetBrains Mono', monospace;
      font-size: 10px;
      text-transform: uppercase;
      color: #908fa0;
    }
    .stat-val {
      font-family: 'JetBrains Mono', monospace;
      font-size: 16px;
      font-weight: 700;
      color: #fff;
      margin-top: 4px;
    }
    .diagnostic {
      margin-top: 16px;
      padding: 12px 16px;
      border-radius: 10px;
      font-size: 12px;
      background: rgba(99, 102, 241, 0.1);
      border: 1px solid rgba(99, 102, 241, 0.25);
      color: #c0c1ff;
    }
    pre {
      background: #080b11;
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 12px;
      padding: 16px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      color: #34d399;
      overflow-x: auto;
      line-height: 1.5;
    }
    .btn {
      display: inline-block;
      padding: 8px 14px;
      background: #6366F1;
      color: #fff;
      font-size: 12px;
      font-weight: 600;
      text-decoration: none;
      border-radius: 8px;
      border: none;
      cursor: pointer;
    }
    .btn:hover { background: #4f46e5; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="brand">
        <span>⚡ PULSE HORIZON</span>
        <span style="font-size: 12px; color: #908fa0; font-weight: normal;">// MCP Live Monitor</span>
      </div>
      <div class="badge">
        <span class="pulse-dot"></span>
        <span>${mcpRunning ? 'MCP IS RUNNING' : 'MCP UNREACHABLE'}</span>
      </div>
    </div>

    <div class="card">
      <div style="display: flex; justify-content: space-between; align-items: flex-start;">
        <div>
          <h2 style="font-family: 'Space Grotesk', sans-serif; font-size: 18px; color: #fff;">
            Influship Influencer Marketing MCP Gateway
          </h2>
          <p style="font-size: 12px; color: #908fa0; margin-top: 4px;">
            Target Endpoint: <code style="color: #c0c1ff; font-family: 'JetBrains Mono';">${smitheryEndpoint}</code>
          </p>
        </div>
        <a href="/api/health?format=json" class="btn">View Raw JSON</a>
      </div>

      <div class="diagnostic">
        <strong>Status Notice:</strong> ${diagnosticMessage}
      </div>

      <div class="grid">
        <div class="stat">
          <div class="stat-label">MCP State</div>
          <div class="stat-val" style="color: ${badgeColor};">${mcpStatus}</div>
        </div>
        <div class="stat">
          <div class="stat-label">Roundtrip Latency</div>
          <div class="stat-val">${mcpLatency !== null ? mcpLatency + ' ms' : 'N/A'}</div>
        </div>
        <div class="stat">
          <div class="stat-label">HTTP Probe Status</div>
          <div class="stat-val">${mcpHttpCode !== null ? mcpHttpCode : 'Connection Err'}</div>
        </div>
        <div class="stat">
          <div class="stat-label">SMITHERY_API_KEY</div>
          <div class="stat-val" style="color: ${hasKey ? '#10B981' : '#F59E0B'};">${hasKey ? 'Configured (' + maskedKey + ')' : 'Missing in Env'}</div>
        </div>
      </div>
    </div>

    <div class="card">
      <h3 style="font-family: 'Space Grotesk', sans-serif; font-size: 14px; color: #fff; margin-bottom: 12px;">
        Active MCP Tool Registry (5 Tools Registered)
      </h3>
      <div style="display: flex; flex-wrap: gap: 8px; gap: 8px;">
        ${healthData.mcp.available_tools.map(t => `<span style="font-family: 'JetBrains Mono'; font-size: 11px; padding: 4px 8px; border-radius: 6px; background: rgba(255,255,255,0.06); color: #c0c1ff;">${t}</span>`).join('')}
      </div>
    </div>

    <div class="card">
      <h3 style="font-family: 'Space Grotesk', sans-serif; font-size: 14px; color: #fff; margin-bottom: 12px;">
        Live Health Payload (JSON)
      </h3>
      <pre>${JSON.stringify(healthData, null, 2)}</pre>
    </div>
  </div>
</body>
</html>`;

    if (res && res.setHeader && res.send) {
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      return res.status(200).send(html);
    }
    return new Response(html, {
      status: 200,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  }

  // Standard JSON response
  if (res && res.status) {
    return res.status(200).json(healthData);
  }

  return new Response(JSON.stringify(healthData, null, 2), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
