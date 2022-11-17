import React from 'react';
import {CTYPE, U, Utils} from "../../common";
import MerchantPicker from "./MerchantPicker";
import ProductCategoriesEdit from "../category/ProductCategoriesEdit";
import MerchantDetail from "./MerchantDetail";
import { Avatar } from "antd";
import Renew from "./Renew";
import ResetMerchantAdminPwd from "./ResetMerchantAdminPwd";

let MerchantUtils = (() => {

    const basicColumns = [{
        title: '序号',
        dataIndex: 'id',
        className: 'txt-center',
        render: (col, row, i) => i + 1
    }, {
        title: 'logo',
        dataIndex: 'logo',
        className: 'txt-center',
        render: (logo => {
            return <Avatar shape="square" src={logo} size={40} icon="user"/>
        })
    }, {
        title: '商户名称',
        dataIndex: 'name',
        className: 'txt-center-name',
        render: (obj, merchant, index) => {
            let {id, name} = merchant;
            return <a onClick={() => {
                MerchantUtils.merchantDetail(id)
            }}>{name}</a>
        },
    }, {
        title: '到期时间',
        dataIndex: 'expiredAt',
        className: 'txt-center',
        render: (obj, merchant, index) => {
            return <span>{U.date.format(new Date(merchant['expiredAt'] || 0), 'yyyy-MM-dd HH:mm:ss')}</span>
        }
    }, {
        title: '店铺地址',
        dataIndex: 'location',
        className: 'txt-center',
        render: (obj, merchant, index) => {
            let {location} = merchant;
            return <span>{location['poiaddress']}</span>
        }
    }, {
        title: '手机号',
        dataIndex: 'mobile',
        className: 'txt-center'
    }, {
        title: '状态',
        dataIndex: 'status',
        className: 'txt-center',
        render: (obj, merchant, index) => {
            let {status} = merchant;
            return <span>{Utils.common.byte2status(status)}</span>
        }
    }
    ];

    let merchantPicker = (items, syncItems, multi) => {
        Utils.common.renderReactDOM(<MerchantPicker items={items} syncItems={syncItems} multi={multi}/>);
    };

    let editCategory = (category, parent, level, isCreat, sequence, loadData) => {
        Utils.common.renderReactDOM(<ProductCategoriesEdit category={category} parent={parent} level={level}
                                                           isCreat={isCreat} sequence={sequence} loadData={loadData}/>)

    };

    let merchantDetail = (merchantId) => {
        Utils.common.renderReactDOM(<MerchantDetail merchantId={merchantId}/>);
    };

    let merchantRenew = (id,reloadData) => {
        Utils.common.renderReactDOM(<Renew id={id} reloadData={reloadData}/>)
    }
    
    let resetMerchantAdminPwd = (mobile) => {
        Utils.common.renderReactDOM(<ResetMerchantAdminPwd mobile={mobile}/>)
    }


    return {
        merchantPicker, editCategory, merchantDetail, basicColumns,merchantRenew,resetMerchantAdminPwd
    };


})();


export default MerchantUtils;
