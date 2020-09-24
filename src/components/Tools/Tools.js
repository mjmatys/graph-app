import React from 'react'
import './Tools.css'
export default function Tools({click,setClick, clear}){

    const handleClick = (e) => {
        e.preventDefault();
        console.log('setclick: ',e.target.id)
        setClick(e.target.id);
    }
    // console.log('rerender; click: ',click);
    return(
        <ul className="tools-list-row">
            <li className="tool border-right">
                <a id="draw" href="!#" className={`tool-link  leftside ${click=="draw" ? "active":""}`} onClick={handleClick}>
                    Draw
                </a>
            </li>
            <li className="tool border-right">
                <a id="fix" href="!#" className={`tool-link ${click=="fix" ? "active":""}`} onClick={handleClick}>
                    Fix
                </a>
            </li>
            <li className="tool border-right">
                <a id="delete"href="!#" className={`tool-link ${click=="delete" ? "active":""}`} onClick={handleClick}>
                    Delete
                </a>
            </li>
            {/* <li className="tool border-right">
                <a id="fixall" href="!#" className="tool-link" onClick={handleFixall}>
                    Fix All
                </a>
            </li> */}
            <li className="tool">
                <a id="clear" href="!#" className="tool-link  rightside" onClick={clear}>
                    Clear
                </a>
            </li>
        </ul>
    )
}