import React from 'react'
// import Overlay from 'react-bootstrap/Overlay'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Popover from 'react-bootstrap/Popover'
// import {Button} from 'react-bootstrap'
import qmark from './qmark.svg'
import Qmark from '../../../Icons/Qmark.js'
import './InputPopover.css'


export default function InputTooltip(props) {
    const popover = (
        <Popover id="popover-basic">
          <Popover.Title as="h3"><strong>Input Example</strong></Popover.Title>
          <Popover.Content>
            4 3 <span className="text-muted"> &ndash; 4 nodes and 3 edges</span><br/>
            0 1 <span className="text-muted"> &ndash; edge between node 0 and 1</span><br/>
            1 3 <span className="text-muted"> &ndash; edge between node 1 and 3</span><br/>
            3 2 <span className="text-muted"> &ndash; edge between node 2 and 3</span><br/>
            {/* To render your own graph provide graph data as shown:<br/>
            Node Count &nbsp;&nbsp;&nbsp;&nbsp;Edge Count<br/>
            &#123;Edge Data
            <br/>.          
            <br/>.          
            <br/>.&#125;     */}
          </Popover.Content>
        </Popover>
      );  
    return (
        <OverlayTrigger trigger={[ 'focus','hover']} placement="right" overlay={popover}>
          <img src={qmark} alt="" className="qmark"/>
        </OverlayTrigger>
      );
  }
  