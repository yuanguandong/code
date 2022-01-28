import React from 'react';
import logo from './assets/images/car.jpg';
import Home from './pages/home';
import './global.less';

const App = (props) => {
  const a = ;
  return (
    <>
      <h1 className="title">MY APP</h1>
      <img src={logo} style={{ width: 200 }} />
      <Home />
    </>
  );
};

export default App;
