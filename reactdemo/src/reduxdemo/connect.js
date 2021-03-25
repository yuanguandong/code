import React, { useState, useMemo } from "react";
import createStore from "./store";
import reducers from "./reducer";
//迷你版redux-react实现
const ConnectAdvanced = ({ WrappedComponent, actualChildProps }) => {
  const renderedWrappedComponent = useMemo(
    () => <WrappedComponent {...actualChildProps} />,
    [WrappedComponent, actualChildProps]
  );
  return <>{renderedWrappedComponent}</>;
};

const ConnectFunction = (props) => {
  const { store, mapStateToProps, dispatch, state, component } = props;
  let [actualProps, setActualProps] = useState(state);
  store.subscribe(function () {
    const storeData = store.getState();
    let state = mapStateToProps(storeData);
    setActualProps(state);
  });
  return (
    <ConnectAdvanced
      WrappedComponent={component}
      actualChildProps={{ ...actualProps, dispatch }}
    />
  );
};

const connect = (mapStateToProps) => {
  var store = window.store
    ? window.store
    : (window.store = createStore(reducers));
  const storeData = store.getState();
  let state = mapStateToProps(storeData);
  let dispatch = store.dispatch;
  return (component) => {
    return () => {
      return (
        <ConnectFunction
          component={component}
          store={store}
          mapStateToProps={mapStateToProps}
          dispatch={dispatch}
          state={state}
        />
      );
    };
  };
};

export default connect;
