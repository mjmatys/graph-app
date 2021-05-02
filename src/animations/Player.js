import React, { useEffect, useState } from 'react'
import './player.css'
import play from '../Icons/wplay2.png'
import pause from '../Icons/wpause2.png'
import rewind from '../Icons/wrewind2.png'
import fforward from '../Icons/wfforward2.png'
import cancel from '../Icons/cancel.png'
// import 'bootstrap/dist/css/bootstrap.css';
import 'react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css';

import RangeSlider from 'react-bootstrap-range-slider';


export default function Player({ playing, setPlaying, setStep, started, setStarted, setDelay, setAnimate, setGraphity, animDelay, setAnimDelay }) {

    const [value, setValue] = useState(1500)

    useEffect(() => {
        setAnimDelay(2050 - value);
    }, [value])

    const handleRewind = () => {
        setDelay(1);
        setStep(step => step - 1);
    }
    const handleFforward = () => {
        setDelay(1);
        setStep(step => step + 1);
    }
    const handleCancel = () => {
        setAnimate(null);
        setGraphity(1);
        setStarted(0);
        console.log('CANCEL');
    }

    return (
        <div className="playerwrap">
            <ul className="player">
                <li className="playerItem border-right leftside" onClick={handleRewind}>
                    <input type="image" src={rewind} className="noselect" />
                </li>
                <li className="playerItem border-right" onClick={() => { if (started) setPlaying(playing => playing ^ 1) }}>
                    <input type="image" className="noselect" src={playing ? pause : play} />
                </li>
                <li className="playerItem rightside" onClick={handleFforward}>
                    <input type="image" className="noselect" src={fforward} />
                </li>
            </ul>
            <RangeSlider value={value} min={50} max={2000}
                onChange={changeEvent => setValue(parseInt(changeEvent.target.value))}
                className="speedslider"
            />
            <input type="image" src={cancel} className="btn-cancelAnimation" onClick={handleCancel} />
        </div>
    );
}