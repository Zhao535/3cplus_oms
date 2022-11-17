import React from 'react';
import {App, CTYPE, U, Utils} from "../../common";
import {
    Avatar,
    Button,
    Card,
    Divider, Dropdown,
    Form,
    Icon,
    Input, Menu,
    message,
    Modal,
    notification,
    Pagination,
    Table,
    Tag
} from "antd";
import BreadcrumbCustom from "../../common/BreadcrumbCustom";
import ShoppingUtils from "./ShoppingUtils";
import AdminUtils from "../admin/AdminUtils";


const FormItem = Form.Item


class SceneType extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sceneTypes: [],
            pagination: {
                current: 1,
                pageSize: 10,
                total: 0,
            },
            qo: {},
            loading: false,
        };

    }

    componentDidMount() {
        this.loadData();
    }


    loadData = () => {
        this.setState({loading: true})
        let {qo, pagination = {}} = this.state;
        let {current, pageSize} = pagination;
        qo.pageNumber = current;
        qo.pageSize = pageSize;
        console.log(qo)
        App.api(`adm/sceneType/items`, {qo: JSON.stringify(qo)}).then((res) => {
            let pagination = {} = Utils.pager.convert2Pagination(res);
            console.log(pagination)
            this.setState({sceneTypes: res.content, pagination: pagination, loading: false})
        })
    }


    changeStatus = (sceneType) => {
        Modal.confirm({
            title: (sceneType.status === 1 ? '确认封禁' : '确认启用'),
            onOk: () => {
                App.api(`adm/sceneType/changeStatus`, {id: sceneType.id}).then(() => {
                    notification.open({
                        message: '提示:',
                        description: sceneType.status === 1 ? '停用成功' : '启用成功'
                    })
                    this.loadData({})
                })
            }

        })
    }

    remove = (id) => {
        Modal.confirm({
            title: '确认删除此分类',
            onOk: () => {
                App.api(`adm/sceneType/remove`, {id: id}).then(() => {
                    notification.open({
                        message: '提示:',
                        description: '删除成功'
                    })
                    this.loadData({})
                })
            }

        })

    }


    render() {
        let {sceneTypes = [], pagination = {}, loading} = this.state
        let {current, total} = pagination;
        return <div>
            <BreadcrumbCustom first={CTYPE.link.scene.txt}/>
            <Card>
                <div>
                    <Button onClick={() => ShoppingUtils.sceneTypeEdit({}, this.loadData)}
                            type={"primary"}><Icon
                        type={'plus-circle'}/>添加分类</Button>
                    <div className="clearfix-h20"/>
                    <Table columns={[{
                        title: '序号',
                        dataIndex: 'id',
                        className: 'txt-center',
                        render: (col, row, i) => i + 1
                    }, {
                        title: '图片',
                        dataIndex: 'icon',
                        className: 'txt-center',
                        render: (icon, sceneType, index) => {
                            return <img src={icon} style={{width: '40px', height: '40px', borderRadius: '4px'}}/>
                        }
                    }, {
                        title: '名称',
                        dataIndex: 'name',
                        className: 'txt-center'
                    }, {
                        title: '副标题',
                        dataIndex: 'subHeading',
                        className: 'txt-center'
                    }, {
                        title: '状态',
                        dataIndex: 'status',
                        className: 'txt-center',
                        render: ((obj, brand, index) => {
                            let {status} = brand;
                            return <div><Tag
                                color={(status === 1) ? "blue" : "red"}> {Utils.common.byte2status(status)}</Tag></div>
                        })
                    }, {
                        title: '操作',
                        className: 'txt-center',
                        render: (obj, sceneType, index) => {
                            return <Dropdown overlay={<Menu>
                                <Menu.Item key="1">
                                    <a onClick={() => ShoppingUtils.sceneTypeEdit(sceneType, this.loadData)}>编辑</a>
                                </Menu.Item>
                                <Menu.Divider/>
                                <Menu.Item key="2">
                                    <a onClick={() => this.remove(sceneType.id, index)}>删除</a>
                                </Menu.Item>
                                <Menu.Divider/>
                                <Menu.Item key="3">
                                    <a onClick={() => this.changeStatus(sceneType)}>{sceneType.status === 1 ? '停用' : '启用'}</a>
                                </Menu.Item>
                            </Menu>} trigger={['click']}>
                                <a className="ant-dropdown-link">
                                    操作 <Icon type="down"/>
                                </a>
                            </Dropdown>
                        }
                    }
                    ]} rowKey={(item) => item.id}
                           dataSource={sceneTypes}
                           pagination={false}
                           loading={loading}
                    />
                </div>
                <Pagination style={{float: 'right'}} total={total} showSizeChanger
                            onShowSizeChange={(current, size) => {
                                this.setState({
                                    pagination: {
                                        ...pagination,
                                        current: current,
                                        pageSize: size
                                    }
                                })
                            }} current={current}
                            onChange={(current) => {
                                this.setState({
                                    pagination: {
                                        ...pagination,
                                        current: current
                                    }
                                })
                            }}/>
            </Card>


        </div>;
    }
}

export default SceneType;