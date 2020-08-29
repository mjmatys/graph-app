import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
// import App from './App';
import * as serviceWorker from './serviceWorker';

// class Hello extends React.Component{
//   render(){
//     return(
//       <div>Hello World</div>
//     );
//   }
// }
class Board extends React.Component{
  //window resizes conflicts with h and w?
  // let h = Math.floor(window.innerHeight*8/10);
  // let w = math.floor(window.innerWidth*6/10);
  constructor(props){
    super(props);
    this.state = {
      node_position : new Map(),
    };
    this.handleBoardClick = this.handleBoardClick.bind(this);
    // let arr=[];
    // for(let i=0;i<h;i++){
    //   for(let j=0;j<w;j++){
    //     arr[i].push(0)
    //   }
    //   arr.push([]);
    // }
    // this.state:{
    //   let canv[w][h]
    // };
  }
  handleBoardClick(e){
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
    console.log('clicked at: ',e.clientX, e.clientY);
  }
  convertToArr(s){
    let tmp=s.split('');
    tmp.splice(tmp.length-1,1)
    tmp.splice(0,1);
    tmp=tmp.join('');
    // console.log('tmp: ',tmp)
    tmp=tmp.split(',');
    console.log('tmp: ',tmp)
    // console.log('x: ',tmp[0],' y: ',tmp[1]);
    return ([tmp[0],tmp[1]]);
  }
  render(){
    let nodeDivs=[];
    for(let ele of this.state.node_position){
      let p=this.convertToArr(ele[0]);
      console.log('p: ',p);
      console.log('added node at: left ',p[0],' top ',p[1]);
      const nodeDivstyle={
        position: "absolute",
        left: `${p[0]-15}px`,
        top: `${p[1]-15}px`,
      };
      nodeDivs.push(
        <div className="node clearfix" key={`${nodeDivs.length}`} style={nodeDivstyle}>{ele[1]}</div>
      );
    }
    return(
      <div className="board" onClick={this.handleBoardClick}>
        {nodeDivs}
        {/* <svg version="1.1"
     baseProfile="full"
     xmlns="http://www.w3.org/2000/svg">


  <circle cx="150" cy="100" r="80" fill="green" />

  <text x="150" y="125" font-size="60" text-anchor="middle" fill="white">SVG</text>

</svg> */}
<svg version="1.1"
     baseProfile="full"
     xmlns="http://www.w3.org/2000/svg"
     width="100"
     height="100">
     <g>
     <circle cx="50" cy="50" r="19" fill="white" stroke="black" stroke-width="2" />
     {/* <text x="50" y="50" font-size="12" text-anchor="middle" fill="black">1</text> */}
     <text x="50%" y="50%" stroke="black" stroke-width="1" dy=".3em" text-anchor="middle">1</text>

     </g>

</svg>
      </div>
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
