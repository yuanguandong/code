import { useEngine } from "@/engine";
import { useKeyPress } from "ahooks";

const useKeyPressEffect = () => {
  const engine = useEngine();

  useKeyPress("delete", () => {
    const activeElementKey = engine.controller.event?.activeObject?.key;
    if (!activeElementKey) {
      return;
    }
    engine.controller.elements?.removeElement(activeElementKey);
  });

  useKeyPress(['meta.s'], (event) => {
    event.preventDefault();
    engine.controller.action?.save();
  });
  
};

export default useKeyPressEffect;
