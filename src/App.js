import React from 'react';
import './index.css';
import BootstrapNavbar from './components/navbar/BootstrapNavbar.js'
import Board from './components/Board.js'




export default function App(){
    return(
      <>
      <div id="navbar-container">
      {/* <div className="navbar-container"> */}
        <BootstrapNavbar />
      </div>
      <div className="mycontainer">
        <Board />
      </div>
      </>
  
    );
  }
  
 
