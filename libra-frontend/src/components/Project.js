import React, { Component } from 'react'
import {Card} from 'antd'
import { Link } from "react-router-dom";
import {AnimationWrapper} from "react-hover-animation"
const Project = (props) => {

  if (props.disease == null) {
  return (
    <div>
      <Link to={`/projects/${props.id}`}>
        <AnimationWrapper config={{
        opacity: {
          initial: '1.0',
          onHover: '1.0',
        },
      }}>
          <Card title= {props.name} extra={<a href={props.id}>More</a>} style={{ width: 300, marginRight: '20px', marginBottom: '10px', boxShadow: '5px 5px' }}>
            <strong>Descripion: </strong><p>{props.desc}</p>
          </Card>
        </AnimationWrapper>
      </Link>
    </div>
    
  )
    }
  else {
    return (
      <div>
        <Link to={`/projects/${props.id}`}>
          <AnimationWrapper config={{
          opacity: {
            initial: '1.0',
            onHover: '1.0',
          },
        }}>
            <Card title= {props.name} extra={<a href={props.id}>More</a>} style={{ width: 300, marginRight: '20px', marginBottom: '10px', boxShadow: '5px 5px' }}>
              <strong>Descripion: </strong><p>{props.desc}</p>
              <strong>Associated Disease: </strong><p>{props.disease}</p>
            </Card>
          </AnimationWrapper>
        </Link>
      </div>
      
    )
  }
}

export default Project;