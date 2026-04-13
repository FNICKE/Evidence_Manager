// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract EvidenceManager {
    struct Evidence {
        address sender;
        string cid;
        string title;
        string evidenceType;
        uint256 timestamp;
    }

    Evidence[] public evidences;

    event EvidenceAdded(address indexed sender, string cid, string title);

    function addEvidence(string memory _cid, string memory _title, string memory _evidenceType) public {
        evidences.push(Evidence({
            sender: msg.sender,
            cid: _cid,
            title: _title,
            evidenceType: _evidenceType,
            timestamp: block.timestamp
        }));

        emit EvidenceAdded(msg.sender, _cid, _title);
    }

    function getEvidences() public view returns (Evidence[] memory) {
        return evidences;
    }

    function getEvidenceCount() public view returns (uint256) {
        return evidences.length;
    }
}
