import React, { useEffect, useState, useRef } from 'react'
import JumboText from './JumboText'
import bfs_inorder from '../algorithms/bfs'
import {cloneDeep} from 'lodash'
import Player from './Player.js'
import Lines from '../components/Graph/Lines'
import Nodes from '../components/Graph/Nodes.js'
import ExpandLine from './ExpandLine'
import ShootLine from './ShootLine'
import './animations.css'

let showJumbo=1;
let started=0;
let inorder = [];
const stpDelay=800;
// const animDelay=500;
const initCoords = {
  x1: 0,
  y1: 0,
  x2: 0,
  y2: 0,
}

const getLineDelay = (animDelay) =>{
        if(animDelay<666) return 700;              
        if(animDelay<1322) return 1000;
        return 1300;
      }

const sleep = (delay) => new Promise((resolve) => setTimeout(resolve,delay))

export default function AnimateBfs({initNodelist,setAnimate,setGraphity}){

    const [nodelist, setNodelist] = useState(initNodelist);
    const [history, setHistory] = useState([]);
    const [wait, setWait] = useState(0);
    const [step, setStep] = useState(() => -1);
    const [playing, setPlaying] = useState(1);
    const [delay, setDelay] = useState(0);
    const [controls, setControls] = useState(0);
    const [animDelay,setAnimDelay] = useState(500);
    const [coords,setCoords] = useState(initCoords);
    const [started,setStarted] = useState(0);

    const [shoot, setShoot] = useState(0);
    const [expand, setExpand] = useState(0);

    const latesthistory = useRef([]);

    useEffect( () => {
      latesthistory.current = history;
    },[history])
    // console.log('started: ',)
    useEffect( () => {
        if(started){
          console.log('step: ',step,' history: ',latesthistory.current);
          if(step<0) setStep(0);
          else if(step>=latesthistory.current.length) setStep(latesthistory.current.length-1);
          else {
            console.log('step: ',step,' inorder: ',inorder[step]);
            const curList = document.getElementsByClassName("currentNode");
            let cur=inorder[step+1][0];
            if(curList.length>0 && cur && curList[0].id!=cur){
              console.log('curList: ',curList[0]);
              curList[0].classList.add('dequeuedNode');
              curList[0].classList.remove('currentNode');
              document.getElementById(cur).children[0].classList.add('currentNode');
              console.log('curList: ',curList[0]);
            }
            setNodelist(latesthistory.current[step]);
          }
          console.log('effect END')
        }
      },[step,started,inorder])
  
      useEffect( () => {
        setCoords({
          x1: nodelist[0].x, 
          y1: nodelist[0].y, 
          x2: nodelist[1].x, 
          y2: nodelist[1].y, 
        });
      },[])


    useEffect( () => {
        const nextStep = async () => {
          // console.log('started: ',started);
            if(wait || !started || !playing || inorder[step+1][0]==null) return;
            
            console.log('animdelay: ',animDelay);

            if(delay){
                await sleep(1000);
                setDelay(0);
                return;
              }
              console.log('inorder: ',inorder[step+1]);
              const [u,v,action] = inorder[step+1];

              const str = '#e'+Math.min(u,v).toString().concat('--',Math.max(u,v).toString());
              // console.log('u: ',cur, 'v: ',v,' step: ',step+1)

              setWait(1);
              await sleep(animDelay);
              setWait(0);


                if(action==0){
                    // document.querySelector(str).classList.add('redLine');
                    // let newnodelist = cloneDeep(nodelist);
                    // newnodelist[Math.min(u,v)].lClasses.set(Math.max(u,v), 'redLine');
                    // setWait(1);
                    // await sleep(animDelay);
                    // setWait(0);
                    // document.querySelector(str ).classList.remove('redLine');

                    let newnodelist=cloneDeep(nodelist);
                    setCoords({
                      x1: nodelist[u].x, 
                      y1: nodelist[u].y, 
                      x2: nodelist[v].x, 
                      y2: nodelist[v].y, 
                    });
                    setExpand(1)
                    setWait(1);
                    await sleep(getLineDelay(animDelay)*1.5-30);
                    setWait(0);

                    // newnodelist[Math.min(u,v)].lClasses.set(Math.max(u,v), 'redLine');
                    // newnodelist[v].cClasses+=' enqueuedNode'
                    setNodelist(newnodelist);
                    setExpand(0);

                    if(step+1==history.length)
                      setHistory(history.concat([newnodelist]));
                }
                else if(action==1){
                  let newnodelist=cloneDeep(nodelist);
                  setCoords({
                    x1: nodelist[u].x, 
                    y1: nodelist[u].y, 
                    x2: nodelist[v].x, 
                    y2: nodelist[v].y, 
                  });
                  setShoot(1)
                  setWait(1);
                  await sleep(getLineDelay(animDelay)-30);
                  // await sleep(getLineDelay(animDelay));
                  setWait(0);
                  newnodelist[Math.min(u,v)].lClasses.set(Math.max(u,v), 'greenLine');
                  newnodelist[v].cClasses+=' enqueuedNode'
                  setNodelist(newnodelist);
                  setShoot(0);
                  if(step+1==history.length)
                    setHistory(history.concat([newnodelist]));
                }

                console.log('u: ',u,' v: ',v,' action: ',action);
                setStep( (step) => step+1 );
            }              
    
        const interval = setInterval(nextStep,animDelay);
        return () => clearInterval(interval);
      },[step,delay,nodelist,wait,history,playing,animDelay])

    const handleGroupClick = (e) => {
        if(!started){
          console.log('started click');
          let newnodelist = cloneDeep(nodelist);
          const id=e.target.id;
  
          newnodelist[id].cClasses+=" startedNode currentNode";
          inorder = bfs_inorder(id,nodelist);
          console.log('inorder: ',inorder);
  
          // setNodelist(newnodelist);
          setHistory(history.concat([newnodelist]));
          showJumbo=0;
          setStarted(1);
        }
      }
    return(
        <>
        <div className="lockcover" />
        <JumboText show={showJumbo} text="Choose started Node"/>
        <svg version="1.1" baseProfile="full" xmlns="http://www.w3.org/2000/svg" 
            className="board animationBoard "> 
        <Lines nodelist={nodelist} />
        <ShootLine show={shoot} setShow={setShoot} animDelay={animDelay} {...coords} />
        <ExpandLine show={expand} setShow={setExpand} animDelay={animDelay} {...coords} />
        {/* <Arrow show={moving} x={coords['x1']} y={coords['y1']} deg={deg}/> */}
        <Nodes nodelist={nodelist} handleGroupClick={handleGroupClick}/>
          </svg>
          <Player started={started} setStarted={setStarted} playing={playing} setPlaying={setPlaying} 
          setStep={setStep} setDelay={setDelay} setAnimate={setAnimate} setGraphity={setGraphity}
          animDelay={animDelay} setAnimDelay={setAnimDelay} />
      </> 
    );
}