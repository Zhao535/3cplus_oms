import {Utils, App, U} from "../../common";
import SecKillPicker from "./SecKillPicker";
import React from 'react';
import SecKillModal from "./SecKillModal";

let SecKillUtils = (() => {

    const basicColumns = [{
        title: '序号',
        dataIndex: 'id',
        className: 'txt-center',
        width: '60px',
        render: (col, row, i) => i + 1
    }, {
        title: '活动标题',
        dataIndex: 'title',
        className: 'txt-center',
        render: (title) => {
            return <div className='secKill-title'>{title}</div>
        }
    }, {
        title: '开始时间',
        dataIndex: 'startAt',
        className: 'txt-center',
        render: (obj, item, index) => {
            return <span>{U.date.format(new Date(obj), "yyyy-MM-dd HH:mm")}</span>
        }
    }, {
        title: '结束时间',
        dataIndex: 'endAt',
        className: 'txt-center',
        render: (obj, item, index) => {
            return <span>{U.date.format(new Date(obj), "yyyy-MM-dd HH:mm")}</span>
        }
    }, {
        title: '商品详情',
        dataIndex: 'info',
        className: 'txt-center',
        render: (obj, item, index) => {
            let {product = {}, secKillSpec = []} = item;
            let {name = ''} = product;
            return <a onClick={() => {
                SecKillUtils.secKillProductModal(secKillSpec, product)
            }} style={{color: '#009aa8'}}>【{secKillSpec.length}】</a>
        }
    }, {
        title: '状态',
        dataIndex: 'status',
        className: 'txt-center',
        render: (obj, item, index) => {
            return <span>{obj === 1 && '上架'}{obj === 2 && '下架'}</span>
        }
    }];

    let loadSecKill = (component, qo) => {
        App.api('/adm/secKill/secKills', {secKillQo: JSON.stringify(qo)}).then((result) => {
            component.setState({secKills: result.content, pagination: Utils.pager.convert2Pagination(result)})
        });
    };

    let secKillPicker = (items, syncItems) => {
        Utils.common.renderReactDOM(<SecKillPicker items={items} syncItems={syncItems}/>)
    };

    let secKillProductModal = (secKillSpec, product) => {
        Utils.common.renderReactDOM(<SecKillModal secKillSpec={secKillSpec} product={product}/>)
    }

    return {loadSecKill, secKillPicker, basicColumns, secKillProductModal};

})();

export default SecKillUtils;