import React, { useCallback } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
// import App from './App';
// import * as serviceWorker from './serviceWorker';

function DrawLine(props){
  if(props.isDrawing){
    return <line  className="svg-line" x1={`${props.x1}`} y1={`${props.y1}`} x2={`${props.x2}`} y2={`${props.y2}`}/>
  }
  else return null;
}

function NodeGroup(props){
  console.log('nodeGroup');
  return(
    <g onClick={props.onClick}>
    <circle id={props.id} cx={`${props.x}`} cy={`${props.y}`} r="19" className="svg-circle" />
    <text id={props.id} x={`${props.x}`} y={`${props.y}`} dy=".3em" className="svg-text">{props.id}</text>
  </g>
  );
}
//by value or ref?
const extendarr = (arr, nodenum) => {
  while(arr.length<nodenum){
    arr.push([]);
  }
  return arr;
}
class Board extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      node_list: [],
      nodenum: 0,
      isDrawing : false,
      id1: null,
      x1 : null,
      y1 : null,
      id2: null,
      x2 : null,
      y2 : null,
    };

    this.handleBoardClick = this.handleBoardClick.bind(this);
    this.handleGroupClick = this.handleGroupClick.bind(this);
    this.draw = this.draw.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
  }
  handleBoardClick(e){
    console.log('Board clicked; isDrawing:',this.state.isDrawing);
    if(this.state.isDrawing){
      this.setState({ isDrawing: this.state.isDrawing^1 });
      return;
    }
    const x=e.clientX;
    const y=e.clientY;
    const newnode=createNode(x,y,this.state.nodenum);
    this.state.node_list.push(newnode);
    this.setState({
      node_list: this.state.node_list,
      nodenum: this.state.nodenum+1,
    });
    // console.log('clicked at: ',e.clientX, e.clientY);
  }
  draw(x2,y2){
    this.setState({
      x2: x2,
      y2: y2,
      });
  }
  handleMouseMove(e){
    if(!this.state.isDrawing)
      return;
    this.draw(e.clientX,e.clientY);
  }
  handleGroupClick(e){
    e.stopPropagation();
    console.log('node clicked');
    console.log('event.target: ',e.target, 'id: ',e.target.id);
    const isDrawing=this.state.isDrawing;
    const id2=e.target.id;
    //not sure how to perform this change
    // let newAdj=this.state.adj.slice();
    if(isDrawing){
      extendarr(this.state.node_list[this.state.id1].adj);
      extendarr(this.state.node_list[id2].adj);
      console.log(this.state.node_list[this.state.id1].adj)
      console.log(this.state.node_list[id2].adj)
      this.state.node_list[this.state.id1].adj.push(id2);
      this.state.node_list[id2].adj.push(this.state.id1);
    }
    this.setState({
      isDrawing: isDrawing^1,
      id1: e.target.id,
      x1: e.clientX,
      y1: e.clientY, 
      // id2: e.target,
      x2: e.clientX,
      y2: e.clientY,
      // adj: newAdj, 
    });
  }
  convertToArr(s){
    let tmp=s.split('');
    tmp.splice(tmp.length-1,1)
    tmp.splice(0,1);
    tmp=tmp.join('');
    tmp=tmp.split(',');
    return ([tmp[0],tmp[1]]);
  }
  render(){
    // console.log('render; isDrawing: ',this.state.isDrawing);
    return(
<svg version="1.1" baseProfile="full" xmlns="http://www.w3.org/2000/svg" 
  className="board" onClick={this.handleBoardClick} onMouseMove={this.handleMouseMove}>
    <DrawLine isDrawing={this.state.isDrawing} x1={this.state.x1} x2={this.state.x2} y1={this.state.y1} y2={this.state.y2}/>
      
      {this.state.node_list.map((node) =>{
        const {x,y,id,adj} = node;
        return(
          <NodeGroup 
          key={id}
          x={x}
          y={y}
          id={id}
          onClick={this.handleGroupClick}
          />
        );
      })}


    <line x1="50" y1="50" x2="200" y2="50" className="svg-line"/>
     <g>
     <circle cx="50" cy="50" r="19" className="svg-circle"/>
     <text x="50" y="50" dy=".3em" className="svg-text">1</text>
     </g>
     <g>
     <circle cx="200" cy="50" r="19" className="svg-circle"/>
     <text x="200" y="50" dy=".3em" className="svg-text">2</text>
     </g>
     
</svg>
    );
    }
 
}
ReactDOM.render(
  <Board />,
  document.getElementById('root')
);

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
    adj: [[]],
  };
};

