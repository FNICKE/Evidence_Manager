/**
 * blockchain-sim-server.js
 * Uses only Node.js built-in http module - no npm packages needed.
 */

const http   = require('http');
const crypto = require('crypto');

const PORT = 8545;
const evidences = [];

const sendJSON = (res, status, data) => {
    const body = JSON.stringify(data);
    res.writeHead(status, {
        'Content-Type':                'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods':'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers':'Content-Type'
    });
    res.end(body);
};

const server = http.createServer((req, res) => {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        res.writeHead(204, {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods':'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers':'Content-Type'
        });
        return res.end();
    }

    const url = req.url;

    // GET /api/health
    if (req.method === 'GET' && url === '/api/health') {
        return sendJSON(res, 200, { status: 'ok', evidences: evidences.length });
    }

    // GET /api/evidences
    if (req.method === 'GET' && url === '/api/evidences') {
        return sendJSON(res, 200, evidences);
    }

    // POST /api/evidences
    if (req.method === 'POST' && url === '/api/evidences') {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
            try {
                const { cid, title, evidenceType, sender } = JSON.parse(body);

                if (!cid || !title) {
                    return sendJSON(res, 400, { error: 'cid and title are required' });
                }

                const evidence = {
                    sender:       sender || '0xSimulatedWallet' + crypto.randomBytes(4).toString('hex'),
                    cid,
                    title,
                    evidenceType: evidenceType || 'unknown',
                    timestamp:    Math.floor(Date.now() / 1000),
                    txHash:       '0x' + crypto.randomBytes(32).toString('hex')
                };

                evidences.push(evidence);
                console.log(`[+] Evidence added: "${title}" | cid: ${cid} | tx: ${evidence.txHash.slice(0,12)}...`);
                return sendJSON(res, 201, { txHash: evidence.txHash });

            } catch (e) {
                return sendJSON(res, 400, { error: 'Invalid JSON' });
            }
        });
        return;
    }

    sendJSON(res, 404, { error: 'Not found' });
});

server.listen(PORT, () => {
    console.log('');
    console.log('╔══════════════════════════════════════════════════╗');
    console.log('║  🔗 Blockchain Sim Server (EvidenceManager)      ║');
    console.log(`║  Listening on http://localhost:${PORT}             ║`);
    console.log('║                                                  ║');
    console.log('║  Routes:                                         ║');
    console.log('║   GET  /api/health     → server status           ║');
    console.log('║   GET  /api/evidences  → list all evidences      ║');
    console.log('║   POST /api/evidences  → add new evidence        ║');
    console.log('╚══════════════════════════════════════════════════╝');
    console.log('');
});
