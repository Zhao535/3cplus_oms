import React, {Component} from 'react';
import {App, U, Utils} from "../../common";
import BrandPicker from "./BrandPicker";
import {Avatar, Tag} from "antd";
import ProductUtils from "../product/ProductUtils";

let BrandUtils = (() => {

    let  basicColumn = (productCategories)=>{
        return [
            {
                title: '序号',
                dataIndex: 'id',
                className: 'txt-center',
                render: (col, row, i) => i + 1
            }, {
                title: 'LOGO',
                dataIndex: 'logo',
                className: 'txt-center',
                render: (logo, brand, index) => {
                    return <a> <Avatar shape="square" src={logo} size={60} icon="user"/> </a>
                }
            }, {
                title: '名称',
                dataIndex: 'name',
                className: 'txt-center'
            }, {
                title: '类别',
                dataIndex: 'categories',
                className: 'txt-center',
                render: (obj, brand, index) => {
                    let {sequences = []} = brand;
                    return <div>
                        {
                            sequences.map((sequence, index) => {
                                return <span key={index}><Tag
                                    color={'green'}>{ProductUtils.getCategoryName(productCategories, sequence, false)}</Tag></span>
                            })
                        }
                    </div>
                }
            }, {
                title: '状态',
                dataIndex: 'status',
                className: 'txt-center',
                render: ((obj, brand, index) => {
                    let {status} = brand;
                    return <div><Tag
                        color={(status === 1) ? "blue" : "red"}> {Utils.common.byte2status(status)}</Tag></div>
                })
            }, {
                title: '创建时间',
                dataIndex: 'createdAt',
                className: 'txt-center',
                render: ((obj, brand, index) => {
                    let {createdAt} = brand;
                    return <div>{U.date.format(new Date(createdAt), 'yyyy-MM-dd HH:mm:ss')} </div>
                })
            },
        ]
    };


    let brandPicker = (items, syncItems) => {
        Utils.common.renderReactDOM(<BrandPicker items={items} syncItems={syncItems}/>);
    };

    return {brandPicker,basicColumn};

})();

export default BrandUtils;