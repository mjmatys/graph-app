import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
// import App from './App';
import * as serviceWorker from './serviceWorker';

function DrawLine(props){
  if(props.isDrawing){
    return <line  className="svg-line" x1={`${props.x1}`} y1={`${props.y1}`} x2={`${props.x2}`} y2={`${props.y2}`}/>
  }
  else return null;
}

function NodeGroup(props){
  console.log('nodeGroup');
  return(// onClick's this valid?
    <g onClick={props.onClick}>
    <circle cx={`${props.x}`} cy={`${props.y}`} r="19" className="svg-circle" />
    <text x={`${props.x}`} y={`${props.y}`} dy=".3em" className="svg-text">{props.id}</text>
  </g>
  );
}
class Board extends React.Component{
  //window resizes conflicts with h and w?
  // let h = Math.floor(window.innerHeight*8/10);
  // let w = math.floor(window.innerWidth*6/10);
  constructor(props){
    super(props);
    this.state = {
      node_position : new Map(),
      isDrawing : false,
      x1 : null,
      y1 : null,
      x2 : null,
      y2 : null,
    };
    // this.
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
    let p= JSON.stringify([e.clientX,e.clientY]);
    console.log(this.state.node_position)
    if(this.state.node_position.has(p)){
      console.log('node '+p+' exists');
      return;
    }
    this.state.node_position.set(p, this.state.node_position.size);
    this.setState({
      node_position: this.state.node_position,
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
    // this.state.isDrawing^=1;
    this.setState({
      isDrawing: this.state.isDrawing^1,
      x1: e.clientX,
      y1: e.clientY, 
      x2: e.clientX,
      y2: e.clientY, 
    });
    // setInterval(draw(e.clientX,e.clientY),100);
    // e.preventDefault();
  }
  convertToArr(s){
    let tmp=s.split('');
    tmp.splice(tmp.length-1,1)
    tmp.splice(0,1);
    tmp=tmp.join('');
    // console.log('tmp: ',tmp)
    tmp=tmp.split(',');
    // console.log('tmp: ',tmp)
    // console.log('x: ',tmp[0],' y: ',tmp[1]);
    return ([tmp[0],tmp[1]]);
  }
  render(){
    console.log('render; isDrawing: ',this.state.isDrawing);
    let nodes_svg=[];
    for(let ele of this.state.node_position){
      let p=this.convertToArr(ele[0]);
      // console.log('p: ',p);
      // console.log('rendered node at: left ',p[0],' top ',p[1]);
      // const nodes_svgtyle={
      //   position: "absolute",
      //   left: `${p[0]-19}px`,
      //   top: `${p[1]-19}px`,
      // };
      nodes_svg.push(
        // <div className="node clearfix" key={`${nodes_svg.length}`} style={nodes_svgtyle}>{ele[1]}</div>
        <NodeGroup key={`${nodes_svg.length}`} x={`${p[0]}`} y={`${p[1]}`} id={`${nodes_svg.length}`} onClick={this.handleGroupClick} /> 
        // <g key={`${nodes_svg.length}`} onClick={this.handleGroupClick}>
        //   <circle cx={`${p[0]}`} cy={`${p[1]}`} r="19" className="svg-circle" />
        //   <text x={`${p[0]}`} y={`${p[1]}`} dy=".3em" className="svg-text">{nodes_svg.length}</text>
        // </g>
      );
    }
    return(
<svg version="1.1" baseProfile="full" xmlns="http://www.w3.org/2000/svg" 
  className="board" onClick={this.handleBoardClick} onMouseMove={this.handleMouseMove}>
    <DrawLine isDrawing={this.state.isDrawing} x1={this.state.x1} x2={this.state.x2} y1={this.state.y1} y2={this.state.y2}/>
    {/* <NodeGroup x="500" y="500" id="20" onClick={this.handleGroupClick} /> */}
    <line x1="50" y1="50" x2="200" y2="50" className="svg-line"/>
     {nodes_svg}
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
serviceWorker.unregister();
