import React from 'react';
import {App, CTYPE, U, Utils} from "../../common";
import {Avatar, Col, Input, Modal, Row, Table, Tag} from "antd";
import ShoppingUtils from "./ShoppingUtils";
import ProductUtils from "../product/ProductUtils";

const InputSearch = Input.Search
const id_div_scene_modal = 'div-dialog-scene-modal';

export default class SceneModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            items: this.props.items,
            productCategories: [],

        }

    }

    componentDidMount() {
        ProductUtils.loadProductCategories(this)
    }


    close = () => {
        Utils.common.closeModalContainer(id_div_scene_modal);
    }


    render() {
        let {items = [], productCategories = []} = this.state;
        return <Modal
            getContainer={() => Utils.common.createModalContainer(id_div_scene_modal)}
            visible={true}
            title={'商品'}
            width='1000px'
            maskClosable={false}
            onCancel={this.close}
            footer={null}>
            <div className='common-list'>
                <Table columns={[
                    {
                        title: '序号',
                        dataIndex: 'id',
                        className: 'txt-center',
                        width: '60px',
                        render: (col, row, i) => i + 1
                    }, {
                        title: '类别',
                        dataIndex: 'sequence',
                        className: 'txt-center',
                        width: '300px',
                        render: (sequence, item) => {
                            return <div><Tag>{ProductUtils.getCategoryName(productCategories, sequence, false)}</Tag>
                            </div>
                        }
                    }, {
                        title: '产品名称',
                        dataIndex: 'name',
                        className: 'txt-center',
                        render: (name) => {
                            return <div className='product-title'>{name}</div>
                        }
                    }, {
                        title: '图片',
                        dataIndex: 'imgs',
                        className: 'txt-center',
                        render: (txt, item, index) => {
                            let {specs = []} = item;
                            let imgs = specs.length > 0 ? specs[0].imgs : [];
                            return <img key={imgs[0]} className='product-img' src={imgs[0]}/>
                        }
                    }, {
                        title: '创建时间',
                        dataIndex: 'createdAt',
                        className: 'txt-center',
                        width: '180px',
                        render: (createdAt) => {
                            return U.date.format(new Date(createdAt), 'yyyy-MM-dd HH:mm')
                        }
                    }, {
                        title: '状态',
                        dataIndex: 'status',
                        className: 'txt-center',
                        width: '60px',
                        render: (status) => {
                            return <div className="status">
                                {status === 1 ? <span>上架</span> : <span className="warning">下架</span>}</div>
                        }
                    },
                ]} rowKey={(item) => item.id}
                       dataSource={items}
                       pagination={false}
                />

            </div>

        </Modal>


    }
}
