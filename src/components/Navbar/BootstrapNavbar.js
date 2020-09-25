import React from 'react'
import { Navbar,Nav,NavDropdown} from 'react-bootstrap'
import './navbar.css'
// import AnimateDfs from '../../animations/dfs.js'

export default function BootstrapNavbar(props){
    const handleDfs = () => {
        props.setAnimate("dfs");
    }
    return(
        <div id="navbar-container">
                        <Navbar variant="dark" expand="md" sticky="top" className=" d-flex navbarstyle">
                        <Nav className="container-fluid">
                        <Navbar.Collapse id="navbarcollapse">
                            <ul className="container-fluid flex-row">
                                <li className="hr">
                                    <Nav.Link href="#home">Generate a Graph</Nav.Link>
                                </li>

                                <li>
                                    <NavDropdown title="Algorithms" >
                                        <NavDropdown.Item href="!#" onClick={handleDfs}>DFS</NavDropdown.Item>
                                    </NavDropdown>
                                </li>
                            </ul>   
                        </Navbar.Collapse>

                        <Navbar.Brand className="navbarbrand text-center" href="#home" >GraphBox</Navbar.Brand>
                        
                        <Navbar.Collapse id="navbarcollapse">
                        <ul className="container-fluid flex-row" >    
                                <li className="hr">
                                <Nav.Link href="#home">About</Nav.Link>
                                </li>

                                <li>
                                <Nav.Link href="#home">Config</Nav.Link>
                                </li>
                            </ul>   
                        </Navbar.Collapse>
                        </Nav>
                        </Navbar>
                </div>
    )  
}

// export default BootstrapNavbar;