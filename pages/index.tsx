import type { NextPage } from "next";
import { useState } from "react";
import classNames from "classnames";
import { ethers } from "ethers";
import Head from "next/head";

import Navbar from "../components/NavBar";
import contract from "../utils/contract.json";
import { PacmanLoader } from "react-spinners";

const CONTRACT_ADDRESS = "0x6852860b27007d0194a431291bbaa516fd46d9aa";

const Home: NextPage = () => {
  const [account, setAccount] = useState<string>();
  const [status, setStatus] = useState<string>("idle");
  const mintNFT = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) return;

      setStatus("loading");

      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();

      const squareNFTContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        contract.abi,
        signer
      );

      console.log("Sending Tx");
      const mintTxn = await squareNFTContract.makeAnEpicNFT();

      console.log("Minting...");

      await mintTxn.wait();

      console.log(
        `Mined, see transaction: https://rinkeby.etherscan.io/tx/${mintTxn.hash}`
      );
      setStatus("done");
    } catch (e) {
      console.log(e);
    }
  };

  const buttonText = () => {
    if (!account) return "Connect to Mint";
    if (status === "loading") return "Minting...";
    if (status === "done") return "Mint another one?";
    return "Mint a Square";
  };

  return (
    <div className="bg-black h-full min-h-screen flex flex-col">
      <Head>
        <title>SquareNFT</title>
      </Head>
      <Navbar account={account} setAccount={setAccount} />
      <div className="max-w-6xl mx-auto text-center h-full flex flex-col justify-center">
        <div className="mt-36">
          <h1 className="text-white text-6xl">
            Square<span className="text-orange-400">NFT</span>
          </h1>
        </div>
        <div className="mt-12">
          <button
            onClick={mintNFT}
            className={classNames(
              "border p-3 rounded-md border-black",
              account ? "bg-orange-300" : "bg-neutral-400"
            )}
          >
            {buttonText()}
          </button>
        </div>
        {status === "loading" && (
          <div className="mt-8 mr-8">
            <PacmanLoader color="#F5A623" />
          </div>
        )}
        {status === "done" && (
          <div className="mt-10">
            <h3 className="text-white">
              Check out your new NFT in our{" "}
              <a
                href="https://testnets.opensea.io/collection/squarenft-atdjeg6blo"
                className="underline"
              >
                collection page
              </a>
            </h3>
          </div>
        )}
      </div>
      <div className="flex justify-end items-end fixed bottom-6 right-10">
        <p className="text-white text-xs font-mono">
          Square NFT is currently powered by the Rinkeby testnet
        </p>
      </div>
    </div>
  );
};

export default Home;
