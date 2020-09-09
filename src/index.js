import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
// import App from './App';
// import * as serviceWorker from './serviceWorker';

//to consider: 
//  multiple lines can run between two nodes
// everything rerenders when drawing lines

//add responsiveness


const r=19;
const er=4*r;
const dt=0.01;
// const dt=0.0008;
//add to state, change on resize
let mx=window.innerWidth/2;
let my=window.innerHeight/2;

function DrawLine(props){
  if(props.isDrawing){
    return <line  u={props.u} onClick={props.onClick} className="svg-line" x1={`${props.x1}`} y1={`${props.y1}`} x2={`${props.x2}`} y2={`${props.y2}`}/>
  }
  else return null;
}

function NodeGroup(props){
  // console.log('nodeGroup');
  return(
    <g className="svg-group" id={props.id} onClick={props.onClick} onDoubleClick={props.onDoubleClick} onMouseDown={props.onMouseDown} onMouseUp={props.onMouseUp}> 
    <circle id={props.id} cx={`${props.x}`} cy={`${props.y}`} r={`${r}`} className="svg-circle" />
    <text id={props.id} x={`${props.x}`} y={`${props.y}`} dy=".3em" className="svg-text">{props.id}</text>
  </g>
  );
}

class Board extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      node_list: [],
      nodenum: 0,
      isDrawing : false,
      isMouseDown : false,
      id1: null,
      moveid : null,
      moved_on_mouseDown: false,
      // x1 : null,
      // y1 : null,
      id2: null,
      x2 : null,
      y2 : null,
      intervalID: null,
      timer: 0,
    };

    this.handleBoardClick = this.handleBoardClick.bind(this);
    this.handleGroupClick = this.handleGroupClick.bind(this);
    this.handleGroupDblClick = this.handleGroupDblClick.bind(this);
    this.draw = this.draw.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.move = this.move.bind(this);
    this.manageCollisions=this.manageCollisions.bind(this);
  }


  componentDidMount(){
    const intervalID=setInterval(this.manageCollisions, 20);
    this.setState({intervalID: intervalID});
  }
  componentWillUnmount(){
    clearInterval(this.state.intervalID);
  }
  manageCollisions(){
    console.log('manageCollisions')

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
          console.log(u,' collides w ', v);
          this.resolveCollision(u, v, nodelist);
        }

      }
    }
    this.setState({
      node_list: nodelist,
      // timer: this.state.timer+0.005,
    });
  }
  centerPull(u,nodelist){
    if(this.state.isMouseDown && this.state.moveid == u) return;
    const dx = nodelist[u].x-mx;
    const dy = nodelist[u].y-my;
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
      if(moveid == u){
        nodelist[u].x-=nx*s/2;
        nodelist[u].y-=ny*s/2;
        nodelist[v].x-=nx*s/2;
        nodelist[v].y-=ny*s/2;
      }
      if(moveid == v){
        nodelist[v].x+=nx*s/2;
        nodelist[v].y+=ny*s/2;
        nodelist[u].x+=nx*s/2;
        nodelist[u].y+=ny*s/2;
      }
    }
  }
//resolve with push

  handleBoardClick(e){
    // console.log('Board clicked; isDrawing:',this.state.isDrawing);
    console.log('clicked at: ',e.clientX,', ',e.clientY);
    if(this.state.isDrawing){
      this.setState({ isDrawing: this.state.isDrawing^1 });
      return;
    }
    const x=e.clientX;
    const y=e.clientY;
    const newnode=createNode(x,y,this.state.nodenum);
    const newlist=this.state.node_list.slice();
    newlist.push(newnode);
    this.setState({
      node_list: newlist,
      nodenum: this.state.nodenum+1,
      // timer: 0,
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
    // console.log()
    if(this.state.isDrawing)
      this.draw(e.clientX,e.clientY);
    if(this.state.isMouseDown)
      this.move(this.state.moveid, e.clientX, e.clientY);
  }

  handleGroupClick(e){
    e.stopPropagation();
    // console.log('node clicked');
    // console.log('event.target: ',e.target, 'id: ',e.target.id);
    const isDrawing=this.state.isDrawing;
    const id1=this.state.id1;
    const id2=e.target.id;
    //not sure how to perform this change
    // let newAdj=this.state.adj.slice();
    if(isDrawing && id1^id2){
      // console.log(this.state.node_list[this.state.id1].adj)
      // console.log(this.state.node_list[id2].adj)
      this.state.node_list[this.state.id1].adj.push(id2);
      this.state.node_list[id2].adj.push(this.state.id1);
    }
    console.log('e.target: ',e.target,' e.target.id', e.target.id)
    this.setState({
      isDrawing: this.state.moved_on_mouseDown?false:isDrawing^1,
      moved_on_mouseDown : false,
      id1: e.target.id,
      // x1: e.target.x,
      // y1: e.target.y, 
      // id2: e.target,
      x2: e.clientX,
      y2: e.clientY,
      // adj: newAdj, 
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

    // const idu = e.target.id;
    // const newnodelist = this.state.node_list.slice();
    // newnodelist[idu].x=e.clientX;
    // newnodelist[idu].y=e.clientY;
    // this.setState({
    //   node_list: newnodelist,
    // });
  }
  handleMouseUp(){
    this.setState({
      isMouseDown: false,
      timer: 0,
    });
  }
  handleLineClick(e){
    e.stopPropagation();
    console.log('line clicked')
  }
  render(){
    mx=window.innerWidth/2;
    my=window.innerHeight/2;
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
      const {x,y,id} = node;
      return(
        <NodeGroup 
        key={id}
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
<svg version="1.1" baseProfile="full" xmlns="http://www.w3.org/2000/svg" 
  className="board" onClick={this.handleBoardClick} onMouseMove={this.handleMouseMove} onMouseUp={this.handleMouseUp}> 
    <DrawLine isDrawing={this.state.isDrawing} u={this.state.id1} onClick={this.handleLineClick} x1={x1} x2={this.state.x2} y1={y1} y2={this.state.y2}/>
    
    {lines}
    {nodes}
    <circle cx={`${mx}`} cy={`${my}`} r="5" fill="red"/>


    {/* <line x1="50" y1="50" x2="200" y2="50" className="svg-line"/>
     <g>
     <circle cx="50" cy="50" r="19" className="svg-circle"/>
     <text x="50" y="50" dy=".3em" className="svg-text">1</text>
     </g>
     <g>
     <circle cx="200" cy="50" r="19" className="svg-circle"/>
     <text x="200" y="50" dy=".3em" className="svg-text">2</text>
     </g> */}
     
</svg>
    );
    }
 
}
ReactDOM.render(
  <Board />,
  document.getElementById('root')
);

const getdist = (x1, y1, x2, y2) => Math.sqrt(Math.pow(x2-x1,2)+Math.pow(y1-y2,2));

const getkey = (u,v) => u.toString().concat('->',v.toString());

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();

const createNode = (x,y,id) => {
  return {
    x,
    y,
    id,
    // x: x,
    // y: y,
    // id: id,
    // del: 0,
    adj: [],
  };
};

