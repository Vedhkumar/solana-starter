import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  createSignerFromKeypair,
  signerIdentity,
  generateSigner,
  percentAmount,
} from "@metaplex-foundation/umi";
import {
  createNft,
  mplTokenMetadata,
} from "@metaplex-foundation/mpl-token-metadata";

import wallet from "../turbin3-wallet.json";
import base58 from "bs58";
import dotenv from "dotenv";

dotenv.config();
const RPC_URL = process.env.RPC_URL;
if (!RPC_URL) {
  throw new Error("");
}
// Create a devnet connection
const umi = createUmi(RPC_URL);

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const myKeypairSigner = createSignerFromKeypair(umi, keypair);
umi.use(signerIdentity(myKeypairSigner));
umi.use(mplTokenMetadata());

const mint = generateSigner(umi);

(async () => {
  let tx = createNft(umi, {
    mint,
    name: "NFT",
    sellerFeeBasisPoints: percentAmount(5),
    uri: "https://gateway.irys.xyz/DEqFSibPDM55CdQiuLABAUHyrqgJAJYwtLW7pLq98QKN",
  });
  let result = await tx.sendAndConfirm(umi);
  const signature = base58.encode(result.signature);

  console.log(
    `Succesfully Minted! Check out your TX here:\nhttps://explorer.solana.com/tx/${signature}?cluster=devnet`
  );

  console.log("Mint Address: ", mint.publicKey);
})();
