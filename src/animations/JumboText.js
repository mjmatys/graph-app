import React from 'react'
import Jumbotron from 'react-bootstrap/Jumbotron'


export default function JumboText({show,text}){
    if(show){
      return (
      <div className="flexcenter">
        <Jumbotron className="jumbostart">
          <h2>
          {text}
          </h2>
        </Jumbotron>
      </div>
      );
    }
    else
      return null;
  }