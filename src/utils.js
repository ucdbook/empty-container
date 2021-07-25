export const getNextState = (propsArray, nextProps = {}, prevState = {}) => {
  const { myModel, request, setState, history, modalName } = nextProps;
  const nextState = {};
  if (!(propsArray && propsArray.length)) {
    return nextState;
  }
  propsArray.map(item => {
    if (
      item.type === 'children' &&
      item.childrenNodeId &&
      item.childrenNodeId !== prevState.childrenNodeId
    ) {
      nextState.childrenNodeId = item.childrenNodeId;
    } else if (
      (item.type === 'state' || item.type === 'param') &&
      JSON.stringify(myModel[nextProps[item.name]]) !==
        JSON.stringify(prevState[nextProps[item.name + 'Value']])
    ) {
      nextState[nextProps[item.name + 'Value']] = myModel[nextProps[item.name]];
    } else if (
      typeof nextProps[item.name] === 'string' &&
      nextProps[item.name] !== prevState[item.name]
    ) {
      nextState[item.name] = nextProps[item.name];
    }
  });

  return nextState;
};

export const getHtmlProps = (res) => {
  let newRes = {}, key;
  const notHtmlAttributes = ['parentItem', 'levelIndex', 'dispatchEditModel', 'onResize'];
  for(key in res) {
    if(notHtmlAttributes.indexOf(key) < 0) {
      newRes[key] = res[key];
    }
  }
  return newRes;
}
