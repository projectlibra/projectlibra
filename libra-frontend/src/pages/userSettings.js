import React, {useState, useEffect} from 'react';
import { Form, Input, InputNumber, Button } from 'antd';
import axios from 'axios';
import 'antd/dist/antd.css';
import host from '../host';

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};


function validatePrimeNumber(number) {
    if (number <= 1.0 && number >= 0) {
      return {
        validateStatus: 'success',
        errorMsg: null,
      };
    }
    return {
      validateStatus: 'error',
      errorMsg: 'The threshold must be between 0 and 1!',
    };
}
const UpdateForm = (props) =>  {
  
  const [form] = Form.useForm();
  const [data, setData] = useState({ user: [] });

  useEffect(() => {
    async function fetchData() {
    const result = await axios.get(
      `${host}/user`,{headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}}
    );
    setData(result.data);
    form.setFieldsValue({
        userName: result.data.username,
        name: result.data.name,
        email: result.data.email,
        ph_thrs: result.data.ph_thrs,
        gn_thrs: result.data.gn_thrs
    })
    }
    fetchData();
  }, []);

  const [number1, setNumber1] = useState({
    value: 11,
  });
  const [number2, setNumber2] = useState({
    value: 11,
  });
  const onFinish = (values) => {
    axios.post(`${host}/user_update` ,{
        username: values.userName,
        name: values.name,
        email: values.email,
        ph_thrs: values.ph_thrs,
        gn_thrs: values.gn_thrs
    } , {headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}})
      .then(res => {
        console.log("Updated");
        console.log(res.data)
      })
      .catch(err =>  {
        if(err.response) {
          console.log(axios.defaults.headers.common)
          console.log(err.response.data)
          if(err.response.status == 401) {
            this.props.history.push('/');
          }
        }
      })
  }

  const onNumberChange1 = value => {
    setNumber1({
      ...validatePrimeNumber(value),
      value,
    });
  };

  const onNumberChange2 = value => {
    setNumber2({
      ...validatePrimeNumber(value),
      value,
    });
  };

    return (
      <div style={{textAlign: 'center'}}>
      <Form
        {...formItemLayout}
        form={form}
        name="update"
        onFinish={onFinish}
        style={{maxWidth: "650px", margin: "0 auto"}}
        scrollToFirstError
      >
        
        <Form.Item
        name="userName"
        label="Username"
        rules={[
          {
            required: true,
            message: 'Please input your username!',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="name"
        label="Name"
        rules={[
          {
            required: true,
            message: 'Please input your name!',
          },
        ]}
      >
        <Input />
      </Form.Item>
        
        <Form.Item
        name="email"
        label="E-mail"
        rules={[
          {
            type: 'email',
            message: 'The input is not valid E-mail!',
          },
          {
            required: true,
            message: 'Please input your E-mail!',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        {...formItemLayout}
        name="ph_thrs"
        label="Phenotype similarity threshold"
        validateStatus={number1.validateStatus}
        help={number1.errorMsg}
      >
        <InputNumber min={0} max={1} value={number1.value} onChange={onNumberChange1} />
      </Form.Item>

      <Form.Item
        {...formItemLayout}
        name="gn_thrs"
        label="Genotype similarity threshold"
        validateStatus={number2.validateStatus}
        help={number2.errorMsg}
      >
        <InputNumber min={0} max={1} value={number2.value} onChange={onNumberChange2} />
      </Form.Item>

        <Form.Item  {...tailFormItemLayout}> 
        <Button type="primary" htmlType="submit" style={{marginRight: '10px'}}>
            Save Changes
        </Button>
        </Form.Item>

      </Form>
      </div>
    );
  
}


export default UpdateForm;