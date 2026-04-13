package com.example.blockchain.controller

import com.example.blockchain.model.Block
import com.example.blockchain.model.Transaction
import com.example.blockchain.service.BlockchainService
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/blockchain")
@CrossOrigin(origins = ["*"])
class BlockchainController(private val blockchainService: BlockchainService) {

    @GetMapping("/chain")
    fun getChain(): List<Block> {
        return blockchainService.getChain()
    }

    @PostMapping("/transaction")
    fun addTransaction(@RequestBody transaction: Transaction): String {
        blockchainService.addTransaction(transaction)
        return "Transaction added to pending block"
    }

    @PostMapping("/mine")
    fun mine(@RequestParam minerAddress: String): Block {
        return blockchainService.minePendingTransactions(minerAddress)
    }

    @GetMapping("/is_valid")
    fun isValid(): Boolean {
        return blockchainService.isChainValid()
    }
}
