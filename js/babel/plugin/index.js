mudule.export = () => {
  return {
    visitor: {
      Identifier(path) {
        const _nodeName = path.node.name;
        const _nodeType = path.node.type;
      },
    },
  };
};
