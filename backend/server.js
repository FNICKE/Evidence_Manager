/**
 * ============================================================
 *  EvidenceManager Backend Server
 *  ============================================================
 *  Mirrors the Solidity EvidenceManager.sol contract interface.
 *  All data is stored in-memory (resets on restart).
 *
 *  Solidity Contract Functions Exposed as REST APIs:
 *    addEvidence(cid, title, evidenceType)  → POST /api/evidences
 *    getEvidences()                         → GET  /api/evidences
 *    getEvidenceCount()                     → GET  /api/evidences/count
 *
 *  Port: 5000
 * ============================================================
 */

const express    = require('express');
const bodyParser = require('body-parser');
const crypto     = require('crypto');

const app  = express();
const PORT = 5000;

// ── Middleware ────────────────────────────────────────────────────
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') return res.sendStatus(204);
    next();
});
app.use(bodyParser.json());

// ── In-Memory Store (mirrors contract state) ──────────────────────
/** @type {{ sender:string, cid:string, title:string, evidenceType:string, timestamp:number, txHash:string }[]} */
const evidences = [];

// ── Helper ────────────────────────────────────────────────────────
const makeTxHash = () => '0x' + crypto.randomBytes(32).toString('hex');
const makeAddress = () => '0x' + crypto.randomBytes(20).toString('hex');
const log = (msg) => console.log(`[${new Date().toISOString()}] ${msg}`);

// ── Routes ────────────────────────────────────────────────────────

/**
 * GET /api/health
 * Server health check.
 */
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        server: 'EvidenceManager Backend',
        contract: 'EvidenceManager.sol (simulated)',
        evidenceCount: evidences.length,
        timestamp: Date.now()
    });
});

/**
 * GET /api/evidences
 * Mirrors: getEvidences() public view returns (Evidence[] memory)
 * Returns all evidences stored in the contract.
 */
app.get('/api/evidences', (req, res) => {
    log(`GET /api/evidences → returning ${evidences.length} records`);
    res.json(evidences);
});

/**
 * GET /api/evidences/count
 * Mirrors: getEvidenceCount() public view returns (uint256)
 */
app.get('/api/evidences/count', (req, res) => {
    res.json({ count: evidences.length });
});

/**
 * POST /api/evidences
 * Mirrors: addEvidence(string _cid, string _title, string _evidenceType) public
 * Body: { cid, title, evidenceType, sender? }
 */
app.post('/api/evidences', (req, res) => {
    const { cid, title, evidenceType, sender } = req.body;

    // Validation — same as Solidity would require
    if (!cid || !title) {
        return res.status(400).json({ error: 'cid and title are required fields' });
    }

    const evidence = {
        sender:       sender || makeAddress(),
        cid:          cid,
        title:        title,
        evidenceType: evidenceType || 'document',
        timestamp:    Math.floor(Date.now() / 1000),   // Unix timestamp (same as block.timestamp)
        txHash:       makeTxHash()
    };

    evidences.push(evidence);
    log(`POST /api/evidences → Added: "${title}" | CID: ${cid} | TX: ${evidence.txHash.slice(0,14)}...`);

    // Emit event info (mirrors: emit EvidenceAdded(msg.sender, _cid, _title))
    res.status(201).json({
        success: true,
        txHash: evidence.txHash,
        event: {
            name: 'EvidenceAdded',
            sender: evidence.sender,
            cid: evidence.cid,
            title: evidence.title
        }
    });
});

/**
 * GET /api/chain
 * Returns all evidences formatted as blockchain blocks
 * (for compatibility with the frontend chain viewer)
 */
app.get('/api/chain', (req, res) => {
    const chain = evidences.map((ev, index) => ({
        index: index + 1,
        timestamp: ev.timestamp * 1000,
        hash: ev.txHash,
        previousHash: index > 0 ? evidences[index - 1].txHash : '0x0000000000000000000000000000000000000000000000000000000000000000',
        transactions: [{
            sender:       ev.sender,
            recipient:    'EvidenceManager Contract',
            evidenceData: {
                cid:       ev.cid,
                title:     ev.title,
                type:      ev.evidenceType,
                timestamp: ev.timestamp * 1000
            }
        }]
    }));

    res.json(chain);
});

// ── 404 ───────────────────────────────────────────────────────────
app.use((req, res) => {
    res.status(404).json({ error: `Route not found: ${req.method} ${req.url}` });
});

// ── Start ─────────────────────────────────────────────────────────
app.listen(PORT, () => {
    console.log('');
    console.log('╔══════════════════════════════════════════════════════╗');
    console.log('║       🔗  Evidence Manager Backend Server            ║');
    console.log(`║       http://localhost:${PORT}                         ║`);
    console.log('║                                                      ║');
    console.log('║  Contract: contracts/EvidenceManager.sol (mirrored)  ║');
    console.log('║                                                      ║');
    console.log('║  API Endpoints:                                      ║');
    console.log('║   GET  /api/health            → Server status        ║');
    console.log('║   GET  /api/evidences         → List all evidences   ║');
    console.log('║   GET  /api/evidences/count   → Evidence count       ║');
    console.log('║   POST /api/evidences         → Add new evidence     ║');
    console.log('║   GET  /api/chain             → Blockchain view      ║');
    console.log('╚══════════════════════════════════════════════════════╝');
    console.log('');
});
