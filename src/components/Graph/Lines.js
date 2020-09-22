import React from 'react';
import './Lines.css'

export default function Lines({nodelist, id1, handleLineClick}) {
    return(
        nodelist.map((node) =>{
            if(node==null)
              return null;
            const {x,y,id,adj} = node;
            const e = adj.map( (v) => {
              //can be null because of setstate async
              if(nodelist[v] && v>id){
                return <DrawLine  key={getkey(id,v)} u={id1} onClick={handleLineClick} isDrawing="1" x1={x} y1={y} x2={nodelist[v].x} y2={nodelist[v].y} />
              }
              return null;
            });
            return e;
          })
    );
}

export function DrawLine(props){
    if(props.isDrawing){
    // console.log(props.isDrawing,'from : ',props.x1,' ',props.y1,' to ',props.x2,' ',props.y2);
      return <line  u={props.u} onClick={props.onClick} className="svg-line" x1={`${props.x1}`} y1={`${props.y1}`} x2={`${props.x2}`} y2={`${props.y2}`}/>
    }
    else return null;
  }
  
const getkey = (u,v) => u.toString().concat('->',v.toString());

