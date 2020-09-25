import React,{useState, useEffect, useRef} from 'react';
import './Board.css';
import RenderAdjList from '../../HelperFunctions/RenderAdjList';
import Lines,{DrawLine} from '../Graph/Lines'
import Nodes,{createNode} from '../Graph/Nodes.js'
import Tools from '../Tools/Tools.js'
import Jumbotron from 'react-bootstrap/Jumbotron'
import AnimateDfs from '../../animations/dfs.js'


//to consider: 
// everything rerenders when drawing lines  
//consider setting initials graph boardclick to true
// make new nodes appear closer to corners
const animations = {
  "dfs": AnimateDfs,
}
const r = 19;
const er=4*r;
const dt=0.01;
// let navh=80;

const getnextid = (nodelist) => {
  let nullid=-1;
  for(let i=0;i<nodelist.length;i++){
    if(nodelist[i]==null){
      nullid=i;
      break;
    }
  }
  return nullid===-1?nodelist.length:nullid;
}
//actualizes adjlists node and edge count
const assert_ne = (adjList,nodenum,edgenum) => {
  // if(!nodenum && !edgenum)
  //   return adjList;
  let arr = adjList.split(/[\n]/);
  arr[0]=nodenum.toString()+' '+edgenum.toString();
  return arr.join('\n');
}

const node_add = (adjList,a) => {
  let arr = adjList.split(/[\n]/);
  let [n,e] = arr[0].split(/[ \t]+/);
  n = parseInt(n);
  n+=a;
  arr[0]=n.toString()+' '+e.toString();
  console.log(arr.join('\n'));
  return arr.join('\n');
}
const add_edge = (u,v,adjList) => {
  let arr = adjList.split(/[\n]/);
  let [n,e] = arr[0].split(/[ \t]+/);
  e++;
  arr[0]=n.toString()+' '+e.toString();
  return arr.join('\n')+'\n'+u.toString()+' '+v.toString();
}

const remove_edge = (u,v,adjList) => {
  let arr = adjList.split(/[\n]/);
  let [n,e] = arr[0].split(/[ ]+/);
  // console.log('in: ',adjList);
  for(let i=1;i<=e;i++){
    // console.log('arr: ',arr);
    let pair = arr[i].split(/[ ]+/);
    if(pair[0]==='')
      pair.shift();
    let [s,t] = pair;
    // console.log('s: ',s,' t: ',t);
    if((u==s && v==t) || (u==t && v==s)){
      // console.log('removed',u,'--',v);
      arr.splice(i--,1);
      e--;
    }
  }
  // console.log(arr.join('\n'));
  arr[0]=n.toString()+' '+e.toString();
  // console.log('out: ',arr.join('\n'));
  return arr.join('\n');

}
// const count_edges = (nodelist) => {
//   let e = 0;
//   nodelist.forEach( (node) => {
//     const u = node.id;
//     node.adj.forEach( (v) => {
//       e += v<u;
//     })
//   })
//   return e;
// }  

//undirected graph assumption
const find_edge = (u,v,nodelist) => nodelist[u].adj.indexOf(parseInt(v))!=-1

