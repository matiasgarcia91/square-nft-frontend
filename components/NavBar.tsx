import { Maybe } from "@metamask/providers/dist/utils";
import { useEffect } from "react";

type NavBarProps = {
  account?: string;
  setAccount: (value: string) => void;
};

const Navbar = (props: NavBarProps) => {
  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) return;
    console.log("We have an etherum object", ethereum);

    const accounts: Maybe<string[]> =
      ethereum.request &&
      (await ethereum.request({
        method: "eth_accounts",
      }));

    if (accounts && !!accounts[0]) {
      const account = accounts[0];
      console.log("Authorized account", account);
      props.setAccount(account);
    } else {
      console.log("No authorized account found");
    }
  };

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) return;

      const accounts: Maybe<string[]> =
        ethereum.request &&
        (await ethereum.request({
          method: "eth_requestAccounts",
        }));

      if (accounts && accounts[0]) {
        props.setAccount(accounts[0]);
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="flex w-full justify-end pt-5">
      {
        <button
          onClick={connectWallet}
          className="mr-6 p-3 text-white border border-white rounded-xl"
          disabled={!!props.account}
        >
          {!!props.account ? "Wallet Connected ⭐" : "Connect Wallet"}
        </button>
      }
    </div>
  );
};

export default Navbar;
