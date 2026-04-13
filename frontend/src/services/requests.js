import axios from "axios";

const URL = process.env.REACT_APP_REST_API_URL || "http://localhost:8080/api/blockchain";

const submitPayloads = (keys, signer, payload) => {
    // Simplified for our custom Kotlin blockchain
    const transaction = {
        sender: keys.publicKey,
        recipient: "Blockchain",
        amount: 0,
        evidenceData: {
            cid: payload.cid,
            title: payload.name,
            type: payload.type,
            timestamp: Date.now()
        }
    };
    return axios.post(`${URL}/transaction`, transaction).then(res => ({
        link: "PENDING" // In our system, it's immediately accepted as pending
    }));
};

const getBatchStatus = (link) => {
    // Simple mock for batch status since we are directly adding to pending
    return Promise.resolve({
        data: [{ status: "COMMITTED" }]
    });
};

const getChain = () => axios.get(`${URL}/chain`).then(res => res.data);

const mine = (minerAddress) => axios.post(`${URL}/mine?minerAddress=${minerAddress}`).then(res => res.data);

export default {
    submitPayloads,
    getBatchStatus,
    getChain,
    mine
};
