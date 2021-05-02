import React from 'react';
import './Node.css'


const r = 19;

export default function Nodes({ nodelist, handleGroupClick, handleMouseDown, handleMouseUp, cClasses }) {
  return (
    nodelist.map((node) => {
      if (node == null)
        return null;
      const { x, y, id, key, fixed, cClasses } = node;
      return (
        <NodeGroup
          key={key}
          x={x}
          y={y}
          id={id}
          fixed={fixed}
          onClick={handleGroupClick}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          cClasses={cClasses}
        />
      );
    })
  );
}
export function createNode(x, y, id, key, boardClicked = 0, fixed = 0, cClasses = "") {
  return {
    x,
    y,
    id,
    adj: [],
    key,
    boardClicked,
    fixed,
    cClasses,
    lClasses: new Map(),
  };
};


function NodeGroup(props) {
  return (
    <g className="svg-group" id={props.id} onClick={props.onClick} onDoubleClick={props.onDoubleClick} onMouseDown={props.onMouseDown} onMouseUp={props.onMouseUp}>
      <circle id={props.id} cx={`${props.x}`} cy={`${props.y}`} r={`${r}`} className={`svg-circle ${props.fixed ? "fixed" : ""} ${props.cClasses}`} />
      <text id={props.id} x={`${props.x}`} y={`${props.y}`} dy=".3em" className="noselect svg-text">{props.id}</text>
    </g>
  );
}
