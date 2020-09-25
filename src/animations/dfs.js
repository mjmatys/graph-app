import React,{useState,useEffect} from 'react'
import Lines,{DrawLine} from '../components/Graph/Lines'
import Nodes,{createNode} from '../components/Graph/Nodes.js'
import Jumbotron from 'react-bootstrap/Jumbotron'
import dfs_inorder from '../algorithms/dfs.js'
import './animations.css'

let inorder = [];
const stpDelay=300;
const animDelay=500;

const sleep = (delay) => new Promise((resolve) => setTimeout(resolve,delay))

export default function AnimateDfs({initNodelist}){
    const [nodelist,setNodelist] = useState(initNodelist);
    const [history,setHistory] = useState([]);
    const [step,setStep] = useState(0);
    const [start,setStart] = useState(0);
    const [cur,setCur] = useState(null)
    const [wait,setWait] = useState(0);
    // console.log('animations')
    useEffect( () => {
      // console.log('selector ',document.querySelector('#e0--1') );
      const interval = setInterval(nextStep,stpDelay);
      return () => clearInterval(interval);
    },[inorder,step,start,wait])

    const handleGroupClick = (e) => {
      if(!start){
        let newnodelist = nodelist.slice();
        const id=e.target.id;
        newnodelist[id].cClasses+=" startNode";
        inorder = dfs_inorder(nodelist, id);
        console.log('inorder: ',inorder);
        setCur(id);
        setNodelist(newnodelist);
        setStart(1);
      }
    }

    const nextStep = async () => {
      if(!start || inorder[step][0]==null || wait) return;
      console.log('nxtstp')
      // const nxt = step+1;
      const u = cur;
      const v = inorder[step][0];
        console.log(inorder[step][0],' ',inorder[step][1])
        if(inorder[step][1]==-1){
          const str = Math.min(u,v).toString().concat('--',Math.max(u,v).toString());
          
          console.log( document.querySelector('#e'+str ));
        }
        else if(inorder[step][1]==0){
          const str = Math.min(u,v).toString().concat('--',Math.max(u,v).toString());
          document.querySelector('#e'+str ).classList.add('redLine');
          setWait(1);
          await sleep(animDelay);
          setWait(0);
          document.querySelector('#e'+str ).classList.remove('redLine');
          console.log(document.querySelector('#e'+str));
          
        }
        else if(inorder[step][1]==1){
          const str = Math.min(u,v).toString().concat('--',Math.max(u,v).toString());
          console.log(document.querySelector('#e'+str));
          document.querySelector('#e'+str ).classList.add('greenLine');
          setWait(1);
          await sleep(animDelay);
          setWait(0);
          document.querySelector('#e'+str ).classList.remove('greenLine');
        }
        if(Math.abs(inorder[step][1])==1) //move current
          setCur(inorder[step][0]);
        setStep( (step) => step+1 );
    }
    return(
      <>
        <div className="lockcover" />
        <AlgoText show="1"/>
        <svg version="1.1" baseProfile="full" xmlns="http://www.w3.org/2000/svg" 
            className="board animationBoard "> 
        <Lines nodelist={nodelist} />
        <Nodes nodelist={nodelist} handleGroupClick={handleGroupClick}/>
          </svg>

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