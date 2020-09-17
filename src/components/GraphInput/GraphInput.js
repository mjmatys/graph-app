import React,{useState} from 'react'
import InputPopover from './InputPopover/InputPopover.js' 
import {Form, Button} from 'react-bootstrap'
import './GraphInput.css'

const petersen = '10 15 \n0 1 \n0 4 \n0 5 \n1 6 \n1 2 \n2 3 \n2 7 \n3 8 \n3 4 \n4 9 \n5 8 \n5 7 \n6 8 \n6 9 \n7 9'

export default function GraphInput(props){
    const [value,setValue] = useState('10 15 \n0 1 \n0 4 \n0 5 \n1 6 \n1 2 \n2 3 \n2 7 \n3 8 \n3 4 \n4 9 \n5 8 \n5 7 \n6 8 \n6 9 \n7 9')
    const onSubmit = (e) => {
        e.preventDefault()
        const nodelist = props.renderGraph(value);
        props.setNodelist(nodelist);
        // console.log(value);
    }
   
    return(
        <>
        <Form className="graph-input" onSubmit={onSubmit}>
            <Form.Group controlId="textarea">
                <Form.Label>Adjacency List&nbsp;<InputPopover /> </Form.Label>
                <Form.Control as="textarea" defaultValue={petersen} onChange={(e) => setValue(e.target.value)} />
            </Form.Group>
            <Button variant="primary" type="submit">
            Render!
            </Button>
        </Form>
        </>
    )
}