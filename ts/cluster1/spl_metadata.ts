import wallet from "../turbin3-wallet.json";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  createMetadataAccountV3,
  CreateMetadataAccountV3InstructionAccounts,
  CreateMetadataAccountV3InstructionArgs,
  DataV2Args,
} from "@metaplex-foundation/mpl-token-metadata";
import {
  createSignerFromKeypair,
  signerIdentity,
  publicKey,
} from "@metaplex-foundation/umi";
import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";
import dotenv from "dotenv";
dotenv.config();
const RPC_URL = process.env.RPC_URL;
if (!RPC_URL) {
  throw new Error("");
}
// Define our Mint address
const mint = publicKey("FunqQXZvXfA1KoNFjaazzaKu9bz8W4h38sYkLNEZEfUR");

// Create a UMI connection
const umi = createUmi(RPC_URL);
const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);
umi.use(signerIdentity(createSignerFromKeypair(umi, keypair)));

(async () => {
  try {
    // Start here
    // It is just a struct which is used while creating metadaaccount
    let accounts: CreateMetadataAccountV3InstructionAccounts = {
      mint,
      mintAuthority: signer,
    };

    // It is just a struct which is used while creating metadaaccount
    let data: DataV2Args = {
      collection: null,
      creators: null,
      name: "Parrot",
      symbol: "PP",
      uri: "https://ivory-voluntary-basilisk-499.mypinata.cloud/ipfs/bafkreigiwiojjcnmojrptppcde742cphq3aet7akqw46mred6dfgwwtp2y",
      sellerFeeBasisPoints: 0,
      uses: null,
    };

    // It is just a struct which is used while creating metadaaccount
    let args: CreateMetadataAccountV3InstructionArgs = {
      collectionDetails: null,
      data,
      isMutable: false,
    };

    let tx = createMetadataAccountV3(umi, { ...args, ...accounts });

    let result = await tx.sendAndConfirm(umi);
    console.log(bs58.encode(result.signature));
  } catch (e) {
    console.error(`Oops, something went wrong: ${e}`);
  }
})();
