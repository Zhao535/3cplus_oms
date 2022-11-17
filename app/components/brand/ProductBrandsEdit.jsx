import React from 'react';
import { Button, Card, Form, Icon, Input, InputNumber, message, TreeSelect } from "antd";
import { App, CTYPE, Utils, U } from "../../common";
import { PosterEdit } from "../../common/CommonEdit";
import BreadcrumbCustom from "../../common/BreadcrumbCustom";
import data from "../merchant/data";
import { Link } from "react-router-dom";
import ProductUtils from '../product/ProductUtils';

const TreeNode = TreeSelect;
const FormItem = Form.Item;
const { SHOW_PARENT } = TreeSelect;

class ProductBrandsEdit extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            id: parseInt(this.props.match.params.id),
            brand: {},
            productCategories: []
        }
    }

    componentDidMount() {
        this.loadData()
        ProductUtils.loadProductCategories(this, false);
    }

    loadData = () => {
        let { id } = this.state;
        {
            id &&
                App.api(`adm/product/item`, { id: id }).then((brand) => {
                    this.setState({
                        brand: brand
                    })
                })
        }
        App.api(`adm/product/findAllCategories`).then((res) => {
            this.setState({ data: res })
        })
    }

    onChange = value => {
        console.log('onChange ', value);
        this.setState({ value });
    };


    handleSubmit = () => {
        let { brand = {} } = this.state;
        let { sequences = [] } = brand;
        if (sequences.length < 1) {
            message.warning("请选择适用范围")
        } else if (U.str.isEmpty(brand.name)) {
            message.warning('请输入名称')
        } else if ((brand.name).length > 20) {
            message.warning('名称长度不能超过20')
        } else if (U.str.isEmpty(brand.logo)) {
            message.warning('请上传logo')
        } else {
            App.api('adm/product/saveProductBrand', { brand: JSON.stringify(brand) }).then(() => {
                message.success('保存成功');
                App.go(`/app/merchant/product-brands`)
            })
        }
    }


    render() {
        let { brand = {}, data = [], productCategories = [] } = this.state;
        let { sequences = [] } = brand;
        return <div className={'brand-edit'}>
            <BreadcrumbCustom first={<Link to={CTYPE.link.product_brands.path}>{CTYPE.link.product_brands.txt}</Link>}
                second={brand.id ? '编辑品牌' : '添加品牌'} />
            <Card extra={<Button type="primary" icon="save" onClick={() => {
                this.handleSubmit();
            }}>保存</Button>}>
                <FormItem
                    required={true}
                    {...CTYPE.formItemLayout} label='品牌名称'>
                    <Input.TextArea rows={1} value={brand.name} placeholder="输入品牌名称" maxLength={140}
                        onChange={(e) => {
                            this.setState({
                                brand: {
                                    ...brand,
                                    name: e.target.value
                                }
                            });
                        }} />
                </FormItem>
                <PosterEdit title='logo' type='s' img={brand.logo} required={true} syncPoster={(url) => {
                    this.setState({
                        brand: {
                            ...brand,
                            logo: url
                        }
                    });
                }} />

                <FormItem
                    required={true}
                    {...CTYPE.formItemLayout} label='适用范围'>
                    <TreeSelect treeData={productCategories} allowClear={true} value={sequences} treeCheckable={true}
                        showCheckedStrategy={SHOW_PARENT}
                        style={{ width: '200px' }} onChange={value => this.setState({
                            brand: {
                                ...brand,
                                sequences: value
                            }
                        }, () => console.log(value))} />

                </FormItem>

                <FormItem
                    required={true}
                    {...CTYPE.formItemLayout} label='权重'>
                    <InputNumber rows={1} min={1} value={brand.priority} style={{ width: '100px' }}
                        onChange={(e) => {
                            this.setState({
                                brand: {
                                    ...brand,
                                    priority: e
                                }
                            })
                        }} />
                </FormItem>
            </Card>
        </div>

    }

}

export default ProductBrandsEdit;