import React, { useState, useMemo, useReducer } from "react";
import createStore from "./store";
import reducers from "./reducer";

function baseReducer(state, action) {
  return {
    ...state,
    ...action.payload,
  };
}

//迷你简易版redux-react实现
const ConnectAdvanced = ({ WrappedComponent, actualChildProps }) => {
  const renderedWrappedComponent = useMemo(
    () => <WrappedComponent {...actualChildProps} />,
    [WrappedComponent, actualChildProps]
  );
  return <>{renderedWrappedComponent}</>;
};

const ConnectFunction = (props) => {
  const { store, mapStateToProps, dispatch, state, component } = props;
  // let [actualProps, setActualProps] = useState(state);
  let [actualProps,dispatchBase] = useReducer(baseReducer,state)
  store.subscribe(function () {
    const storeData = store.getState();
    let state = mapStateToProps(storeData);
    // setActualProps(state);
    dispatchBase({
      type:'save',
      payload:state
    })
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
