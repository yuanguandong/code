import { useEngine } from "@/engine";
import { useKeyPress } from "ahooks";

const useKeyPressEffect = () => {
  const engine = useEngine();

  useKeyPress("delete", () => {
    const activeElementKey = engine.sceneController.controller.event?.activeObject?.key;
    if (!activeElementKey) {
      return;
    }
    engine.sceneController.controller.elements?.removeElement(activeElementKey);
  });

  useKeyPress(['meta.s'], (event) => {
    event.preventDefault();
    engine.sceneController.controller.action?.save();
  });
  
};

export default useKeyPressEffect;
