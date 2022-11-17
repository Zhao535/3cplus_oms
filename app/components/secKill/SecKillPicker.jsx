import React from 'react';
import { Modal, Table, Tag } from "antd";
import { CTYPE, U, Utils } from "../../common";
import SecKillUtils from "./SecKillUtils";

const id_div_secKill = 'id_div_secKill';

export default class SecKillPicker extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            items: this.props.items,
            multi: this.props.multi,
            secKills: [],
            pagination: { current: 0, pageSize: 10, total: 0 },
            qo: {},
        }
    }

    componentDidMount() {
        this.loadData();
    }

    loadData = () => {
        let { pagination = {}, qo = {} } = this.state;
        let { current, pageSize } = pagination;
        qo.pageNumber = current;
        qo.pageSize = pageSize;
        SecKillUtils.loadSecKill(this, qo);
    }

    handleTableChange = (pagination) => {
        this.setState({
            pagination
        }, this.loadData)
    }

    singleClick = (item) => {
        this.props.syncItems([item]);
        this.close()
    };

    multiClick = (item) => {
        let { items = [] } = this.state;
        items.push(item);
        this.setState({
            items
        });
        this.props.syncItems(items);
    };

    close = () => {
        Utils.common.closeModalContainer(id_div_secKill)
    }

    render() {
        let { pagination = {}, loading, secKills = [], items = [], multi = true } = this.state;
        return (
            <Modal
                getContainer={() => Utils.common.createModalContainer(id_div_secKill)}
                visible={true}
                title={'请选择秒杀活动'}
                width='1000px'
                maskClosable={false}
                onCancel={this.close}
                footer={null}>
                <Table
                    columns={[
                        ...SecKillUtils.basicColumns
                        , {
                            title: '操作',
                            dataIndex: 'option',
                            className: 'txt-center',
                            width: '90px',
                            render: (obj, secKill, index) => {
                                let has = items.find(s => s.id === secKill.id);
                                return <span>{!has && <a onClick={() => {
                                    if (multi) {
                                        this.multiClick(secKill)
                                    } else {
                                        this.singleClick(secKill)
                                    }
                                }}>选择</a>}
                                </span>
                            }

                        }]}
                    rowKey={(item) => item.id}
                    dataSource={secKills}
                    pagination={{ ...pagination, ...CTYPE.commonPagination }}
                    loading={loading} onChange={this.handleTableChange} />
            </Modal>
        );
    }
}