// Simple browser-safe helpers to replace Node dependencies
const FAMILY_NAME = process.env.REACT_APP_FAMILY_NAME || "evidence_management_system";
const FAMILY_VERSION = process.env.REACT_APP_FAMILY_VERSION || "0.0";

const TYPES = {
    EVIDENCE: "EVIDENCE",
    PERSON: "PERSON",
};

const TYPE_PREFIXES = {
    EVIDENCE_PREFIX: "00",
    PERSON_PREFIX: "01",
};

// Encoding Decoding helpers (Browser safe)
const encode = (obj) => new TextEncoder().encode(JSON.stringify(obj));

const decode = (buf) => JSON.parse(new TextDecoder().decode(buf));

const decodeBase64 = (str) => JSON.parse(atob(str));

const hash = (str) => {
    // Very simple string hash for browser compatibility without dependencies
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash |= 0;
    }
    return Math.abs(hash).toString(16);
};

const NAMESPACE = hash(FAMILY_NAME).substring(0, 6);

const getEvidenceAddress = (key) => `${NAMESPACE}00${hash(key)}`;

const getPersonAddress = (key) => `${NAMESPACE}01${hash(key)}`;

const getType = (address) =>
    address.includes("00") ? TYPES.EVIDENCE : TYPES.PERSON;

const getNonce = () => (Math.random() * 10 ** 18).toString(36);

export default {
    FAMILY_NAME,
    FAMILY_VERSION,
    NAMESPACE,
    TYPES,
    TYPE_PREFIXES,
    encode,
    decode,
    decodeBase64,
    hash,
    getEvidenceAddress,
    getPersonAddress,
    getType,
    getNonce,
};
