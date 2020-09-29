import React,{useState,useEffect} from 'react'
import Lines,{DrawLine} from '../components/Graph/Lines'
import Nodes,{createNode} from '../components/Graph/Nodes.js'
import dfs_inorder from '../algorithms/dfs.js'
import Arrow from './arrow.js'
import Player from './Player.js'
import JumboText from './JumboText';
import {cloneDeep} from 'lodash'
import './animations.css'

let inorder = [];
let startid = 0;
const stpDelay=300;
const animDelay=500;
const initCoords = {
  x1: 0,
  y1: 0,
  x2: 0,
  y2: 0,
}
const eps = 4;
const v = 8;
const sleep = (delay) => new Promise((resolve) => setTimeout(resolve,delay))

const calculateRotation = (x1,y1,x2,y2) => {
  const dx = x2-x1;
  const dy = y2-y1;
  const d = Math.sqrt(Math.pow(dx,2)+Math.pow(dy,2));
  const sin = dy/d;
  // // console.log('sin: ',sin);
  let a = Math.asin(sin)*57.3248407643;
  // // console.log('asin: ',a);
  if(dx<0){
    if(dy>=0) a=180-a;
    else a=-180-a;
  }
  // // console.log('deg: ',a);
  return a;
}

const dist = (x1,y1,x2,y2) => Math.sqrt(Math.pow(x1-x2,2)+Math.pow(y1-y2,2));

export default function AnimateDfs({initNodelist, setAnimate, setGraphity}){
    const [nodelist,setNodelist] = useState(initNodelist);
    const [step,setStep] = useState(() => -1);
    const [start,setStart] = useState(0);
    // const [cur,setCur] = useState(null)
    const [wait,setWait] = useState(0);
    const [delay,setDelay] = useState(0);
    const [show,setShow] = useState(1);
    const [coords,setCoords] = useState(initCoords);
    const [deg, setDeg] = useState(0);
    const [moving,setMoving] = useState(0);
    // const [nextCur,setNextCur] = useState(null);
    // const [lClasses, setlClasses] = useState([]) //history of line's classes; array of lines id; on ith step color first i lines green
    const [playing,setPlaying] = useState(1);
    const [history,setHistory] = useState([]);

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
        if(!start || inorder[step+1][1]==null || wait || moving || !playing) return;

        if(delay){
          await sleep(1000);
          setDelay(0);
          return;
        }

        const [u,v,action] = inorder[step+1];

        const str = '#e'+Math.min(u,v).toString().concat('--',Math.max(u,v).toString());

        // console.log('u: ',cur, 'v: ',v,' step: ',step+1)
        
          if(action==-1){
            const [x1,y1,x2,y2] = [nodelist[u].x,nodelist[u].y,nodelist[v].x,nodelist[v].y];
            setDeg(calculateRotation(x1,y1,x2,y2)+180);
            setCoords({x1,y1,x2,y2});
            setMoving(1);
          }
          else if(action==0){
            document.querySelector(str).classList.add('redLine');
            setWait(1);
            await sleep(animDelay);
            setWait(0);
            document.querySelector(str ).classList.remove('redLine');

            if(step+1==history.length)
              setHistory(history.concat([nodelist]));
          }
          else if(action==1){
            // if(step+1>=history.length){
              let newnodelist = cloneDeep(nodelist);
              newnodelist[Math.min(u,v)].lClasses.set(Math.max(u,v), 'greenLine');
              // setHistory(history.concat(newnodelist));
              setNodelist(newnodelist);
            // }

            setWait(1);
            await sleep(animDelay);
            setWait(0);

            // document.querySelector('#e'+str ).classList.remove('greenLine');
            const [x1,y1,x2,y2] = [nodelist[u].x,nodelist[u].y,nodelist[v].x,nodelist[v].y];
            setDeg(calculateRotation(x1,y1,x2,y2));
            setCoords({x1,y1,x2,y2});
            setMoving(1);
          }
          if(Math.abs(action)){ //move current
            let newnodelist = cloneDeep(nodelist);

            newnodelist[u].cClasses = newnodelist[u].cClasses.replace('currentNode','visitedNode');
            newnodelist[v].cClasses+=' currentNode';
            newnodelist[Math.min(u,v)].lClasses.set(Math.max(u,v), 'greenLine');
            if(step+1==history.length)
              setHistory(history.concat([newnodelist]));
          }

          // await sleep(500);
          console.log('u: ',u,' v: ',v,' action: ',action);
          setStep( (step) => step+1 );
      }
      const interval = setInterval(nextStep,stpDelay);
      return () => clearInterval(interval);
    },[step,start,wait,moving,nodelist,playing,delay])

    useEffect( () => {
      const id = setInterval(move,20);
      return () => clearInterval(id);
    },[moving,coords,deg]) //check if placing an object doesnt useeffect on every render

    const move = () => {
      if(!moving) return;
      let {x1,y1,x2,y2} = coords;
      const d = dist(x1,y1,x2,y2);
      if(d<eps){
        setMoving(0);

      }
      const dx = x2-x1, dy = y2-y1;
      const nx=dx/d, ny=dy/d;

      x1+=nx*v;
      y1+=ny*v;
      setCoords({x1: x1, y1: y1,x2: x2, y2: y2,});
    }

    const handleGroupClick = (e) => {
      if(!start){
        console.log('start click');
        let newnodelist = cloneDeep(nodelist);
        const id=e.target.id;

        newnodelist[id].cClasses+=" startNode currentNode";
        inorder = dfs_inorder(nodelist, id);

        // setNodelist(newnodelist);
        setHistory(history.concat([newnodelist]));
        setShow(0);
        setStart(1);
      }
    }

    return(
      <>
        <div className="lockcover" />
        <JumboText show={show} text="Choose Start Node"/>
        <svg version="1.1" baseProfile="full" xmlns="http://www.w3.org/2000/svg" 
            className="board animationBoard "> 
        <Lines nodelist={nodelist} />
        <Arrow show={moving} x={coords['x1']} y={coords['y1']} deg={deg}/>
        <Nodes nodelist={nodelist} handleGroupClick={handleGroupClick}/>
        {/* <path transform="translate(200,200)" d="M8.122 24L4 20l8-8-8-8 4.122-4L20 12z" />  */}
          </svg>
          <Player start={start} playing={playing} setPlaying={setPlaying} setStep={setStep} setDelay={setDelay} setAnimate={setAnimate} setGraphity={setGraphity}/>
      </> 
    );
}

