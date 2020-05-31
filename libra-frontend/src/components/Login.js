import React from 'react';
import { Form, Input, Button, Spin } from 'antd';
import Icon from '@ant-design/icons';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import * as actions from '../redux/actions/auth';

const FormItem = Form.Item;
const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;


class NormalLoginForm extends React.Component {
  onFinish = (values) => {
		//e.preventDefault();
		console.log("Hello")
    
		this.props.onAuth(values.userName, values.password);
		this.props.history.push('/projects');
    
  }

  render() {
    let errorMessage = null;
    if (this.props.error) {
        errorMessage = (
            <p>{this.props.error.message}</p>
        );
    }

    return (
        <div>
            {errorMessage}
            {
                /*this.props.loading ?

                <Spin indicator={antIcon} />

                :*/

                <Form onFinish={this.onFinish} className="login-form">

                    <Form.Item name='userName' rules = {[{ required: true, message: 'Please input your username!' }]} >
                    
                      <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Username" />
                    
                    </Form.Item>

                    <Form.Item name='password' rules={ [{ required: true, message: 'Please input your Password!' }]}>
                        <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" />
                    </Form.Item>

                    <Form.Item>
                    <Button type="primary" htmlType="submit" style={{marginRight: '10px'}}>
                        Login
                    </Button>
                    Or 
                    <NavLink 
                        style={{marginRight: '10px'}} 
                        to='/signup/'> signup
                    </NavLink>
                    </Form.Item>
                </Form>
            }
      </div>
    );
  }
}

//NormalLoginForm = Form.create({})(NormalLoginForm);
const mapStateToProps = (state) => {
    return {
        loading: state.loading,
        error: state.error
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onAuth: (username, password) => dispatch(actions.authLogin(username, password)) 
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(NormalLoginForm);