import React from "react";
import { App, Utils } from "../../common";
import { Modal, Table, Tag, Input } from "antd";

const id_dev = 'category_coupon_picker';

export default class CategoryCouponPicker extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            list: [],
            loading: false,
            categoryChoose: this.props.category

        };
    }

    componentDidMount() {
        this.loadData();
    }

    loadData = () => {
        this.setState({ loading: true });
        App.api('adm/product/findAllCategories').then((list) => {
            list.map((item) => {
                item.children = null;
            });
            let list1 = list.filter(v => v.status === 1) || [];
            this.setState({
                list: list1, loading: false
            });
        });
    };

    close = () => {
        Utils.common.closeModalContainer(id_dev);
    };

    singleClick = (category) => {
        this.props.syncItems(category);
        this.close()
    };

    render() {

        let { list = [], loading, categoryChoose = {} } = this.state;
        console.log(categoryChoose);

        return <Modal
            getContainer={() => Utils.common.createModalContainer(id_dev)}
            visible={true}
            title={'请选择产品分类'}
            width='1000px'
            maskClosable={false}
            onCancel={this.close}
            footer={null}>
            <div className='common-list'>
                <Table
                    columns={[{
                        title: '序号',
                        dataIndex: 'id',
                        className: 'txt-center',
                        render: (col, row, i) => i + 1
                    }, {
                        title: 'LOGO',
                        dataIndex: 'icon',
                        className: 'txt-center ',
                        render: (icon, item, index) => {
                            return <img key={index} className='square-logo' src={icon} />
                        }
                    }, {
                        title: '名称',
                        dataIndex: 'name',
                        className: 'txt-center',
                    }, {
                        title: '状态',
                        dataIndex: 'status',
                        className: 'txt-center',
                        render: (status) => {
                            switch (status) {
                                case 1:
                                    return <Tag color="#2db7f5">启用</Tag>;
                                case 2:
                                    return '停用';
                            }
                        }
                    }, {
                        title: '操作',
                        dataIndex: 'option',
                        className: 'txt-center',
                        render: (obj, category, index) => {

                            let alreadyChoose = category.id === categoryChoose.id;
                            return <span>
                                <a style={{ color: alreadyChoose ? "#ff0000" : "#1890FF", cursor: alreadyChoose ? "auto" : "pointer" }} onClick={() => {
                                    if (!alreadyChoose) { this.singleClick(category) }
                                }}>{alreadyChoose ? "已选择" : "选择"}</a>
                            </span>
                        }

                    }]} rowKey={(item) => item.id} dataSource={list} loading={loading} />
            </div>
        </Modal>
    }

}