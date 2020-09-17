  import React, {useState} from 'react';
import ReactDOM from 'react-dom';
import '../index.css';
import BootstrapNavbar from './navbar/BootstrapNavbar.js'

//to consider: 
//  multiple lines can run between two nodes
// everything rerenders when drawing lines

//add responsiveness


const r=19;
const er=4*r;
const dt=0.01;
let navh=80;

console.log('vh: ',window.visualViewport.height,'my: ',window.innerHeight);
const petersen = '10 15 \n0 1 \n0 4 \n0 5 \n1 6 \n1 2 \n2 3 \n2 7 \n3 8 \n3 4 \n4 9 \n5 8 \n5 7 \n6 8 \n6 9 \n7 9'

const createNode = (x,y,id,key) => {
  return {
    x,
    y,
    id,
    adj: [],
    key,
  };
};
// const getdist = (x1, y1, x2, y2) => Math.sqrt(Math.pow(x2-x1,2)+Math.pow(y1-y2,2));

const getkey = (u,v) => u.toString().concat('->',v.toString());

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


const createNodelist = (n,nodelist) => {
  let id = 0;
  while(nodelist.length<n){
    const [x,y] = GetRandCords();
    nodelist.push(createNode(x,y,id,id++));
  }
}


const renderGraph = (value) => {
  const arr = value.split(/[\n]+/);
  const [n,e] = arr[0].split(/[ ]+/);
  if(isNaN(n) || isNaN(e)){
    window.alert('input format not accepted')
    return;
  }
  let nodelist = [];
  createNodelist(n, nodelist);
  for(let i=1;i<=e;i++){
    let pair = arr[i].split(/[ ]+/);
    if(pair[0]==='')
      pair.shift();
    const [u,v] = pair;
    if(isNaN(u) || isNaN(v)){
      window.alert('input format not accepted')
      return;
    }
    nodelist[u].adj.push(v);
    nodelist[v].adj.push(u);
  }
  return nodelist;
}

function DrawLine(props){
  if(props.isDrawing){
    return <line  u={props.u} onClick={props.onClick} className="svg-line" x1={`${props.x1}`} y1={`${props.y1}`} x2={`${props.x2}`} y2={`${props.y2}`}/>
  }
  else return null;
}

function NodeGroup(props){
  return(
    <g className="svg-group" id={props.id} onClick={props.onClick} onDoubleClick={props.onDoubleClick} onMouseDown={props.onMouseDown} onMouseUp={props.onMouseUp}> 
    <circle id={props.id} cx={`${props.x}`} cy={`${props.y}`} r={`${r}`} className="svg-circle" />
    <text id={props.id} x={`${props.x}`} y={`${props.y}`} dy=".3em" className="svg-text">{props.id}</text>
  </g>
  );
}

const GetRandCords = () => {
  const [mx,my] = [window.innerWidth,window.innerHeight]
  const x = Math.random()*0.3*mx+0.4*mx;
  const y = Math.random()*0.3*my+0.4*my;
  return [x,y];
}

function GraphRepresentation(props){
  const [value,setValue] = useState('');

  const ToNodelist = (event) => {
    event.preventDefault();
    // const arr = value.split(/[ \n\t]+/);
    console.log(value);
    console.log(petersen);
    const nodelist = renderGraph(value);
    props.setNodelist(nodelist);
  }
  
  return(
    <div className="graph-representation">
    <form onSubmit={ToNodelist} className="mycontainer" style={{textAlign: "center"}}>
    <label style={{height: "93%"}}>
    Adjacency List
    <hr/>
    {/* <input className="graph-data container" type="text" value={value} onChange={(e) => setValue(e.target.value)}/> */}
    <textarea className="graph-textarea" value={value} onChange={(e) => setValue(e.target.value)}/>
    </label>
    <input type="submit" value="visualize" className="datasubmit"/>

    </form>

    </div>
  );

}

