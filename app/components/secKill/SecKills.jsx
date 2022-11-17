import React from 'react';
import {Button, Card, Dropdown, Icon, Menu, message, Modal, Table} from "antd";
import {CTYPE, App, U, Utils} from "../../common";
import BreadcrumbCustom from "../../common/BreadcrumbCustom";
import SecKillUtils from "./SecKillUtils";

class SecKills extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            pagination: {
                current: 1,
                pageSize: CTYPE.pagination.pageSize,
                total: 0,
            },
            qo: {},
            secKills: [],
            loading: false,
        }

    }

    componentDidMount() {
        this.loadData();
    }

    loadData = () => {
        this.setState({loading: true})
        let {qo = {}, pagination = {}} = this.state;
        let {current, pageSize} = pagination;
        qo.pageNumber = current;
        qo.pageSize = pageSize;
        App.api(`/adm/secKill/secKills`, {secKillQo: JSON.stringify(qo)},).then((result) => {
            this.setState({
                secKills: result.content || [],
                pagination: Utils.pager.convert2Pagination(result),
                loading: false,

            })
        })
    }

    handleTableChange = (pagination) => {
        this.setState({
            pagination: pagination
        }, () => this.loadData());
    };

    edit = (item) => {
        App.go(`/app/secKill/${item.id}`)
    }

    changeStatus = (item) => {
        Modal.confirm({
            title: '确认修改状态', onOk: () => {
                App.api(`/adm/secKill/changeStatus`, {id: item.id}).then(() => {
                    this.loadData();
                    message.success("修改成功")
                })
            }, onCancel: () => {

            }
        })

    }

    render() {
        let {pagination = {}, secKills = [], loading} = this.state;

        return (
            <div>
                <BreadcrumbCustom first={CTYPE.link.secKills.txt}/>
                <Card title={<Button type="primary" icon={"file-add"} onClick={() => {
                    App.go(`/app/secKill/0`)
                }}>添加限时抢购商品</Button>}>
                    <Table columns={[
                        ...SecKillUtils.basicColumns,
                        {
                            title: '操作',
                            dataIndex: 'option',
                            className: 'txt-center',
                            render: (obj, item, index) => {
                                let {status} = item;
                                return <Dropdown overlay={<Menu>
                                    <Menu.Item key="1">
                                        <a onClick={() => this.edit(item)}>编辑</a>
                                    </Menu.Item>
                                    <Menu.Divider/>
                                    <Menu.Item key="2">
                                        <a onClick={() => this.changeStatus(item)}>{status === 1 && '下架'}{status === 2 && '上架'}</a>
                                    </Menu.Item>
                                </Menu>} trigger={['click']}>
                                    <a className="ant-dropdown-link">
                                        操作 <Icon type="down"/>
                                    </a>
                                </Dropdown>
                            }
                        }
                    ]
                    }
                           rowKey={(item) => item.id}
                           onChange={this.handleTableChange}
                           dataSource={secKills}
                           loading={loading}
                           pagination={{...pagination, ...CTYPE.commonPagination}}
                    />
                </Card>
            </div>
        );
    }

}

export default SecKills;