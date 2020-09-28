import React,{useState,useEffect} from 'react'
import Lines,{DrawLine} from '../components/Graph/Lines'
import Nodes,{createNode} from '../components/Graph/Nodes.js'
import Jumbotron from 'react-bootstrap/Jumbotron'
import dfs_inorder from '../algorithms/dfs.js'
import Arrow from './arrow.js'
import Player from './Player.js'
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

export default function AnimateDfs({initNodelist}){
    const [nodelist,setNodelist] = useState(initNodelist);
    const [step,setStep] = useState(0);
    const [start,setStart] = useState(0);
    const [cur,setCur] = useState(null)
    const [wait,setWait] = useState(0);
    const [show,setShow] = useState(1);
    const [coords,setCoords] = useState(initCoords);
    const [deg, setDeg] = useState(0);
    const [moving,setMoving] = useState(0);
    const [nextCur,setNextCur] = useState(null);
    const [lClasses, setlClasses] = useState([]) //history of line's classes; array of lines id; on ith step color first i lines green
    const [playing,setPlaying] = useState(1);
    const [curHistory,setCurHistory] = useState([]);
    const [history,setHistory] = useState([]);


    const jumpTo = (to) =>{
      // console.log('jumpTo: ',to,' history.length: ', history.length);
      if(to>history.length || to<0)
        return;
      console.log('jumpTo: ',to);
      console.log('history: ',history);
      console.log('curHistory: ',curHistory);
      setWait(1);
      setCur(curHistory[to]);
      setNodelist(history[to]);
      setStep(to);

      setWait(0)
    }

    // // console.log('animations')
    useEffect( () => {
      // // console.log('selector ',document.querySelector('#e0--1') );
      const nextStep = async () => {
        // console.log('moving: ',moving)
        if(!start || inorder[step][0]==null || wait || moving || !playing) return;
        // console.log('nxtstp')
        // const nxt = step+1;
        // console.log('cur: ',cur,' step: ',step)
        const u = cur;
        const v = inorder[step][0];
        const action = inorder[step][1];
        const str = '#e'+Math.min(u,v).toString().concat('--',Math.max(u,v).toString());
        // console.log(inorder[step][0],' ',inorder[step][1])
        // console.log('str: ',str);
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
          }
          else if(action==1){
            document.querySelector(str).classList.add('greenLine');
            let newlClasses = lClasses.slice()
            newlClasses.push(str);
            setlClasses(newlClasses);
            setWait(1);
            await sleep(animDelay);
            setWait(0);
            // document.querySelector('#e'+str ).classList.remove('greenLine');
            const [x1,y1,x2,y2] = [nodelist[u].x,nodelist[u].y,nodelist[v].x,nodelist[v].y];
            setDeg(calculateRotation(x1,y1,x2,y2));
            setCoords({x1,y1,x2,y2});
            setMoving(1);
          }
          if(Math.abs(inorder[step][1])==1){ //move current
            let newnodelist = nodelist.slice();
            // // console.log('before: ',newnodelist[cur].cClasses)
            newnodelist[cur].cClasses =   newnodelist[cur].cClasses.replace('currentNode','');
            // // console.log('after: ',newnodelist[cur].cClasses)
            setNodelist(newnodelist);
            setCur(inorder[step][0]);
          }
          setStep( (step) => step+1 );
      }
      const interval = setInterval(nextStep,stpDelay);
      return () => clearInterval(interval);
    },[inorder,step,start,wait,moving,nodelist,playing,cur])

    useEffect( () => {
      const id = setInterval(move,20);
      return () => clearInterval(id);
    },[moving,coords,deg,nextCur]) //check if placing an object doesnt useeffect on every render


    useEffect( () => { 
      if(cur){
        // console.log('cur: ',cur);
        let newHistory = history.slice();
        let newnodelist = nodelist.slice();
        let newCurHistory = curHistory.slice();

        newCurHistory.push(cur);
        newHistory.push(newnodelist);
        newnodelist[cur].cClasses+=' currentNode visitedNode';
        // if(curHistory.length==step) // can be buggy
          setCurHistory(newCurHistory);
        setHistory(newHistory);
        setNodelist(newnodelist);
      }
    },[cur])

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
        let newnodelist = nodelist.slice();
        const id=e.target.id;
        newnodelist[id].cClasses+=" startNode";
        inorder = dfs_inorder(nodelist, id);
        // console.log('inorder: ',inorder);
        // setCurHistory([id]);
        setCur(id);
        setStep(step => step+1);
        setNodelist(newnodelist);
        setShow(0);
        setStart(1);
      }
    }

    return(
      <>
        <div className="lockcover" />
        <AlgoText show={show}/>
        <svg version="1.1" baseProfile="full" xmlns="http://www.w3.org/2000/svg" 
            className="board animationBoard "> 
        <Lines nodelist={nodelist} />
        <Arrow show={moving} x={coords['x1']} y={coords['y1']} deg={deg}/>
        <Nodes nodelist={nodelist} handleGroupClick={handleGroupClick}/>
        {/* <path transform="translate(200,200)" d="M8.122 24L4 20l8-8-8-8 4.122-4L20 12z" />  */}
          </svg>
          <Player start={start} playing={playing} setPlaying={setPlaying} step={step} jumpTo={jumpTo} />

      </> 
    );
}

function AlgoText({show,text}){
    if(show){
      return (
      <div className="flexcenter">
        <Jumbotron className="jumbostart">
          <h2>
          Choose Start Node
          </h2>
        </Jumbotron>
      </div>
      );
    }
    else
      return null;
  }
  
  function Lockdiv({lock}){
    if(lock)
      return(
        <div className="lockcover" /> 
      );
    else
       return null;
  }