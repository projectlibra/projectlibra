import React, { Component } from 'react'
import {Card} from 'antd'

const Project = (props) => {

  return (
    <div>
      <Card title= {props.name} extra={<a href="#">More</a>} style={{ width: 300, marginRight: '20px', marginBottom: '10px' }}>
        <p>{props.desc}</p>
      </Card>
    </div>
    
  )
}

export default Project;