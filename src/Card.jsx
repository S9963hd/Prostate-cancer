import React from 'react'
import './Card.css';
const Card = ({value}) => {
  return (
    <div className="CardBody">
        <div className="card">
            <h3 style={{color:"grey"}} className="icon">X</h3>
            <h1>Cancer probability :{value}</h1>
       </div>
    </div>
  )
}

export default Card
