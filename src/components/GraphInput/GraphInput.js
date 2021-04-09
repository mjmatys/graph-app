import React,{useState, useEffect} from 'react'
import InputPopover from './InputPopover/InputPopover.js' 
// import {Form} from 'react-bootstrap'
import {Form,Button} from 'react-bootstrap'
// import RenderAdjList from '../../HelperFunctions/RenderAdjList.js'
import './GraphInput.css'

// const petersen = '10 15 \n0 1 \n0 4 \n0 5 \n1 6 \n1 2 \n2 3 \n2 7 \n3 8 \n3 4 \n4 9 \n5 8 \n5 7 \n6 8 \n6 9 \n7 9'


export default function GraphInput({setAdjList, setGraphity, formAdjList, setFormAdjList}){
    // const [value,setValue] = useState(adjList);
    const [active, setActive] = useState(1);
    // console.log('initial: ',value);
    
    useEffect( () => console.log(active),[active])

    const handlePaginationClick = (e) => {
        console.log(e.target.parentElement);
        setActive(e.target.parentElement.id);
        setGraphity(e.target.parentElement.id==1);
        // console.log('set graphity: ',e.target.parentElement.id==1);
        // console.log('active: ',active)
    }

    const handleChange = (e) => {

        console.log("form value: "+e.target.value);

        setFormAdjList(e.target.value);
        setAdjList(e.target.value);
    }
    // console.log(adjList);
    return(
        <>
        {/* <Form className="graph-input" onSubmit={onSubmit}> */}
        <Form className="graph-input">
            <Form.Group controlId="textarea">
                <Form.Label>Adjacency List&nbsp;<InputPopover /> </Form.Label>
                <Form.Control as="textarea" value={formAdjList} onChange={handleChange}/>
            </Form.Group>

            <ul className="pagination">
                <li key={1} id={1} className={`page-item ${active==1 ? "active":""}`}>
                    <a className="page-link" onClick={handlePaginationClick} href="!#">Graphity On</a>
                </li>
                <li key={2} id={2} className={`page-item ${active==2 ? "active":""}`}>
                    <a className="page-link" onClick={handlePaginationClick} href="!#">Graphity Off</a>
                </li>
            </ul>
            {/* <Button type="submit">submit</Button> */}
        </Form>
        </>
    )
}

// export default GraphInput