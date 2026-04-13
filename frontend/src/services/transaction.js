// Simplified browser-safe transaction implementation (to remove protobuf and sawtooth-sdk)
const createTransaction = (keys, signer, payload) => {
    return {
        header: {
            publicKey: keys.publicKey,
            nonce: Math.random().toString(36),
            payload: payload
        },
        signature: signer.sign(payload)
    };
};

const createBatch = (keys, signer, transactions) => {
    return transactions;
};

const encodeBatches = (batches) => {
    return batches;
};

const encodeAllPayloads = (keys, signer, payloads) => {
    if (!Array.isArray(payloads)) payloads = [payloads];
    return payloads.map(p => createTransaction(keys, signer, p));
};

export default {
    createTransaction,
    createBatch,
    encodeBatches,
    encodeAllPayloads,
};
