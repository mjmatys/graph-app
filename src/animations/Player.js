import React from 'react'
import './player.css'
import play from '../assets/wplay2.png'
import pause from '../assets/wpause2.png'
import rewind from '../assets/wrewind2.png'
import fforward from '../assets/wfforward2.png'
export default function Player({playing, setPlaying, step, jumpTo, start}){
    return(
        // <div className="playerwrap">
        <ul className="player">
            <li className="playerItem border-right leftside" onClick={() => jumpTo(step-1)}>
                <input  type="image" src={rewind}/>
            </li>
            <li className="playerItem border-right" onClick={() =>{if(start) setPlaying(playing => playing^1)}}>
                <input type="image" src={playing?pause:play} />
            </li>
            <li className="playerItem rightside" onClick={() => jumpTo(step+1)}>
                <input type="image" src={fforward} />
            </li>
        </ul>
        // </div>
    );
}