export default class Board extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      node_list: [],
      nodenum: 0, //used as node keys
      isDrawing : false,
      isMouseDown : false,
      id1: null,
      moveid : null,
      moved_on_mouseDown: false,
      id2: null,
      x2 : null,
      y2 : null,
      intervalID: null,
      timer: 0,
      mx: window.innerWidth/2,
      my: window.innerHeight/2-80,
    };
    this.handleBoardClick = this.handleBoardClick.bind(this);
    this.handleGroupClick = this.handleGroupClick.bind(this);
    this.handleGroupDblClick = this.handleGroupDblClick.bind(this);
    this.handleLineClick = this.handleLineClick.bind(this);   
    this.draw = this.draw.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.move = this.move.bind(this);
    this.manageCollisions=this.manageCollisions.bind(this);
    this.handleWindowResize = this.handleWindowResize.bind(this);
    this.setNodelist = this.setNodelist.bind(this);
  }


  componentDidMount(){
    navh=document.getElementById('navbar-container').clientHeight;
    console.log('navh',navh)
    const intervalID=setInterval(this.manageCollisions, 20);
    const nodelist = renderGraph(petersen);
    console.log('mx: ',document.getElementById('board-div').offsetWidth,' my: ',document.getElementById('board-div').offsetHeight);
    console.log('mx: ',window.innerWidth,' my: ',window.innerHeight);
    this.setState({
      intervalID: intervalID,
      node_list: nodelist,
      nodenum: nodelist.length,
      // my: document.getElementById('board-div').offsetHeight/2,
      // mx: document.getElementById('board-div').offsetWidth/2,
    });
    window.addEventListener('resize', this.handleWindowResize);
  }
  componentWillUnmount(){
    clearInterval(this.state.intervalID);
  }


  setNodelist(nodelist){
    this.setState({
      node_list: nodelist,
      nodenum: nodelist.length,
    });
  } 

  manageCollisions(){
    let nodelist=this.state.node_list.slice();
    for(let i=0;i<this.state.nodenum;i++){
      if(nodelist[i]==null) continue;
      this.centerPull(i,nodelist);
    }

    for(let u=0;u<this.state.nodenum;u++){
      if(nodelist[u]==null) continue;
      for(let v=u+1;v<this.state.nodenum;v++){

        if(nodelist[v]==null) continue;
        if(this.detectCollision(u,v)){
          // console.log(u,' collides w ', v);
          this.resolveCollision(u, v, nodelist);
        }

      }
    }
    this.setState({
      node_list: nodelist,
    });
  }
  centerPull(u,nodelist){
    if(this.state.isMouseDown && this.state.moveid === u) return;
    const dx = nodelist[u].x-this.state.mx;
    const dy = nodelist[u].y-this.state.my;
    const d = Math.sqrt(Math.pow(dx,2)+Math.pow(dy,2));
    
    const nx=dx/d;
    const ny=dy/d;
    
    nodelist[u].x-=nx*d*dt;
    nodelist[u].y-=ny*d*dt;
    
  }

  //take data from arguments rather than state?
  detectCollision(u,v, ){
    let dx = this.state.node_list[u].x-this.state.node_list[v].x;
    let dy = this.state.node_list[u].y-this.state.node_list[v].y;
    let d = Math.sqrt(Math.pow(dx,2)+Math.pow(dy,2));
    if(d<2*er)
    return true
    return false
  }
  resolveCollision(u,v,nodelist){
    // console.log('resolve: ',u,' w ',v);
    let dx = nodelist[u].x-nodelist[v].x;
    let dy = nodelist[u].y-nodelist[v].y;
    let d = Math.sqrt(Math.pow(dx,2)+Math.pow(dy,2));

    let nx=dx/d;
    let ny=dy/d;

    const s=2*er-d;

    nodelist[u].x+=nx*s/2;
    nodelist[u].y+=ny*s/2;
    nodelist[v].x-=nx*s/2;
    nodelist[v].y-=ny*s/2;
    if(this.state.isMouseDown){
      const moveid=this.state.moveid;
      if(moveid === u){
        nodelist[u].x-=nx*s/2;
        nodelist[u].y-=ny*s/2;
        nodelist[v].x-=nx*s/2;
        nodelist[v].y-=ny*s/2;
      }
      if(moveid === v){
        nodelist[v].x+=nx*s/2;
        nodelist[v].y+=ny*s/2;
        nodelist[u].x+=nx*s/2;
        nodelist[u].y+=ny*s/2;
      }
    }
  }
  handleWindowResize(){
    const newnodelist = this.state.node_list.map( (node) => {
      if(node==null) return node;
      [node.x,node.y] = GetRandCords();
      return node;
    });
    console.log(navh);
    this.setState({
      node_list: newnodelist,
      // mx: document.getElementById('board-div').offsetWidth/2,
      // my: document.getElementById('board-div').offsetHeight/2,

      mx: window.innerWidth/2,
      my: window.innerHeight/2-navh,
    })

  }
  handleBoardClick(e){
    // console.log('Board clicked; isDrawing:',this.state.isDrawing);
    console.log('clicked at: ',e.clientX,', ',e.clientY);
    if(this.state.isDrawing){
      this.setState({ isDrawing: this.state.isDrawing^1 });
      return;
    }
    const x=e.clientX;
    const y=e.clientY-navh;
    const nxtId=getnextid(this.state.node_list);
    const newnode=createNode(x,y,nxtId,this.state.nodenum);
    console.log('next: ',getnextid(this.state.node_list));
    const newlist=this.state.node_list.slice();
    if(nxtId<newlist.length)
      newlist[nxtId]=newnode;
    else
      newlist.push(newnode);
    this.setState({
      node_list: newlist,
      nodenum: this.state.nodenum+1,
    });
  }
  draw(x2,y2){
    this.setState({
      x2: x2,
      y2: y2,
      });
  }
  move(id, x, y){
    let newnodelist=this.state.node_list.slice();
    newnodelist[id].x=x;
    newnodelist[id].y=y;
    this.setState({
      node_list : newnodelist,
      moved_on_mouseDown : true,
    });
  }

  handleMouseMove(e){
    if(this.state.isDrawing)
      this.draw(e.clientX,e.clientY-navh);
    if(this.state.isMouseDown)
      this.move(this.state.moveid, e.clientX, e.clientY-navh);
  }

  handleGroupClick(e){
    e.stopPropagation();
    console.log('group clicked: ',e.clientX,' ',e.clientY)
    // console.log('node clicked');
    const isDrawing=this.state.isDrawing;
    const id1=this.state.id1;
    const id2=e.target.id;
    if(isDrawing && id1^id2){
      this.state.node_list[this.state.id1].adj.push(id2);
      this.state.node_list[id2].adj.push(this.state.id1);
    }
    this.setState({
      isDrawing: this.state.moved_on_mouseDown?false:isDrawing^1,
      moved_on_mouseDown : false,
      id1: e.target.id,
      x2: e.clientX,
      y2: e.clientY-navh,
    });
  }
  handleGroupDblClick(e){
    if(this.state.isDrawing) return;
    // console.log('dblclick');
    const idu=e.target.id;
    const u = this.state.node_list[idu];
    // console.log('u: ',u);
    let newnodelist = this.state.node_list.slice();
    u.adj.forEach(v => {
      if(v==null) return;
      const id = newnodelist[v].adj.indexOf(idu);
      newnodelist[v].adj.splice(id,1);

      // const newadj = newnodelist[v].adj.slice();
      // const id = newadj.indexOf(u);
    });
    newnodelist[idu]=null;
    this.setState({
      node_list: newnodelist,
    });
  }
  handleMouseDown(e){
    this.setState({
      isMouseDown: true,
      moveid : e.target.id,
      moved_on_mouseDown: false,
    });
  }
  handleMouseUp(){
    this.setState({
      isMouseDown: false,
      timer: 0,
    });
  }
  handleLineClick(e){
    e.stopPropagation();
    if(this.state.isDrawing) this.setState(this.setState({isDrawing: this.state.isDrawing^1}))
    console.log('line clicked')
  }
  render(){
    const lines=this.state.node_list.map((node) =>{
      if(node==null)
        return null;
      const {x,y,id,adj} = node;
      const e = adj.map( (v) => {
        if(v>id){
          return <DrawLine  key={getkey(id,v)} u={this.state.id1} onClick={this.handleLineClick} isDrawing="1" x1={x} y1={y} x2={this.state.node_list[v].x} y2={this.state.node_list[v].y} />
        }
        return null;
      });
      return e;
    })

    const nodes=this.state.node_list.map((node) =>{
      if(node==null)
        return null;
      const {x,y,id,key} = node;
      return(
        <NodeGroup 
        key={key}
        x={x}
        y={y}
        id={id}
        onClick={this.handleGroupClick}
        onDoubleClick={this.handleGroupDblClick}
        onMouseDown={this.handleMouseDown}
        onMouseUp={this.handleMouseUp}
        />
      );
    })

    const id1=this.state.id1;
    
    const x1=(id1 && this.state.node_list[id1])?this.state.node_list[id1].x:null;
    const y1=(id1 && this.state.node_list[id1])?this.state.node_list[id1].y:null;
    // console.log('id1: ',id1,' x1: ',x1,' y1: ',y1);

    // console.log('node_list',this.state.node_list);

    return(
      <div id="board-div" className="mycontainer">
        <svg version="1.1" baseProfile="full" xmlns="http://www.w3.org/2000/svg" 
          className="board" onClick={this.handleBoardClick} onMouseMove={this.handleMouseMove} onMouseUp={this.handleMouseUp}> 
            <DrawLine isDrawing={this.state.isDrawing} u={this.state.id1} onClick={this.handleLineClick} x1={x1} x2={this.state.x2} y1={y1} y2={this.state.y2}/>
            {lines}
            {nodes}
            {/* <circle cx={`${this.state.mx}`} cy={`${this.state.my}`} r="5" fill="red"/> */}
        </svg>
        <GraphRepresentation setNodelist={this.setNodelist} />
      </div>
    );
    }
}


// ReactDOM.render(
//   <App />,
//   document.getElementById('root')
// );


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();


