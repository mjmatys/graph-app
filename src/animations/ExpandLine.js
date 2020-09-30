import React from 'react'
import RenderAdjList from '../HelperFunctions/RenderAdjList';
import './animations.css'

const dist = (x1,y1,x2,y2) => Math.sqrt(Math.pow(x1-x2,2)+Math.pow(y1-y2,2));

const getLineDelay = (animDelay) =>{
    if(animDelay<666) return 0.7;              
    if(animDelay<1322) return 1.0;
    return 1.3;
  }


export default function ExpandLine({show, animDelay, x1,y1,x2,y2}){

    const getStyles = () =>{
        let speed = getLineDelay(animDelay)*1.5;
        console.log('EXPAND: ',)      
        return{
            stroke: "red",
            strokeWidth: "0",
            animation: `expand ${speed}s linear`,
        }
    }
    if(show)
        return (
            <line x1={x1} y1={y1} x2={x2} y2={y2} style={getStyles()} />
        );
    else 
        return null;
}