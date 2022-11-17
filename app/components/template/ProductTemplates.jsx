import React, {Component} from 'react';
import BreadcrumbCustom from "../../common/BreadcrumbCustom";
import {Link} from "react-router-dom";
import {App, CTYPE, U, Utils} from "../../common";
import {Avatar, Button, Card, Dropdown, Icon, Input, Menu, Table, Select, Modal, message, TreeSelect} from "antd";
import "../../assets/css/merchant/productTemplate.less"
import "./TemplateUtils"
import "./TemplateUtils"
import ProductUtils from "../product/ProductUtils";
import "../../assets/css/common/common-list.less"
import TemplateUtils from "./TemplateUtils";

const {Search} = Input;
const {Option} = Select;


class ProductTemplates extends Component {

    constructor(props) {
        super(props);
        this.state = {
            template: [],
            productCategories: [],
            qo: {},
            selectIds: [],
            selectedRows: [],
            loading: false,
        }

    }

    componentDidMount() {
        this.loadData();
        ProductUtils.loadProductCategories(this, true)
    }

    edit = (template) => {
        App.go(`/app/product/templates-edit/${template.id}`)
    }

    loadData = () => {
        this.setState({loading: true})
        let {qo} = this.state;
        App.api(`adm/product/findAllTemplate`, {qo: JSON.stringify(qo)}).then((res) => {
            this.setState({
                template: res.content,
                loading:false,
            })
        })
    }

    changeStatus = (template) => {
        Modal.confirm({
            title: "提示",
            content: (template.status !== 1 ? "确认启用" : "确认封禁"),
            onOk: () => {
                App.api(`adm/product/changeTemplateStatus`, {id: template.id}).then(() => {
                    this.loadData()
                    message.success(template.status !== 1 ? "启用成功" : "封禁成功")

                })
            },
            onCancel: () => {

            }


        })

    }


    reload = (key, value) => {
        let {qo} = this.state;
        qo[key] = value;
        this.setState({
            qo: qo,
        }, this.loadData)
    }

    render() {
        let {id, template = [], productCategories = [], qo, selectIds = [], selectedRows = [], loading} = this.state;
        return <div className={'template'}>
            <BreadcrumbCustom
                first={<Link to={CTYPE.link.product_templates.path}>{CTYPE.link.product_templates.txt}</Link>}/>
            <Card>
                <div className={'top'}>
                    <div className={'left'}>
                        <Button type={"primary"}
                                onClick={() => this.edit({id: 0})}><Icon
                            type={'file-add'}/>
                            添加</Button>
                        <Button
                            disabled={selectedRows.length <= 0}>{selectedRows.length <= 0 ? '批量删除' : `删除${selectedRows.length}条`}</Button>
                    </div>
                    <div className={'right'}>
                        <TreeSelect allowClear={true} treeCheckable={true} treeData={productCategories}
                                    placeholder={'请选择分类'}
                                    onChange={(value) => this.reload('categoryId', value)} style={{width: "300px"}}/>

                        <Select onChange={value => this.reload("status", value)} defaultValue="状态"
                                style={{width: '80px'}}>
                            <Option value="0">状态</Option>
                            <Option value="1">启用</Option>
                            <Option value="2">停用</Option>
                        </Select>

                        <Search onSearch={(value) => this.reload('title', value)} onChange={(e) => {

                        }} style={{width: '200px'}} placeholder={'输入名称查询'}/>
                    </div>
                </div>
                <div className="clearfix-h20"/>
                <Table rowSelection={{
                    onChange: (selectedRowKeys, selectedRows) => {
                        this.setState({
                            selectedRows: selectedRows
                        })

                    }
                }}
                       columns={[
                           ...TemplateUtils.basicColumn(productCategories, template),
                           {
                               title: '操作',
                               dataIndex: 'option',
                               className: 'txt-center',
                               render: (obj, template, index) => {
                                   return <Dropdown overlay={<Menu>
                                       <Menu.Item key="1">
                                           <a onClick={() => this.edit(template)}>编辑</a>
                                       </Menu.Item>
                                       <Menu.Item key="2">
                                           <a onClick={() => this.changeStatus(template)}>{template.status === 1 ? '停用' : '启用'}</a>
                                       </Menu.Item>

                                   </Menu>} trigger={['click']}>
                                       <a className="ant-dropdown-link">
                                           操作 <Icon type="down"/>
                                       </a>
                                   </Dropdown>
                               }

                           }]}
                       dataSource={template}
                       loading={loading}
                       rowKey={(item) => item.id}
                />

            </Card>
        </div>

    }
}

export default ProductTemplates;


