import {useEffect, useState} from "react"

type Event = "connect" | "disconnect";

interface Phantom {
  connect: () => Promise<void>;
  on: (event: Event, callback: () => void) => void;
  disconnect: () => Promise<void>;
}

const ConnectToPhantom = () => {
  const [phantom, setPhantom] = useState<Phantom | null>(null);
  const [connected, setConnected] = useState(false);

  const connectHandler = () => {
    phantom?.connect();
  };
  const disconnectHandler = () => {
    console.log("disconnect triggered");
    phantom?.disconnect();
  }

  useEffect(() => {
    phantom?.on("connect", () => {
      setConnected(true);
    });

    phantom?.on("disconnect", () => {
      setConnected(false);
    });
  }, [phantom])

  useEffect(() => {
    if (window["solana"]?.isPhantom){
      setPhantom(window["solana"]);
    }
  }, []);

  if(phantom) {
    if(connected) {
      return (
          <button
            onClick={disconnectHandler}
          >
            Disconnect
          </button>
      );
    }
    return (
      <button
        onClick={connectHandler}
      >
        Phantom
      </button>
    );
  }


  

  return (
    <a
      href="https://phantom.app/"
      target="_blank"
    >
      Get Phantom
    </a>
  );
};

export default ConnectToPhantom;


