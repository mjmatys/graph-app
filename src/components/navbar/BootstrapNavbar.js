import React from 'react'
import { Navbar,Nav,NavDropdown} from 'react-bootstrap'
import './navbar.css'

class BootstrapNavbar extends React.Component{

    // render(){
    //     return(
    //         <div>
    //                         <Navbar variant="dark" expand="md" sticky="top" className=" d-flex navbarstyle align-items-stretch">
    //                         <Navbar.Collapse>   
    //                             <Nav className="flex-fill side hr">
    //                                 <NavDropdown title="Algorithms" id="basic-nav-dropdown"></NavDropdown>
    //                             </Nav>
    //                             <hr />
    //                             <Nav className="flex-fill inside">
    //                                 <NavDropdown title="Algorithms" id="basic-nav-dropdown"></NavDropdown>
    //                             </Nav>
    //                         </Navbar.Collapse>
                            
    //                         <Navbar.Brand className="navbarbrand flex-fill text-center" href="#home" >React Bootstrap Navbar</Navbar.Brand>
    //                         <Navbar.Collapse>
    //                             <Nav className="flex-fill side hr">
    //                                 <NavDropdown className="flex-fill text-center" title="Algorithms" id="basic-nav-dropdown"></NavDropdown>
    //                             </Nav>
    //                                 <hr />
    //                             <Nav className="flex-fill inside">
    //                                 <NavDropdown title="Algorithms" id="basic-nav-dropdown"></NavDropdown>
    //                             </Nav>
    //                         </Navbar.Collapse>
    //                         </Navbar>
    //                         <br />
    //                 </div>
    //     )  
    // }
    render(){
        return(
            <div>
                            <Navbar variant="dark" expand="md" sticky="top" className=" d-flex navbarstyle">
                            <Nav className="container-fluid">
                            <Navbar.Collapse className="flex-fill" id="navbarcollapse">
                                <ul className="container-fluid flex-row">
                                    <li className="hr">
                                    {/* <a href="#">Algorithms</a> */}
                                        {/* <Nav.link href="#">Generate a Graph</Nav.link> */}
                                        <Nav.Link href="#home">Generate a Graph</Nav.Link>
                                    </li>

                                    <li>
                                        <NavDropdown title="Algorithms" className="flex-fill"></NavDropdown>
                                        {/* <Nav.Link href="#home">Home</Nav.Link> */}

                                    </li>
                                </ul>   
                            </Navbar.Collapse>

                            <Navbar.Brand className="navbarbrand flex-fill text-center" href="#home" >GraphBox</Navbar.Brand>
                            
                            <Navbar.Collapse className="flex-fill" id="navbarcollapse">
                            <ul className="container-fluid flex-row" >    
                                    <li className="hr">
                                    {/* <Nav.link href="#">Generate a Graph</Nav.link> */}
                                    <Nav.Link href="#home">About</Nav.Link>
                                    {/* <a href="" */}

                                    </li>

                                    <li>
                                    {/* <Nav.link href="#">Generate a Graph</Nav.link> */}
                                    <Nav.Link href="#home">Config   </Nav.Link>

                                    </li>
                                </ul>   
                            </Navbar.Collapse>
                            </Nav>
                            {/* </Nav> */}
                            </Navbar>
                            <br />
                    </div>
        )  
    }
}

export default BootstrapNavbar;