const lock = () => {
} 
export default function Board({adjList, setAdjList, graphityOn, setGraphity, animate, setAnimate}){ 
  const latestnodelist = useRef([]);

  const [nodelist, setNodelist] = useState([]);
  const [nodenum, setNodenum] = useState(0);
  const [edgenum,setEdgenum] = useState(0);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [moveid, setMoveid] = useState(null);
  const [moved_on_mouseDown,setMoved_on_mouseDown] = useState(false);
  const [id1, setId1] = useState(null);
  const [x2,setx2] = useState(null);
  const [y2,sety2] = useState(null);
  const [mx,setmx] = useState(window.innerWidth/2);
  const [my,setmy] = useState(window.innerHeight/2);
  // const [my,setmy] = useState((window.innerHeight-navh)/2);
  const [click,setClick] = useState('draw');
  const [fixall,setFixall] = useState(0); //add fixall tool to provide a way for fixing lots of elements by fixing all and then unfixing some/unfixing all elements in 2 clicks
  const [lock,setLock] = useState(0);


  // const latestnodelist = useRef(() => RenderAdjList(adjList, [])[0] );
  useEffect( () => {
    if(animate)
      setGraphity(0);
  },[animate])
  useEffect( () => {
    setIsDrawing(0);
    console.log('click: ',click);
  },[click])

  useEffect( () =>  {
    latestnodelist.current=nodelist;
  },[nodelist]);

  // useEffect(console.log('mx: ',mxm' ))
  //add setadjlist to usecallback hook to remove dependency warning
  useEffect( () => {
    const [newnodelist,n,e] = RenderAdjList(adjList, latestnodelist.current.slice())
    setNodelist(() => newnodelist);
    setNodenum(n);
    setEdgenum(e);
    // setNodelist(nodelist => RenderAdjList(adjList, nodelist.slice()));
    // console.log('nodenum: ',nodenum,edgenum)
    setAdjList(assert_ne(adjList,nodenum,edgenum));
    console.log('ref: ',latestnodelist.current)
  },[adjList,nodenum,edgenum])  
  
  useEffect(() => {
    console.log('mx: ',mx,' my: ',my);
    const handleWindowResize = () => {
      console.log('resize');
      console.log('old: ',mx*2,' ',my*2,' new: ',window.innerWidth,' ',window.innerHeight);
      // navh=document.getElementById('navbar-container').clientHeight;
      const newnodelist = latestnodelist.current.map( (node) => {
        if(node==null) return node;
        // const [mx,my] = [mx,my];
        console.log(node.x/(mx*2),' ',node.y/(my*2));
        [node.x,node.y] = [node.x/(mx*2)*window.innerWidth,node.y/(my*2)*(window.innerHeight)];
        // [node.x,node.y] = [node.x/(mx*2)*window.innerWidth,node.y/(my*2)*(window.innerHeight-navh)];
        return node;
      });
      // console.log(navh);
      setNodelist(newnodelist);
      setmx(window.innerWidth/2);
      setmy(window.innerHeight/2);
      // setmy((window.innerHeight-navh)/2);
    }
    window.addEventListener('resize', handleWindowResize);
    // navh=document.getElementById('navbar-container').clientHeight;
    return () => window.removeEventListener('resize', handleWindowResize);
  },[mx,my])  

  useEffect( () => {
    const manageCollisions = () => {
      // console.log('interval: ', nodelist);
      // console.log('managecollisions',graphityOn)
      let newnodelist=latestnodelist.current.slice();
      // console.log('nodenum: ',nodenum);
      // console.log(nodelist[0].x);
      if(latestnodelist.current[1])
        // console.log('nodelist change: ',latestnodelist.current[1].x);
  
      if(graphityOn){
          for(let i=0;i<newnodelist.length;i++){
            if(newnodelist[i]===null || newnodelist[i].fixed || (isMouseDown && moveid==i)) continue;
            // if(isMouseDown && moveid==i) continue;
            centerPull(i,newnodelist);
          }
          for(let u=0;u<newnodelist.length;u++){
            if(newnodelist[u]==null || newnodelist[u].fixed) continue;
            for(let v=u+1;v<newnodelist.length;v++){
      
              if(newnodelist[v]==null || newnodelist[v].fixed) continue;
              if(detectCollision(u,v,newnodelist)){
                // console.log(u,' collides w ', v);
                resolveCollision(u, v, newnodelist);
              }
      
            }
          }
        }
      setNodelist(newnodelist); 
    }
    const centerPull = (u,newnodelist) => {
      if((isMouseDown && moveid === u) || nodelist[u]==null) return;
      const dx = newnodelist[u].x-mx;
      const dy = newnodelist[u].y-my;
      // console.log("x: ",nodelist[u].x);
      const d = Math.sqrt(Math.pow(dx,2)+Math.pow(dy,2));
      // console.log("node: ",u," d: ",d);
      
      const nx=dx/d;
      const ny=dy/d;
      
      newnodelist[u].x-=nx*d*dt;
      newnodelist[u].y-=ny*d*dt;
    }
  
    //take data from arguments rather than state?
    const detectCollision = (u,v, newnodelist) => {
      let dx = newnodelist[u].x-newnodelist[v].x;
      let dy = newnodelist[u].y-newnodelist[v].y;
      let d = Math.sqrt(Math.pow(dx,2)+Math.pow(dy,2));
      if(d<2*er)
        return true
      return false
    }
  
    const resolveCollision = (u,v,newnodelist) => {
      // console.log('resolve: ',u,' w ',v);
      let dx = newnodelist[u].x-newnodelist[v].x;
      let dy = newnodelist[u].y-newnodelist[v].y;
      let d = Math.sqrt(Math.pow(dx,2)+Math.pow(dy,2));
  
      let nx=dx/d;
      let ny=dy/d;
  
      const s=2*er-d;
  
      newnodelist[u].x+=nx*s/2;
      newnodelist[u].y+=ny*s/2;
      newnodelist[v].x-=nx*s/2;
      newnodelist[v].y-=ny*s/2;
      if(isMouseDown){
        if(moveid == u){
          newnodelist[u].x-=nx*s/2;
          newnodelist[u].y-=ny*s/2;
          newnodelist[v].x-=nx*s/2;
          newnodelist[v].y-=ny*s/2;
        }
        if(moveid == v){
          newnodelist[v].x+=nx*s/2;
          newnodelist[v].y+=ny*s/2;
          newnodelist[u].x+=nx*s/2;
          newnodelist[u].y+=ny*s/2;
        }
      }
    }
  
    const intervalID=setInterval(manageCollisions, 20);
    return () => clearInterval(intervalID);
  },[mx,my,graphityOn,nodenum,moveid,isMouseDown]);

  //check if works
  const clear = () => {
    setAdjList('');
    setNodelist([]);
  }

  const handleFixall = () => {
    if(fixall){
      let newnodelist = nodelist.slice();
      newnodelist.forEach( (node) => {
        if(node)
          node.fixed=0;
      })
    }
    setFixall(fixall^1);
  }

  const handleBoardClick = (e) =>{
    console.log('clicked at: ',e.clientX,', ',e.clientY);
    if(isDrawing){
      setIsDrawing(isDrawing^1);
      return;
    }
    if(click=='delete') return;
    const x=e.clientX;
    const y=e.clientY;
    // const y=e.clientY-navh;
    const nxtId=getnextid(nodelist);
    const newnode=createNode(x,y,nxtId,nxtId,1);
    const newlist=nodelist.slice();
    if(nxtId<newlist.length)
      newlist[nxtId]=newnode;
    else
      newlist.push(newnode);
    
      setNodelist(newlist);
      //is nodenum up to date?
      setAdjList(assert_ne(adjList,nodenum+1,edgenum));
      setNodenum(nodenum => nodenum+1);
  }

  const move = (id, x, y) => {
    let newnodelist=nodelist.slice();
    newnodelist[id].x=x;
    newnodelist[id].y=y;
    setNodelist(newnodelist);
    setMoved_on_mouseDown(true);
  }

  const handleMouseMove = (e) => {
    if(isDrawing){
      setx2(e.clientX);
      sety2(e.clientY)
      // sety2(e.clientY-navh)
    }
    if(isMouseDown && !lock)
      move(moveid, e.clientX, e.clientY);
      // move(moveid, e.clientX, e.clientY-navh);
  }

  const handleLineClick = (e) => {
    e.stopPropagation();
    //because of bug making user click on line instead of board when isDrawing
    if(isDrawing) setIsDrawing(isDrawing^1);
    if(click=='delete'){
      // console.log('line clicked: ',e.target.getAttribute("u"))
      const [u,v] = [e.target.getAttribute("u"),e.target.getAttribute("v")];
      // console.log('u: ',u,' v: ',v);
      const newadjlist = remove_edge(u,v,adjList);
      // console.log('line del adj: ',newadjlist); 
      setAdjList(newadjlist);
    }
  }

  const handleGroupClick = (e) => {
    // console.log('group click nodelist',nodelist);
    e.stopPropagation();
    console.log('group clicked: ',e.clientX,' ',e.clientY)
    // if(lock){
    //   const id = e.target.id;
    //   if(dfs){
    //     document.getElementById(id).children[0].classList.add("startNode");
    //     console.log(document.getElementById(id).children[0].style.stroke);
    //     animateDfs(id);
    //   }

    // }
    if(click=='draw'){
      let id2=e.target.id;
      if(isDrawing && id1^id2 && !find_edge(id1,id2,nodelist)){
        console.log('find edge ',id1,'--',id2,' ',find_edge(id1,id2,nodelist));
        setAdjList(assert_ne(add_edge(id1,id2,adjList),nodenum,edgenum+1));
        setEdgenum(edgenum => edgenum+1);
      }
      setIsDrawing(moved_on_mouseDown?false:isDrawing^1);
      setMoved_on_mouseDown(false);
      setId1(e.target.id);
      setx2(e.clientX);
      sety2(e.clientY);
      // sety2(e.clientY-navh);
    }
    else if(click=='fix'){
      let id=e.target.id;
      let newnodelist=nodelist.slice();
      newnodelist[id].fixed^=1;
      setNodelist(newnodelist);
    }
    else if(click=='delete'){
      const idu=parseInt(e.target.id);  
      let newnodelist = nodelist.slice();
      let newAdjList = adjList;
      newAdjList = node_add(newAdjList,-1);
      const u = nodelist[idu];
      let e_del = 0;
      u.adj.forEach(v => {
        e_del++;
        // console.log(v);
        newAdjList = remove_edge(idu,v,newAdjList);
        const id = newnodelist[v].adj.indexOf(idu);
        console.log('id: ',id);
        // console.log('id of ',idu,' is ',id);
        // console.log('edge delete',v,'--',newnodelist[v].adj[id]);
        newnodelist[v].adj.splice(id,1);
      });
      newnodelist[idu]=null;
  
      console.log('before: ',nodenum,' ',edgenum);
      setNodelist(newnodelist);
      console.log('after: ',nodenum,' ',edgenum);
      setAdjList(assert_ne(newAdjList,nodenum-1,edgenum-e_del));
      setEdgenum(edgenum => edgenum - e_del);
      setNodenum(nodenum => nodenum-1); 
    }
  }

  const handleMouseDown = (e) => {
    setIsMouseDown(true);
    setMoveid(e.target.id);
    setMoved_on_mouseDown(false);
  }
  const lockBoard = () => {
    setLock(1);
    setGraphity(0);
  }

  //condition may be faulty
  if(animate!=null){
    const CustomTag=animations[animate];
    // console.log('Tagname: ',CustomTag);
    return(
      <>
      <Tools click={click} setClick={setClick} handleFixall={handleFixall} clear={clear}/>
      <CustomTag initNodelist={nodelist}/>
      {/* <Tag/> */}
      </>
      );
  }
  else{
        return(
          <div id="board-div">
            <Tools click={click} setClick={setClick} handleFixall={handleFixall} clear={clear}/>
            <svg version="1.1" baseProfile="full" xmlns="http://www.w3.org/2000/svg" 
            className="board" onClick={handleBoardClick} onMouseMove={handleMouseMove} onMouseUp={() => setIsMouseDown(false)}> 
              <DrawLine isDrawing={isDrawing} onClick={handleLineClick} x1={(id1 && nodelist[id1])?nodelist[id1].x:null} x2={x2} y1={(id1 && nodelist[id1]!=null)?nodelist[id1].y:null} y2={y2}/>
              <Lines nodelist={nodelist} handleLineClick={handleLineClick}/>
              <Nodes nodelist={nodelist} handleGroupClick={handleGroupClick} handleMouseDown={handleMouseDown} handleMouseUp={() => setIsMouseDown(false)} />
              {/* <circle id="999" cx={`${mx}`} cy={`${my}`} r="5" fill="red"/> */}
              {/* <circle id="998" cx="2" cy="2" r="5" fill="red"/> */}
              {/* <circle id="997" cx="100" cy="100" r="5" fill="red"/> */}
      
              {/* <g className="svg-group"> 
            <circle id="100" cx="100" cy="100" r={`${r}`} className="svg-circle" />
            <text id="100" x="100" y="100" dy=".3em" className="svg-text">{nodenum}</text>
          </g> */}
            </svg>
          </div>
       );
  }
}

