import { Keypair, Connection, Commitment, PublicKey } from "@solana/web3.js";
import { createMint } from "@solana/spl-token";
import wallet from "../turbin3-wallet.json";

// Import our keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

//Create a Solana devnet connection
const commitment: Commitment = "confirmed";
const connection = new Connection("https://api.devnet.solana.com", commitment);

(async () => {
  try {
    // Start here
    const mint: PublicKey = await createMint(
      connection,
      keypair,
      keypair.publicKey,
      keypair.publicKey,
      6
    );
    console.log("Mint Address:- ", mint.toBase58()); // FunqQXZvXfA1KoNFjaazzaKu9bz8W4h38sYkLNEZEfUR
  } catch (error) {
    console.log(`Oops, something went wrong: ${error}`);
  }
})();
