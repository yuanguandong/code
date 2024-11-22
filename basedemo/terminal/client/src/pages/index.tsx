import { useEffect, useLayoutEffect, useRef } from "react";
import { Terminal } from "xterm";
import { AttachAddon } from "xterm-addon-attach";
import { FitAddon } from "xterm-addon-fit";
import { SearchAddon } from "xterm-addon-search";
import { WebLinksAddon } from "xterm-addon-web-links";
import { AdventureTime } from "xterm-theme";
import { useSize, useWebSocket } from "ahooks";
import "xterm/css/xterm.css";
import "./index.less";

const socketURL = "ws://127.0.0.1:4000/socket";
const height = 500;
const fontSize = 12;

export default function HomePage() {
  const termRef = useRef<any>(null);
  const containerRef = useRef<any>(null);
  const insDomRef = useRef<any>(null);
  // 监听容器尺寸，用于做自适应
  const size = useSize(containerRef);

  // 直接使用封装好的useWebSocket
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

    // 创建终端实例
    var term = new Terminal({
      fontFamily: 'Menlo, Monaco, "Courier New", monospace',
      fontWeight: 400,
      fontSize,
      theme: AdventureTime,
      rows: Math.floor(height / (fontSize + 2)),
    });

    // 添加终端插件
    // An addon for xterm.js that enables attaching to a web socket
    const attachAddon = new AttachAddon(webSocketIns as WebSocket);
    // 自适应容器插件
    const fitAddon = new FitAddon();
    // 搜索插件
    const searchAddon = new SearchAddon();
    // 超链接显示插件
    const webLinksAddon = new WebLinksAddon();

    term.loadAddon(attachAddon);
    term.loadAddon(fitAddon);
    term.loadAddon(searchAddon);
    term.loadAddon(webLinksAddon);

    // 把示例挂载给ref
    termRef.current = {
      term,
      searchAddon,
      fitAddon,
    };

    // render 终端到容器
    term.open(insDomRef.current);
    // 适用容器（发现只能适应宽度）
    fitAddon.fit();

    return () => {
      //组件卸载，清除 Terminal 实例
      term.dispose();
      termRef.current = null;
    };
  }, [webSocketIns]);

  // 响应容器尺寸副作用
  useLayoutEffect(() => {
    if (!size) {
      return;
    }
    // 想做响应式高度、不过这个方法调用报错说rows只能在构造函数里指定，暂时没想到好的办法处理
    // termRef.current.term.setOption(
    //   "rows",
    //   Math.floor(size.height / (fontSize + 2))
    // );
    termRef.current?.fitAddon?.fit();
  }, [size]);

  return (
    <>
      <input
        type="text"
        placeholder="查询关键字"
        onChange={(e) => termRef.current.searchAddon?.findNext(e.target.value)}
        style={{ marginBottom: 10 }}
      />
      <div style={{ height, width: "100%" }} ref={containerRef}>
        <div
          style={{
            background: "#1F1D45",
            borderRadius: 10,
            overflow: "hidden",
            padding: 10,
          }}
          ref={insDomRef}
        />
      </div>
    </>
  );
}
