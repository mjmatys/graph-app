import React from 'react'
import ArrowImg from '../Icons/ArrowImg.js'
//rotate deg degrees from east direction

export default function Arrow({ show, x, y, deg }) {
    if (show) {
        const tx = x - 20, ty = y - 12;
        return <path id="arrow" transform={`
        translate(${tx},${ty})
        rotate(${deg} 16 12)
        `}
            d="M8.122 24L4 20l8-8-8-8 4.122-4L20 12z" />
    }
    else return null;
}
    // {/* <img src={arrowImg} alt="" className="centerImg"/> */}