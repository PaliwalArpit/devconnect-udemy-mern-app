import './App.css';
import React, { Fragment } from 'react';
import Navbar from './Components/Layout/Navbar';
import Landing from './Components/Layout/Landing';
const  App = () => {
  return (
    <Fragment>
      <Navbar />
      <Landing />
    </Fragment>
  );
}

export default App;
