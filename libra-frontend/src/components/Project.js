import React, { Component } from 'react'
import {Card} from 'antd'
import { Link } from "react-router-dom";

const Project = (props) => {

  return (
    <div>
      <Link to={`/projects/${props.id}`}>
        <Card title= {props.name} extra={<a href={props.id}>More</a>} style={{ width: 300, marginRight: '20px', marginBottom: '10px' }}>
          <p>{props.desc}</p>
        </Card>
      </Link>
      
    </div>
    
  )
}

export default Project;