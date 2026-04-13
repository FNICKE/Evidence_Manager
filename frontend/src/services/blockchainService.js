/**
 * blockchainService.js
 * ─────────────────────────────────────────────────────────────────
 * Connects the React frontend to the backend/server.js REST API,
 * which mirrors the Solidity EvidenceManager.sol contract.
 *
 * Backend API:  http://localhost:5000
 * Contract:     contracts/EvidenceManager.sol
 * ─────────────────────────────────────────────────────────────────
 */

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

// ── Health Check ─────────────────────────────────────────────────
const init = async () => {
    try {
        const res = await fetch(`${BACKEND_URL}/api/health`);
        const data = await res.json();
        console.log("✅ Backend connected:", data.server, "| Evidences:", data.evidenceCount);
        return true;
    } catch (e) {
        console.warn("⚠️ Backend not reachable at", BACKEND_URL, "→ Make sure backend/server.js is running");
        return false;
    }
};

// ── addEvidence() — mirrors Solidity: addEvidence(cid, title, type) ──
const submitEvidence = async (payload) => {
    const res = await fetch(`${BACKEND_URL}/api/evidences`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            cid:          payload.cid,
            title:        payload.name,
            evidenceType: payload.type || "document",
            sender:       payload.sender || null
        })
    });

    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to add evidence");
    }

    const data = await res.json();
    console.log("📦 Evidence submitted | TX:", data.txHash);
    return data.txHash;
};

// ── getEvidences() — mirrors Solidity: getEvidences() ─────────────
const getEvidences = async () => {
    const res = await fetch(`${BACKEND_URL}/api/evidences`);
    if (!res.ok) throw new Error("Failed to fetch evidences");
    return res.json();
};

// ── getChain() — returns blockchain-formatted list for UI ──────────
const getChain = async () => {
    try {
        const res = await fetch(`${BACKEND_URL}/api/chain`);
        if (!res.ok) return [];
        return res.json();
    } catch (e) {
        console.error("Error fetching chain:", e);
        return [];
    }
};

export default {
    init,
    submitEvidence,
    getEvidences,
    getChain
};
