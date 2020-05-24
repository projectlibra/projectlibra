import React from 'react';
import { Menu } from 'antd';
import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';

const { SubMenu } = Menu;

class Sider extends React.Component {

    constructor(props) {
        super(props);
    }

    handleClick = e => {
        console.log('click ', e);
        this.props.updateParent({selected_key: e.key});
    };

    render() {
        return (
        <Menu
            onClick={this.handleClick}
            style={{ width: 256 }}
            defaultSelectedKeys={['1']}
            defaultOpenKeys={['sub1']}
            mode="inline"
        >
            <SubMenu
            key="sub1"
            title={
                <span>
                <SettingOutlined />
                <span>Utilities</span>
                </span>
            }
            >
            
                <Menu.Item key="1">Summary</Menu.Item>
                <Menu.Item key="2">Upload Files</Menu.Item>
                <Menu.Item key="3">Notes</Menu.Item>
                <Menu.Item key="4">Patients</Menu.Item>
            
            </SubMenu>
        </Menu>
        );
    }
}

export default Sider;