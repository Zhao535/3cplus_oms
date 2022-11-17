import React from "react";
import {App, Utils} from "../../common";
import {Modal, Table, Tag, Input} from "antd";

const InputSearch = Input.Search
const id_div_category = 'div-dialog-category-picker';

export default class CategoryPicker extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            items: this.props.items,
            list: [],
            loading: false
        };
    }

    componentDidMount() {
        this.loadData();
    }

    loadData = () => {
        this.setState({loading: true});
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
        Utils.common.closeModalContainer(id_div_category);
    };

    singleClick = (item) => {
        console.log(item);
        let {items = []} = this.state;
        items.push(item);
        this.setState({
            items
        });
        this.props.syncItems(items);
    };

    render() {

        let {items = [], list = [], loading} = this.state;

        console.log(items);

        return <Modal
            getContainer={() => Utils.common.createModalContainer(id_div_category)}
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
                            return <img key={index} className='square-logo' src={icon}/>
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
                        render: (obj, brand, index) => {
                            let has = items.find(item => item.id === brand.id) || {};
                            return <span>
                                    {!has.id && <a onClick={() => {
                                        this.singleClick(brand)
                                    }}>选择</a>}
                            </span>
                        }

                    }]} rowKey={(item) => item.id} dataSource={list} loading={loading}/>
            </div>
        </Modal>
    }

}
