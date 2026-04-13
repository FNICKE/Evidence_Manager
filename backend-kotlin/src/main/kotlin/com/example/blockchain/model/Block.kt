package com.example.blockchain.model

import java.security.MessageDigest
import java.util.Date

data class Transaction(
    val sender: String,
    val recipient: String,
    val amount: Double,
    val evidenceData: Map<String, Any>? = null
)

data class Block(
    val index: Int,
    val timestamp: Long,
    val transactions: List<Transaction>,
    val previousHash: String,
    var nonce: Long = 0,
    var hash: String = ""
) {
    init {
        hash = calculateHash()
    }

    fun calculateHash(): String {
        val input = index.toString() + timestamp.toString() + transactions.toString() + previousHash + nonce.toString()
        val digest = MessageDigest.getInstance("SHA-256")
        val bytes = digest.digest(input.toByteArray())
        return bytes.joinToString("") { "%02x".format(it) }
    }

    fun mineBlock(difficulty: Int) {
        val target = "0".repeat(difficulty)
        while (hash.substring(0, difficulty) != target) {
            nonce++
            hash = calculateHash()
        }
        println("Block Mined!!! : $hash")
    }
}
