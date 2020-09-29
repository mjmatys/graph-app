import React from 'react'
import './player.css'
import play from '../Icons/wplay2.png'
import pause from '../Icons/wpause2.png'
import rewind from '../Icons/wrewind2.png'
import fforward from '../Icons/wfforward2.png'
import cancel from '../Icons/cancel.png'
export default function Player({playing, setPlaying, setStep, start, setDelay, setAnimate, setGraphity}){

    const handleRewind = () => {
        setDelay(1);
        setStep( step => step-1 );
    }
    const handleFforward = () => {
        setDelay(1);
        setStep( step => step+1 );
    }

    return(
        <div className="playerwrap">
            <ul className="player">
                <li className="playerItem border-right leftside" onClick={handleRewind}>
                    <input  type="image" src={rewind}/>
                </li>
                <li className="playerItem border-right" onClick={() =>{if(start) setPlaying(playing => playing^1)}}>
                    <input type="image" src={playing?pause:play} />
                </li>
                <li className="playerItem rightside" onClick={handleFforward}>
                    <input type="image" src={fforward} />
                </li>
            </ul>
            <input type="image" src={cancel} className="btn-cancelAnimation" onClick={() => {setAnimate(null); setGraphity(1);}}/>
        </div>
    );
}