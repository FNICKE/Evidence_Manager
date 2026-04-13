// Simplified browser-safe signing implementation to replace sawtooth-sdk
const KEY_NAME = process.env.REACT_APP_EMS_KEYS || "emsKeys";

// Mock the Secp256k1 for browser use without heavy dependencies
const createKeys = (privateKey = null) => {
    const pk = privateKey || Array.from(window.crypto.getRandomValues(new Uint8Array(32)))
        .map(b => b.toString(16).padStart(2, '0')).join('');
    const pub = 'pub_' + pk.substring(0, 16); // Simulated public key
    return { publicKey: pub, privateKey: pk };
};

const saveKeys = (keys) => localStorage.setItem(KEY_NAME, JSON.stringify(keys));

const checkKeys = () => !!localStorage.getItem(KEY_NAME);

const deleteKeys = () => localStorage.clear();

const getKeys = (privateKey = null) => {
    const storedKeys = localStorage.getItem(KEY_NAME);
    if (!storedKeys) {
        const keys = createKeys(privateKey);
        saveKeys(keys);
        return keys;
    }
    return JSON.parse(storedKeys);
};

// Signer related functions
const createSigner = (keys) => {
    return {
        publicKey: keys.publicKey,
        privateKey: keys.privateKey,
        sign: (data) => "sig_" + Math.random().toString(36).substring(7) // Simple mock signature
    };
};

const sign = (signer, header) => signer.sign(header);

export default {
    verifyKeys: (pk) => pk, // Mock verification
    checkKeys,
    createKeys,
    getKeys,
    saveKeys,
    deleteKeys,
    createSigner,
    sign,
};
