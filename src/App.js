import React, { useState } from 'react';
import './index.css';
import BootstrapNavbar from './components/Navbar/BootstrapNavbar.js'
import Board from './components/Board/Board.js'
import GraphInput from './components/GraphInput/GraphInput';


const petersen = '10 15 \n0 1 \n0 4 \n0 5 \n1 6 \n1 2 \n2 3 \n2 7 \n3 8 \n3 4 \n4 9 \n5 8 \n5 7 \n6 8 \n6 9 \n7 9'
const sqGraph = '4 4\n0 1\n1 2\n2 3\n3 0'
const exGraph = '8 9\n0 1\n0 4\n0 5\n1 6\n1 2\n2 3\n2 7\n3 4\n5 7\n6 7\n5 4'

export default function App() {
  const [adjList, setAdjList] = useState(exGraph);
  const [graphityOn, setGraphity] = useState(true);
  const [animate, setAnimate] = useState(null);
  const [formAdjList, setFormAdjList] = useState(adjList);

  const boardProps = {
    adjList,
    setAdjList,
    graphityOn,
    setGraphity,
    animate,
    setAnimate,
    setFormAdjList,
  }

  const graphInputProps = {
    setAdjList,
    setGraphity,
    formAdjList,
    setFormAdjList,
  }
  return (
    <>
      <BootstrapNavbar setAnimate={setAnimate} setAdjList={setAdjList} setFormAdjList={setFormAdjList} />
      <div className="mycontainer">
        <Board {...boardProps} />
        <GraphInput  {...graphInputProps} />
      </div>
    </>

  );
}


