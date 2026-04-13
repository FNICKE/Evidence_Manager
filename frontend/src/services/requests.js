/**
 * requests.js
 * Connects frontend UI actions to blockchainService.js → backend/server.js
 */

import blockchainService from "./blockchainService";

/**
 * submitPayloads — called by CreateEvidence
 * payload is the result of Payload.createEvidencePayload():
 *   { action, timestamp, data: { cid, title, mimeType } }
 */
const submitPayloads = async (keys, signer, payload) => {
    // Handle user registration (CREATE_PERSON) locally since backend only tracks Evidences
    if (payload.action === "CREATE_PERSON") {
        return { link: "user_registered_" + Math.random().toString(36).substring(7) };
    }

    // Unwrap nested payload structure from Payload.createEvidencePayload()
    const evidenceData = payload.data || payload;
    const txHash = await blockchainService.submitEvidence({
        cid:    evidenceData.cid,
        name:   evidenceData.title,
        type:   evidenceData.mimeType || evidenceData.type || "document",
        sender: keys.publicKey
    });
    return { link: txHash };
};

/**
 * getBatchStatus — legacy compatibility shim
 * Returns COMMITTED immediately (no polling needed for direct submission).
 */
const getBatchStatus = () => {
    return Promise.resolve({
        data: [{ status: "COMMITTED" }]
    });
};

/**
 * getChain — fetches all evidences formatted as blockchain blocks
 */
const getChain = () => blockchainService.getChain();

export default {
    submitPayloads,
    getBatchStatus,
    getChain
};
