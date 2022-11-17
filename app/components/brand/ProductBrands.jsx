import React from 'react';
import BreadcrumbCustom from "../../common/BreadcrumbCustom";
import {Link} from "react-router-dom";
import {CTYPE, Utils, U} from "../../common";
import {
    Avatar,
    Button,
    Card,
    Dropdown,
    Icon,
    Menu,
    Table,
    Tabs,
    Tag,
    notification,
    Modal,
    Divider,
    Pagination
} from "antd";
import Search from "antd/es/input/Search";
import {App} from "../../common";
import "../../assets/css/merchant/productBrands.less"
import ProductUtils from "../product/ProductUtils";
import BrandUtils from "./BrandUtils";

const {TabPane} = Tabs;

const tabList = [
    {
        key: '0',
        tab: '全部',
    },
    {
        key: '1',
        tab: '启用',
    }, {
        key: '2',
        tab: '停用',
    }, {
        key: '3',
        tab: '待审核',
    }
];


export default class ProductBrands extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            qo: {},
            brands: [],
            brand: {},
            pagination: {
                current: 1,
                pageSize: 10,
                total: 0,
            },
            productCategories: [],
            loading: false,
        }
    }

    componentDidMount() {
        ProductUtils.loadProductCategories(this, true)
        this.loadData({})
    }

    onTabChange = (key) => {
        let {qo = {}} = this.state;
        this.setState({
            qo: {
                ...qo,
                status: parseInt(key)
            }
        }, this.loadData)
    }


    edit = (brand) => {
        App.go(`/app/product/brand-edit/${brand.id}`)
    }

    loadData = () => {
        this.setState({loading: true})
        let {qo, pagination = {}} = this.state;
        let {current, pageSize} = pagination;
        qo.pageNumber = current;
        qo.pageSize = pageSize;
        console.log(qo)
        App.api(`adm/product/brands`, {qo: JSON.stringify(qo)}).then((res) => {
            let pagination = Utils.pager.convert2Pagination(res) || {};
            console.log(pagination)
            this.setState({brands: res.content, pagination: pagination, loading: false})
        })
    }

    changeStatus = (brand) => {
        Modal.confirm({
            title: (brand.status === 1 ? '确认封禁' : '确认启用'),
            onOk: () => {
                App.api(`adm/product/changeStatus`, {id: brand.id}).then(() => {
                    notification.open({
                        message: '提示:',
                        description: brand.status === 1 ? '封禁成功' : '启用成功'
                    })
                    this.loadData({})
                })
            }

        })
    }


    render() {
        let {brands = [], qo, pagination = {}, productCategories = [], loading} = this.state;
        let {current, total} = pagination;
        console.log(current, total);
        let imgs = [];
        brands.map(brand => {
            let {logo} = brand;
            imgs.push(logo)
        })
        return <div className={'product-brands'}>
            <BreadcrumbCustom first={CTYPE.link.product_brands.txt}/>

            <Card tabList={tabList} onTabChange={key => {
                this.onTabChange(key)
            }}>
                <div className={'brand-top'}>
                    <Button onClick={() => this.edit({id: 0})} type={"primary"}><Icon
                        type={'plus-circle'}/>添加品牌</Button>
                    <Search placeholder={'请输入名称查询'} style={{width: '200px', float: 'right'}} onChange={(e) => {
                        this.setState({
                            qo: {
                                ...qo,
                                name: e.target.value
                            }
                        })
                    }} onSearch={this.loadData}/>
                    <div className="clearfix-h20"/>
                    <Table columns={[
                        ...BrandUtils.basicColumn(productCategories),
                        {
                            title: '操作',
                            className: 'txt-center',
                            render: (obj, brand, index) => {
                                return <React.Fragment>
                                    <a onClick={() => this.edit(brand)}>编辑</a>
                                    <Divider type="vertical"/>
                                    <a onClick={() => this.changeStatus(brand)}>{brand.status === 1 ? '停用' : '启用'}</a>
                                </React.Fragment>
                            }
                        }
                    ]} rowKey={(item) => item.id}
                           dataSource={brands}
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
        </div>

    }

}

