import React from 'react'
import { Navbar, Nav, NavDropdown } from 'react-bootstrap'
import './navbar.css'
import { generateGraph } from '../../HelperFunctions/GraphGenerator'


// const setRandomGraph = () => {
//     let newAdjList = generateGraph();
//     props.setAdjList(newAdjList);
//     props.setFormAdjList(newAdjList);
// }

export default function BootstrapNavbar(props) {
    const handleDropdown = (e) => {
        e.preventDefault();
        console.log(e.target.id);
        props.setAnimate(e.target.id);
    }
    return (
        <div id="navbar-container">
            <Navbar variant="dark" expand="md" sticky="top" className=" d-flex navbarstyle">
                <Nav className="container-fluid">
                    <Navbar.Collapse id="navbarcollapse">
                        <ul className="container-fluid flex-row">
                            <li className="hr">
                                <Nav.Link href="#home" onClick={
                                    () => {
                                        let newAdjList = generateGraph();
                                        props.setAdjList(newAdjList);
                                        props.setFormAdjList(newAdjList);
                                    }
                                }>Generate a Graph</Nav.Link>
                            </li>

                            <li>
                                <NavDropdown title="Algorithms" >
                                    <NavDropdown.Item id="dfs" href="!#" onClick={handleDropdown}>DFS</NavDropdown.Item>
                                    <NavDropdown.Item id="bfs" href="!#" onClick={handleDropdown}>BFS</NavDropdown.Item>
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