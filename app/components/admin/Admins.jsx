import React from 'react';
import {Avatar, Button, Card, Dropdown, Icon, Menu, message, Modal, Table, Tag} from 'antd';
import BreadcrumbCustom from '../../common/BreadcrumbCustom';
import App from '../../common/App.jsx';
import {CTYPE, U} from "../../common";
import AdminUtils from "./AdminUtils";
import {inject, observer} from 'mobx-react'
import AdminProfile from "./AdminProfile";


@inject('admin')
@observer
class Admins extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            list: [],
            loading: false
        }
    }

    componentDidMount() {
        AdminProfile.get().then(profile => {
            this.props.admin.setProfile(profile);
        });
        this.loadData();
    }

    loadData = () => {
        this.setState({loading: true});
        App.api('adm/admin/items', {
            qo: JSON.stringify({
                sortPropertyName: 'id'
            })
        }).then((admins) => {
            this.setState({
                list: admins.content,
                loading: false
            });
        });

    };

    edit = admin => {
        App.go(`/app/admin/admin-edit/${admin.id}`)
    };

    remove = (id, index) => {
        Modal.confirm({
            title: `确认删除操作?`,
            onOk: () => {
                App.api('adm/admin/remove_admin', {id}).then(() => {
                    message.success('删除成功');
                    let list = this.state.list;
                    this.setState({
                        list: U.array.remove(list, index)
                    })
                })
            },
            onCancel() {
            },
        });
    };

    render() {

        let {list = [], loading} = this.state;

        return <div className="common-list">

            <BreadcrumbCustom first={CTYPE.link.admin_admins.txt}/>

            <Card title={<Button type="primary" icon="user-add" onClick={() => {
                this.edit({id: 0})
            }}>管理员</Button>}>
                <Table
                    columns={[{
                        title: '序号',
                        dataIndex: 'id',
                        className: 'txt-center',
                        render: (col, row, i) => i + 1
                    }, {
                        title: '头像',
                        dataIndex: 'img',
                        className: 'txt-center',
                        render: (img => {
                            return <Avatar shape="square" src={img} size={40} icon="user"/>
                        })
                    }, {
                        title: '名称',
                        dataIndex: 'name',
                        className: 'txt-center'
                    }, {
                        title: '手机号',
                        dataIndex: 'mobile',
                        className: 'txt-center'
                    }, {
                        title: '邮箱',
                        dataIndex: 'email',
                        className: 'txt-center'
                    }, {
                        title: '管理组',
                        dataIndex: 'role.name',
                        className: 'txt-center',
                        render: (str) => <Tag color='blue'>{str}</Tag>
                    }, {
                        title: '操作',
                        dataIndex: 'option',
                        className: 'txt-center',
                        render: (obj, admin, index) => {
                            return <Dropdown overlay={<Menu>
                                <Menu.Item key="1">
                                    <a onClick={() => this.edit(admin)}>编辑</a>
                                </Menu.Item>
                                <Menu.Divider/>
                                <Menu.Item key="2">
                                    <a onClick={() => this.remove(admin.id, index)}>删除</a>
                                </Menu.Item>
                                <Menu.Divider/>
                                <Menu.Item key="3">
                                    <a onClick={() => AdminUtils.adminSessions(admin.id, admin.name)}>登录日志</a>
                                </Menu.Item>
                            </Menu>} trigger={['click']}>
                                <a className="ant-dropdown-link">
                                    操作 <Icon type="down"/>
                                </a>
                            </Dropdown>
                        }

                    }]}
                    rowKey={(item) => item.id}
                    dataSource={list}
                    pagination={false}
                    loading={loading}/>
            </Card>
        </div>
    }
}

export default Admins;
