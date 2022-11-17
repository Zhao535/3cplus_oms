import React from 'react';
import {Modal, Table} from "antd";
import {Utils, U} from "../../common";

const id_div_secKill_modal = "id_div_secKill_modal";

class SecKillModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            product: this.props.product || {},
            secKillSpec: this.props.secKillSpec || [],

        }
    }

    componentDidMount() {
    }


    close = () => {
        Utils.common.closeModalContainer(id_div_secKill_modal);
    }


    render() {
        let {product = {}, secKillSpec = []} = this.state;
        let {name} = product;
        return <Modal
            getContainer={() => Utils.common.createModalContainer(id_div_secKill_modal)}
            visible={true}
            title={name}
            width='1000px'
            maskClosable={false}
            onCancel={this.close}
            footer={null}>
            <Table columns={[
                {
                    title: '图片',
                    dataIndex: 'imgs',
                    className: 'txt-center',
                    render: (obj, item) => {
                        let {sno} = item;
                        let {specs = []} = product;
                        let spe = specs.find(s => s.sno === sno) || {};
                        let {imgs = []} = spe;
                        return <img style={{width: '60px', height: '60px'}} src={imgs[0]}/>

                    }
                },

                {
                    title: '规格名称',
                    dataIndex: 'sno',
                    className: 'txt-center',
                    render: (sno) => {
                        let {specs = []} = product;
                        let spe = specs.find(s => s.sno === sno) || {};
                        let {params = []} = spe;
                        return <div>
                            <span>{params[0] && params[0].value}{params.length > 1 && params[1].value}</span>
                        </div>
                    }
                },

                {
                    title: '秒杀价',
                    dataIndex: 'price',
                    className: 'txt-center',
                    render: (price) => {
                        return <div>{U.price.cent2yuan(price)}</div>
                    }
                },
                {
                    title: '数量',
                    dataIndex: 'num',
                    className: 'txt-center',
                    render: (num) => {
                        return <div>{num}</div>
                    }
                }
            ]} dataSource={secKillSpec} pagination={false} size={"small"}/>

        </Modal>
    }
}

export default SecKillModal;