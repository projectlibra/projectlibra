import React, { Component } from 'react'
import {Card} from 'antd'

const Project = (props) => {

  return (
    <div>
      <Card title= {props.name} extra={<a href="#">More</a>} style={{ width: 300 }}>
        <p>Card content</p>
        <p>Card content</p>
        <p>Card content</p>
      </Card>
    </div>
    
  )
}

export default Project;