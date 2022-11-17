import React from 'react';
import {Avatar, Form, Icon, Layout, Menu, Modal} from 'antd';
import '../assets/css/header.scss'

import App from './App.jsx';
import AdminUtils from "../components/admin/AdminUtils";
import AdminProfile from "../components/admin/AdminProfile";
import {inject, observer} from 'mobx-react'

const {Header} = Layout;
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

@inject('admin')
@observer
class HeaderCustom extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            collapsed: false,
            profile: {},
            show_edit: false
        };
    }

    componentDidMount() {
        AdminProfile.get().then((profile) => {
            this.props.admin.setProfile(profile);
        });
    }


    toggleCollapsed = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
        this.props.toggle && this.props.toggle();
    };

    logout = () => {
        Modal.confirm({
            title: '确定要退出吗?',
            content: null,
            onOk() {
                App.logout();
                App.go('/login');
            },
            onCancel() {
            },
        });
    };

    showEdit = (val) => {
        this.setState({show_edit: val || false});
    };

    render() {

        let profile = this.props.admin.getProfile || {};
        let {admin = {}} = profile;
        console.log({admin})
        let {name = 'S', img} = admin;
        return (<Header className='header-page'>
                <Icon
                    className="trigger custom-trigger"
                    type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                    onClick={this.toggleCollapsed}/>
                <Menu className='header-top-bar'
                      mode="horizontal" style={{lineHeight: '65px', float: 'right'}}>
                    <SubMenu
                        title={<Avatar src={img} size={40} icon="user"/>}>
                        <MenuItemGroup title="用户中心">
                            <Menu.Item key="pwd"><span onClick={AdminUtils.modAdminPwd}>修改密码</span></Menu.Item>
                            <Menu.Item key="logout"><span onClick={this.logout}>退出登录</span></Menu.Item>
                        </MenuItemGroup>
                    </SubMenu>
                </Menu>
                {name && <span style={{color: '#fff', float: 'right'}}>{name}</span>}

            </Header>

        )
    }
}

export default Form.create()(HeaderCustom);
