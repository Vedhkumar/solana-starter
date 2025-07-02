import { Keypair, PublicKey, Connection, Commitment } from "@solana/web3.js";
import {
  Account,
  getOrCreateAssociatedTokenAccount,
  mintTo,
} from "@solana/spl-token";
import wallet from "../turbin3-wallet.json";
import * as dotenv from "dotenv";
dotenv.config();

const RPC_URL = process.env.RPC_URL;
if (!RPC_URL) {
  throw new Error("NO RPC URL");
}

// Import our keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

//Create a Solana devnet connection
const commitment: Commitment = "confirmed";
const connection = new Connection(RPC_URL, commitment);

const token_decimals = 1_000_000n;

// Mint address
const mint = new PublicKey("FunqQXZvXfA1KoNFjaazzaKu9bz8W4h38sYkLNEZEfUR");

(async () => {
  try {
    // Create an ATA
    const ata: Account = await getOrCreateAssociatedTokenAccount(
      connection,
      keypair,
      mint,
      keypair.publicKey
    );
    console.log(`Your ata is: ${ata.address}`); // HcfpqMeheKbEpmKWKtZPvBz2qjzWBkLMLXLa4SAkNvD5

    // Mint to ATA
    const mintTx = await mintTo(
      connection,
      keypair,
      mint,
      ata.address,
      keypair,
      5n * token_decimals
    );
    console.log(`Your mint txid: ${mintTx}`);
  } catch (error) {
    console.log(`Oops, something went wrong: ${error}`);
  }
})();
