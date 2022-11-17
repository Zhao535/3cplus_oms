import React from 'react';
import { Button, Card, Input, message, Modal, Tree, Form, InputNumber, notification, Icon } from "antd";
import _DATA from "../merchant/data";
import { App, CTYPE, Utils } from "../../common";
import BreadcrumbCustom from "../../common/BreadcrumbCustom";
import '../../assets/css/common/common-edit.less';
import '../../assets/css/merchant/MerchantCategories.less';
import MerchantUtils from '../merchant/MerchantUtils';


const FormItem = Form.Item;
const { data = [] } = _DATA
const { TreeNode } = Tree;
const { newCategories } = 'newCategories';

class ProductCategories extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            visible: false,
        }
    }

    componentDidMount() {
        this.loadData()
    }

    loadData = () => {
        App.api(`adm/product/findAllCategories`).then((res) => {
            this.setState({ data: res })
        })
    }

    changeCategoryStatus = (id, status) => {

        Modal.confirm({
            title: (status === 1 ? "确认上架" : "确认下架"),
            onOk: () => App.api(`adm/product/changeCategoriesStatus`, {
                categoryId: id, status: status
            }).then(() => this.loadData(),
                message.success(status === 1 ? '上架成功' : '下架成功')
            ),
            onCancel: () => { }
        })
    }

    makeSequence = (level, length1, length2, length3) => {
        let sequence = '';
        if (level === 1) {

            sequence = (length1 > 9 ? String(length1) : ('0' + String(length1))) + (length2 > 9 ? String(length2) : ('0' + String(length2))) + '00'
        }
        if (level === 2) {
            sequence = (length1 > 9 ? String(length1) : ('0' + String(length1))) + (length2 > 9 ? String(length2) : ('0' + String(length2))) + (length3 > 9 ? String(length3) : ('0' + String(length3)))
        }

        return sequence;
    }


    renderTitle = (self, parent, level, sequence) => {
        let { id, icon, name, priority, status } = self;
        let isUp = status === 1;
        return <div className={'categories-title'}
            style={{ width: level === 1 ? "600px" : level === 2 ? "582px" : "564px" }}>
            <span>{level}</span>
            {level !== 2 && <img src={icon} onClick={() => Utils.common.showImgLightbox(icon, 0)} />}
            <div className={'detail'}>
                <p>{name}</p>
                <label>权重:{priority} {status === 2 && <span>已下架</span>}</label>
            </div>
            <div className={'opt'}>
                <a onClick={() => this.changeCategoryStatus(id, (isUp ? 2 : 1))}>{isUp ? "下架" : "上架"}</a>
                {level !== 3 &&

                    <a onClick={() => {
                        MerchantUtils.editCategory({}, self, level + 1, true, sequence, this.loadData)
                    }}>新建子分类</a>}
                <a onClick={() => {
                    MerchantUtils.editCategory(self, parent, level, false, '', this.loadData)
                }}>编辑</a>
            </div>
        </div>
    }


    render() {
        let { categories = {}, data = [] } = this.state;
        console.log(data)
        return <div className={'categories'}>
            <BreadcrumbCustom first={CTYPE.link.product_categories.txt} />
            <Card extra={<Button type="primary" icon="file-add"
                onClick={() => MerchantUtils.editCategory({}, {}, 0, true, data.length > 9 ? String(data.length + 1) + '0000' : '0' + String(data.length + 1) + '0000', this.loadData)}>新建一级分类</Button>}>
                {data.length !== 0 &&
                    <Tree>
                        {data.map((category1, index1) => {
                            let { id, children = [] } = category1;
                            return <TreeNode
                                title={this.renderTitle(category1, {}, 1, this.makeSequence(1, index1 + 1, children.length + 1))}
                                key={id}>{
                                    children.map((category2, index2) => {
                                        let { id, children = [] } = category2;
                                        return <TreeNode
                                            title={this.renderTitle(category2, category1, 2, this.makeSequence(2, index1 + 1, index2 + 1, children.length + 1))}
                                            key={category2.id}>
                                            {children.map((category3, index3) => {
                                                let { id } = category3;
                                                return <TreeNode
                                                    title={this.renderTitle(category3, category2, 3, '')}
                                                    key={category3.id}>
                                                </TreeNode>
                                            })})
                                </TreeNode>
                                    })
                                } </TreeNode>
                        })}
                    </Tree>}
            </Card>
        </div>
    }
}

export default ProductCategories;