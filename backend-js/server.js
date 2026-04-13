const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

class Block {
    constructor(index, timestamp, transactions, previousHash, nonce = 0) {
        this.index = index;
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.nonce = nonce;
        this.hash = this.calculateHash();
    }

    calculateHash() {
        return crypto.createHash('sha256').update(
            this.index + this.timestamp + JSON.stringify(this.transactions) + this.previousHash + this.nonce
        ).digest('hex');
    }

    mineBlock(difficulty) {
        while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
            this.nonce++;
            this.hash = this.calculateHash();
        }
        console.log("Block mined: " + this.hash);
    }
}

class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 4;
        this.pendingTransactions = [];
    }

    createGenesisBlock() {
        return new Block(0, Date.now(), [], "0");
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    addTransaction(transaction) {
        this.pendingTransactions.push(transaction);
    }

    minePendingTransactions(minerAddress) {
        let block = new Block(this.chain.length, Date.now(), this.pendingTransactions, this.getLatestBlock().hash);
        block.mineBlock(this.difficulty);

        console.log('Block successfully mined!');
        this.chain.push(block);
        this.pendingTransactions = [];
    }

    isChainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if (currentBlock.hash !== currentBlock.calculateHash()) return false;
            if (currentBlock.previousHash !== previousBlock.hash) return false;
        }
        return true;
    }
}

const evidenceChain = new Blockchain();

app.get('/api/blockchain/chain', (req, res) => {
    res.json(evidenceChain.chain);
});

app.post('/api/blockchain/transaction', (req, res) => {
    evidenceChain.addTransaction(req.body);
    res.send({ status: 'Transaction added to pending pool' });
});

app.post('/api/blockchain/mine', (req, res) => {
    const minerAddress = req.query.minerAddress || 'System';
    evidenceChain.minePendingTransactions(minerAddress);
    res.json(evidenceChain.getLatestBlock());
});

app.get('/api/blockchain/is_valid', (req, res) => {
    res.json({ valid: evidenceChain.isChainValid() });
});

const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Blockchain backend running on http://localhost:${PORT}`);
});
