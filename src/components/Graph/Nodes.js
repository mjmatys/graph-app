import React from 'react';
import './Node.css'


const r=19;

export default function Nodes({nodelist, handleGroupClick, handleGroupDblClick, handleMouseDown, handleMouseUp}){
    // console.log('rerender')
    // console.log('nodes: ', nodelist);
    return(
        nodelist.map((node) =>{
            if(node==null)
              return null;
            const {x,y,id,key} = node;
            // console.log(key);
            return(
              <NodeGroup 
              key={key}
              x={x}
              y={y}
              id={id}
              onClick={handleGroupClick}
              onDoubleClick={handleGroupDblClick}
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              />
            );
          })
    );
}
export function createNode(x,y,id,key,boardClicked){
  return {
    x,
    y,
    id,
    adj: [],
    key,
    boardClicked,
  };
};


function NodeGroup(props){
    // console.log('nodegroup')
    return(
      <g className="svg-group" id={props.id} onClick={props.onClick} onDoubleClick={props.onDoubleClick} onMouseDown={props.onMouseDown} onMouseUp={props.onMouseUp}> 
      <circle id={props.id} cx={`${props.x}`} cy={`${props.y}`} r={`${r}`} className="svg-circle" />
      <text id={props.id} x={`${props.x}`} y={`${props.y}`} dy=".3em" className="svg-text">{props.id}</text>
    </g>
    );
  }
