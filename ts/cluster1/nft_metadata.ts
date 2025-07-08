import wallet from "../turbin3-wallet.json";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  createGenericFile,
  createSignerFromKeypair,
  signerIdentity,
} from "@metaplex-foundation/umi";
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys";
import dotenv from "dotenv";

dotenv.config();
const RPC_URL = process.env.RPC_URL;
if (!RPC_URL) {
  throw new Error("");
}
// Create a devnet connection
const umi = createUmi(RPC_URL);
let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);

umi.use(irysUploader({ address: "https://devnet.irys.xyz/" }));
umi.use(signerIdentity(signer));

(async () => {
  try {
    // Follow this JSON structure
    // https://docs.metaplex.com/programs/token-metadata/changelog/v1.0#json-structure
    const image = "";
    const metadata = {
      name: "NFT",
      symbol: "TT",
      description: "It is just a regular nft",
      image,
      attributes: [{ trait_type: "general", value: "regular" }],
      properties: {
        files: [
          {
            type: "image/png",
            uri: "https://gateway.irys.xyz/DC2UdZ2SGDGjtrGwYd9xaWbWzW8vxhGqSMKvJpn4XVEx",
          },
        ],
      },
      creators: [],
    };
    const myUri = await umi.uploader.uploadJson(metadata);

    console.log("Your metadata URI: ", myUri); // https://gateway.irys.xyz/DEqFSibPDM55CdQiuLABAUHyrqgJAJYwtLW7pLq98QKN
  } catch (error) {
    console.log("Oops.. Something went wrong", error);
  }
})();
