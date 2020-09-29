import React, { useEffect, useState } from 'react'
import JumboText from './JumboText'
import bfs_inorder from '../algorithms/bfs'
import {cloneDeep} from 'lodash'
import Player from './Player.js'
import Lines from '../components/Graph/Lines'
import Nodes from '../components/Graph/Nodes.js'
import './animations.css'

let showJumbo=1;
let start=0;
let inorder = [];
const stpDelay=800;
const animDelay=500;

const sleep = (delay) => new Promise((resolve) => setTimeout(resolve,delay))

export default function AnimateBfs({initNodelist,setAnimate,setGraphity}){

    const [nodelist, setNodelist] = useState(initNodelist);
    const [history, setHistory] = useState([]);
    const [wait, setWait] = useState(0);
    const [step, setStep] = useState(-1);
    const [animLine, setAnimLine] = useState(0);
    const [playing, setPlaying] = useState(1);
    const [delay, setDelay] = useState(0);
    useEffect( () => {
        if(start){
          console.log('step: ',step,' history: ',history);
          if(step<0) setStep(0);
          else if(step>=history.length) setStep(history.length-1);
          else setNodelist(history[step]);
        }
      },[step,history,start])
  

    useEffect( () => {
        const nextStep = async () => {
            if(wait || !start || !playing || inorder[step+1][0]==null || delay) return;
    
            if(delay){
                await sleep(1000);
                setDelay(0);
                return;
              }
              console.log('inorder: ',inorder[step+1]);
              const [u,v,action] = inorder[step+1];
              const prev = inorder[step][0];
              let tmpnodelist = cloneDeep(nodelist);
              if(prev != u){
                  tmpnodelist[prev].cClasses = tmpnodelist[prev].cClasses.replace('currentNode','dequeuedNode');
                  tmpnodelist[u].cClasses+=' currentNode';
                  setNodelist(tmpnodelist);
              }

              const str = '#e'+Math.min(u,v).toString().concat('--',Math.max(u,v).toString());
              let newnodelist = cloneDeep(tmpnodelist);
              // console.log('u: ',cur, 'v: ',v,' step: ',step+1)
                if(action==0){
                    document.querySelector(str).classList.add('redLine');
                    setWait(1);
                    await sleep(animDelay);
                    setWait(0);
                    document.querySelector(str ).classList.remove('redLine');
                }
                else if(action==1){
                    newnodelist[Math.min(u,v)].lClasses.set(Math.max(u,v), 'greenLine');
                    setNodelist(newnodelist);

                    setWait(1);
                    console.log('now');
                    await sleep(animDelay);
                    setWait(0);

                    newnodelist[v].cClasses+=' enqueuedNode'
                }

                if(step+1==history.length)
                    setHistory(history.concat([newnodelist]));

                console.log('u: ',u,' v: ',v,' action: ',action);
                setStep( (step) => step+1 );
            }              
    
        const interval = setInterval(nextStep,stpDelay);
        return () => clearInterval(interval);
      },[step,delay,nodelist,wait,history,playing])

    const handleGroupClick = (e) => {
        if(!start){
          console.log('start click');
          let newnodelist = cloneDeep(nodelist);
          const id=e.target.id;
  
          newnodelist[id].cClasses+=" startNode currentNode";
          inorder = bfs_inorder(id,nodelist);
          console.log('inorder: ',inorder);
  
          // setNodelist(newnodelist);
          setHistory(history.concat([newnodelist]));
          showJumbo=0;
          start=1;
        }
      }
    return(
        <>
        <div className="lockcover" />
        <JumboText show={showJumbo} text="Choose Start Node"/>
        <svg version="1.1" baseProfile="full" xmlns="http://www.w3.org/2000/svg" 
            className="board animationBoard "> 
        <Lines nodelist={nodelist} />
        {/* <Arrow show={moving} x={coords['x1']} y={coords['y1']} deg={deg}/> */}
        <Nodes nodelist={nodelist} handleGroupClick={handleGroupClick}/>
        {/* <path transform="translate(200,200)" d="M8.122 24L4 20l8-8-8-8 4.122-4L20 12z" />  */}
          </svg>
          <Player start={start} playing={playing} setPlaying={setPlaying} setStep={setStep} setDelay={setDelay} setAnimate={setAnimate} setGraphity={setGraphity}/>
      </> 
    );
}