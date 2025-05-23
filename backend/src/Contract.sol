// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

contract TournamentScores {

    address public owner;
    mapping(address => bool) public admins;
    uint256 public totalTournaments;

    struct Match {
        uint256[] scores;
    }

    mapping(uint256 => mapping(uint256 => Match)) private tournaments; // tournamentId => matchId => Match
    mapping(uint256 => uint256[]) private matchIds; // tournamentId => list of matchIds

    modifier onlyAdmin() {
        require(admins[msg.sender], "Not authorized");
        _;
    }

    constructor() {
        owner = msg.sender;
        admins[msg.sender] = true;
    }

    function addAdmin(address _admin) external {
        require(msg.sender == owner, "Only owner can add admins");
        admins[_admin] = true;
    }

    function addTournamentMatches(uint256[] calldata matchIds_, uint256[][] calldata matchScores) external onlyAdmin {
        require(matchIds_.length == matchScores.length, "Match IDs and scores length mismatch");
        uint256 tournamentId = totalTournaments;
        totalTournaments++;
        
        for (uint256 i = 0; i < matchIds_.length; i++) {
            tournaments[tournamentId][matchIds_[i]].scores = matchScores[i];
            matchIds[tournamentId].push(matchIds_[i]);
        }
    }

    function getTournamentMatches(uint256 tournamentId) external view returns (uint256[] memory, uint256[][] memory) {
        uint256[] memory ids = matchIds[tournamentId];
        uint256[][] memory scoresList = new uint256[][](ids.length);

        for (uint256 i = 0; i < ids.length; i++) {
            scoresList[i] = tournaments[tournamentId][ids[i]].scores;
        }

        return (ids, scoresList);
    }

    function getMatchScores(uint256 tournamentId, uint256 matchId) external view returns (uint256[] memory) {
        return tournaments[tournamentId][matchId].scores;
    }

    function getTotalTournaments() external view returns (uint256)
    {
        return totalTournaments;
    }
}
