import React, {Component} from 'react';
import {Input, InputNumber, Modal, Form, message} from "antd";
import {PosterEdit} from "../../common/CommonEdit";
import {CTYPE, Utils, App, U} from "../../common";

const FormItem = Form.Item;
const id_div = 'editCategory'

class ProductCategoriesEdit extends Component {

    constructor(props) {
        super(props);
        this.state = {
            category: this.props.category || {},
            parent: this.props.parent || {},
            isCreat: this.props.isCreat,
            level: this.props.level,
            sequence: this.props.sequence,
            newCategory: {
                id: 0,
                name: '',
                icon: '',
                parentId: this.props.parent.id || 0,
                priority: 1,
            },


        }
    }


    close = () => {
        Utils.common.closeModalContainer(id_div)
    }

    onOk = () => {
        let {isCreat, newCategory, category, sequence, level, parent} = this.state;
        if (!isCreat) {
            newCategory = category;
        }
        let {name, icon, priority} = newCategory;
        isCreat && (newCategory.sequence = sequence);
        if (U.str.isEmpty(name)) {
            console.log('hhhh')
            message.warning('请输入分类名称')
        } else if ((U.str.isEmpty(icon) && (level !== 2))) {
            message.warning('请上传图片')
        } else if (!priority) {
            message.warning('请设置权重')
        } else {
            App.api(`adm/product/saveProductCategory`, {category: JSON.stringify(newCategory)}).then(() => {
                this.props.loadData();
                message.success('保存成功');
                this.close();
            })
        }
    }


    render() {
        let {category, isCreat, level, newCategory, sequence, parent} = this.state;
        console.log(sequence);
        console.log(parent.id)
        {
            !isCreat && (newCategory = category)
        }
        let {name, icon, priority} = newCategory;

        console.log(newCategory)
        return (
            <div>
                <Modal
                    title={(level === 0 || isCreat) ? "新建分类" : "编辑分类"}
                    getContainer={() => Utils.common.createModalContainer(id_div)}
                    visible={true}
                    width={'600px'}
                    maskClosable={false}
                    className="common-edit-page"
                    onOk={this.onOk}
                    onCancel={() => this.close()}>
                    <FormItem required={true} {...CTYPE.formItemLayout} label={"名称:"}>
                        <Input.TextArea rows={1} value={name} maxLength={500} onChange={(e) => {
                            {
                                isCreat ? this.setState({
                                    newCategory: {
                                        ...newCategory,
                                        name: e.target.value,
                                    }
                                }) : this.setState({
                                    category: {
                                        ...category,
                                        name: e.target.value,
                                    }
                                })
                            }
                        }}/>
                    </FormItem>
                    {level !== 2 &&
                    < FormItem required={true} {...CTYPE.formItemLayout} label={"图标:"}>
                        <PosterEdit type='s' img={icon} required={true} syncPoster={(url) => {
                            {
                                isCreat ? this.setState({
                                    newCategory: {
                                        ...newCategory,
                                        icon: url,
                                    }
                                }) : this.setState({
                                    category: {
                                        ...category,
                                        icon: url,
                                    }
                                })
                            }
                        }}/>
                    </FormItem>}
                    <FormItem required={true} {...CTYPE.formItemLayout} label={"权重:"}>
                        <InputNumber rows={1} value={priority} minLength={10} style={{width: '200px'}}
                                     onChange={(e) => {
                                         {
                                             isCreat ? this.setState({
                                                 newCategory: {
                                                     ...newCategory,
                                                     priority: e,
                                                 }
                                             }) : this.setState({
                                                 category: {
                                                     ...category,
                                                     priority: e,
                                                 }
                                             })
                                         }
                                     }}/>
                    </FormItem>
                </Modal>

            </div>
        );
    }
}

export default ProductCategoriesEdit;