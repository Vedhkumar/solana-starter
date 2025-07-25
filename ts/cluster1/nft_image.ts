import wallet from "../turbin3-wallet.json";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  createGenericFile,
  createSignerFromKeypair,
  signerIdentity,
} from "@metaplex-foundation/umi";
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys";
import { readFile } from "fs/promises";
import dotenv from "dotenv";

dotenv.config();
const RPC_URL = process.env.RPC_URL;
if (!RPC_URL) {
  throw new Error("");
}
// Create a devnet connection
const umi = createUmi(RPC_URL);
umi.use(irysUploader({ address: "https://devnet.irys.xyz" }));

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);

umi.use(signerIdentity(signer));

(async () => {
  try {
    //1. Load image
    //2. Convert image to generic file.
    //3. Upload image

    const image = await readFile("./generug.png");
    const file = createGenericFile(image, "generug.jpg", {
      contentType: "image/png",
    });
    const [myUri] = await umi.uploader.upload([file]);
    console.log("Your image URI: ", myUri); // https://gateway.irys.xyz/DC2UdZ2SGDGjtrGwYd9xaWbWzW8vxhGqSMKvJpn4XVEx
  } catch (error) {
    console.log("Oops.. Something went wrong", error);
  }
})();
