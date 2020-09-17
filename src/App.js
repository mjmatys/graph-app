import React from 'react';
import './index.css';
import BootstrapNavbar from './components/navbar/BootstrapNavbar.js'
import Board from './components/Board.js'




export default function App(){
    return(
      <>
        <BootstrapNavbar />
      <div className="mycontainer">
        <Board />
      </div>
      </>
  
    );
  }
  
 
