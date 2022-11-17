import React from 'react';
import { Button, Card, Dropdown, Icon, Menu, message, Modal, Table, Tabs, Tag } from 'antd';
import BreadcrumbCustom from "../../common/BreadcrumbCustom";
import App from '../../common/App.jsx';
import { CTYPE, U } from "../../common";
import ProductUtils from "../product/ProductUtils";
import SettingUtils from "../common/SettingUtils";

const MenuItem = Menu.Item;
const TabPane = Tabs.TabPane;

export default class UIs extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            list: [],
            loading: false,
            type: parseInt(JSON.stringify(this.props.match.params.type)) || 1,
            productCategories: [],
        };
    }

    componentDidMount() {
        this.loadData();
        ProductUtils.loadProductCategories(this);
    }

    loadData = () => {
        let { type } = this.state;
        this.setState({ loading: true });
        App.api('adm/ui/uis', {
            qo: JSON.stringify({
                type
            })
        }).then((res) => {
            this.setState({
                list: res.content,
                loading: false
            });
        });
    };

    edit = ui => {
        App.go(`/app/setting/ui-edit/${ui.type}/${ui.id}`);
    };

    remove = (id, index) => {
        Modal.confirm({
            title: `确认删除操作?`,
            onOk: () => {
                App.api('adm/ui/remove', { id }).then(() => {
                    message.success('删除成功');
                    let list = this.state.list;
                    this.setState({
                        list: U.array.remove(list, index)
                    });
                });
            },
            onCancel() {
            },
        });
    };

    setDefault = (id, type) => {
        Modal.confirm({
            title: `确认操作?`,
            onOk: () => {
                App.api('adm/ui/set_default', { id, type }).then(() => {
                    message.success(`设置成功`);
                    this.loadData();
                });
            },
            onCancel() {
            },
        });
    };

    render() {

        let { type = 1, list = [], loading } = this.state;
        console.log(type)
        return <div className="common-list">

            <BreadcrumbCustom first={CTYPE.link.setting_ui.txt} />

            <Card extra={<Button type="primary" icon="file-add" onClick={() => {
                this.edit({ id: 0, type });
            }}>新建模板</Button>}>

                <Tabs onChange={(v) => {
                    this.setState({
                        type: parseInt(v),
                        list: []
                    }, () => {
                        this.loadData();
                    });
                }} defaultActiveKey={type.toString()}>
                    {SettingUtils.UITypes.map((t, i) => {
                        let { type, label, disabled } = t;
                        return <TabPane disabled={disabled} tab={label} key={type} />;
                    })}
                </Tabs>

                <Table
                    columns={[{
                        title: '序号',
                        dataIndex: 'id',
                        className: 'txt-center',
                        render: (col, row, i) => i + 1
                    }, {
                        title: '名称',
                        dataIndex: 'title',
                        className: 'txt-center'
                    }, {
                        title: '创建时间',
                        dataIndex: 'createdAt',
                        className: 'txt-center',
                        render: (createdAt) => {
                            return U.date.format(new Date(createdAt), 'yyyy-MM-dd HH:mm');
                        }
                    }, {
                        title: '状态',
                        dataIndex: 'isDefault',
                        className: 'txt-center',
                        render: (isDefault) => {
                            if (isDefault === 1) {
                                return <Tag color="#2db7f5">启用</Tag>;
                            } else {
                                return <Tag color='red'>停用</Tag>;
                            }
                        }
                    }, {
                        title: '操作',
                        dataIndex: 'option',
                        className: 'txt-center',
                        render: (obj, ui, index) => {
                            let { id, isDefault } = ui;
                            return <Dropdown overlay={<Menu>
                                <MenuItem key="1">
                                    <a onClick={() => this.edit(ui)}>编辑</a>
                                </MenuItem>
                                {isDefault !== 1 &&
                                    <MenuItem key="2">
                                        <a onClick={() => this.setDefault(id, type)}>启用</a>
                                    </MenuItem>}
                                {isDefault !== 1 && <MenuItem key="3">
                                    <a onClick={() => this.setDefault(id, type)}>设为默认</a>
                                </MenuItem>}
                                {isDefault !== 1 && <MenuItem key="4">
                                    <a onClick={() => this.remove(id, index)}>删除</a>
                                </MenuItem>}
                            </Menu>} trigger={['click']}>
                                <a className="ant-dropdown-link">
                                    操作 <Icon type="down" />
                                </a>
                            </Dropdown>;
                        }

                    }]}
                    rowKey={(item) => item.id}
                    dataSource={list}
                    loading={loading} />
            </Card>
        </div>;
    }
}
