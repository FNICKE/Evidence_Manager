package com.example.blockchain.service

import com.example.blockchain.model.Block
import com.example.blockchain.model.Transaction
import org.springframework.stereotype.Service
import java.util.Date

@Service
class BlockchainService {
    private val blockchain: MutableList<Block> = mutableListOf()
    private var pendingTransactions: MutableList<Transaction> = mutableListOf()
    private val difficulty = 4

    init {
        // Create Genesis Block
        val genesisBlock = Block(0, System.currentTimeMillis(), listOf(), "0")
        genesisBlock.mineBlock(difficulty)
        blockchain.add(genesisBlock)
    }

    fun getChain(): List<Block> = blockchain

    fun addTransaction(transaction: Transaction) {
        pendingTransactions.add(transaction)
    }

    fun minePendingTransactions(minerAddress: String): Block {
        val lastBlock = blockchain.last()
        val newBlock = Block(
            index = blockchain.size,
            timestamp = System.currentTimeMillis(),
            transactions = pendingTransactions.toList(),
            previousHash = lastBlock.hash
        )
        newBlock.mineBlock(difficulty)
        
        blockchain.add(newBlock)
        
        // Reset pending transactions and give miner a reward (optional)
        pendingTransactions = mutableListOf()
        
        return newBlock
    }

    fun isChainValid(): Boolean {
        for (i in 1 until blockchain.size) {
            val currentBlock = blockchain[i]
            val previousBlock = blockchain[i - 1]

            if (currentBlock.hash != currentBlock.calculateHash()) {
                return false
            }

            if (currentBlock.previousHash != previousBlock.hash) {
                return false
            }
        }
        return true
    }
}
