import { useEffect, useRef } from "react";
import { Terminal } from "xterm";
import { AttachAddon } from "xterm-addon-attach";
import { FitAddon } from "xterm-addon-fit";
import { SearchAddon } from "xterm-addon-search";
import { WebLinksAddon } from "xterm-addon-web-links";
//@ts-ignore
import { AdventureTime } from "xterm-theme";
import { useWebSocket } from "ahooks";
import "xterm/css/xterm.css";

const socketURL = "ws://127.0.0.1:4000/socket";
const height = 500;
const fontSize = 12;

export default function HomePage() {
  const seatchRef = useRef<any>();

  const {
    readyState,
    sendMessage,
    latestMessage,
    disconnect,
    connect,
    webSocketIns,
  } = useWebSocket(socketURL);

  useEffect(() => {
    if (!webSocketIns) {
      return;
    }
    var term = new Terminal({
      fontFamily: 'Menlo, Monaco, "Courier New", monospace',
      fontWeight: 400,
      fontSize,
      theme: AdventureTime,
      rows: Math.floor(height / (fontSize + 2)),
    });

    const attachAddon = new AttachAddon(webSocketIns as WebSocket);
    const fitAddon = new FitAddon();
    const searchAddon = new SearchAddon();
    const webLinksAddon = new WebLinksAddon();
    if (searchAddon) {
      seatchRef.current = searchAddon;
    }
    //@ts-ignore
    term.open(document.getElementById("terminal"));
    term.loadAddon(fitAddon);
    term.loadAddon(attachAddon);
    term.loadAddon(searchAddon);
    term.loadAddon(webLinksAddon);
    term.focus();
    fitAddon.fit();

    // term.onData((val) => {
    //   console.log(val);
    //   term.write(val);
    // });

    return () => {
      //组件卸载，清除 Terminal 实例
      term.dispose();
    };
  }, [webSocketIns]);

  return (
    <div style={{ height: 500, width: 800 }}>
      <input
        type="text"
        onChange={(e) => seatchRef.current?.findNext(e.target.value)}
      />
      <div id="terminal"></div>
    </div>
  );
}
