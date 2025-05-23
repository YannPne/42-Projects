import { ethers } from "ethers";
import * as dotenv from "dotenv";
import abi from "./abi/Contract.json";
import { promises } from "dns";

dotenv.config();

console.log("PRIVATE_KEY:", process.env.PRIVATE_KEY);
const PRIVATE_KEY = process.env.PRIVATE_KEY!;
const RPC_URL = process.env.RPC_URL!;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS!;

const provider = new ethers.JsonRpcProvider(RPC_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, wallet);

let txQueue: Promise<void> = Promise.resolve();

export  async function addTournamentMatches(
  matchIds: number[],
  matchScores: number[][]
): Promise<void> 
{
  txQueue = txQueue.then(async () => {
    try {
      const tx = await contract.addTournamentMatches(matchIds, matchScores);
      await tx.wait();
      console.log("Matchs added with success !");
    } 
    catch (err)
    {
      console.error("Error when the match is send to the smart contract :", err);
    }
  });

  return txQueue;
}

export async function getTournamentMatches(tournamentId: number) {
  const [matchIds, scores] = await contract.getTournamentMatches(tournamentId);
  console.log("Match IDs:", matchIds.map((id: any) => id.toString()));
  console.log("Scores:", scores.map((score: any[]) => score.map(s => s.toString())));
}

export async function getMatchScores(tournamentId: number, matchId: number) {
  const scores = await contract.getMatchScores(tournamentId, matchId);
  console.log(`Scores of the match ${matchId}:`, scores.map((s: any) => s.toString()));
}

export async function getTotalTournaments(): Promise<number> {
  const total = await contract.getTotalTournaments();
  return Number(total);
}
