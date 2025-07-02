import {
  Commitment,
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
} from "@solana/web3.js";
import wallet from "../turbin3-wallet.json";
import {
  getAssociatedTokenAddress,
  getOrCreateAssociatedTokenAccount,
  tokenMetadataInitialize,
  transfer,
} from "@solana/spl-token";
import dotenv from "dotenv";
dotenv.config();
const RPC_URL = process.env.RPC_URL;
if (!RPC_URL) {
  throw new Error("");
}
// We're going to import our keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

//Create a Solana devnet connection
const commitment: Commitment = "confirmed";
const connection = new Connection(RPC_URL, commitment);

// Mint address
const mint = new PublicKey("FunqQXZvXfA1KoNFjaazzaKu9bz8W4h38sYkLNEZEfUR");

// Recipient address
const recipient = new PublicKey("3CPvFJ3RDJH9RjpzY3WYxn1vcrL7J63hZQc9YboMaCg9");

(async () => {
  try {
    // Get the token account of the fromWallet address, and if it does not exist, create it
    let from = await getAssociatedTokenAddress(mint, keypair.publicKey);
    // Get the token account of the toWallet address, and if it does not exist, create it
    let to = await getOrCreateAssociatedTokenAccount(
      connection,
      keypair,
      mint,
      recipient
    );
    // Transfer the new token to the "toTokenAccount" we just created
    let tx = await transfer(
      connection,
      keypair,
      from,
      to.address,
      keypair,
      1n * 1_000_000n
    );
    console.log("Here is the transaction :- ", tx);
  } catch (e) {
    console.error(`Oops, something went wrong: ${e}`);
  }
})();
