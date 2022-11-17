import React, {Component} from 'react';
import {App, CTYPE, U, Utils} from "../../common";
import SceneDrawer from "./SceneDrawer";
import {Avatar, Input, Modal, Tag} from "antd";
import ScenePicker from "./ScenePicker"
import SceneTypeEdit from "./SceneTypeEdit";
import SceneModal from "./SceneModal";


let ShoppingUtils = (() => {

    let basicColumns = (sceneTypes) => {
        return [{
            title: '序号',
            dataIndex: 'id',
            className: 'txt-center',
            render: (col, row, i) => i + 1
        }, {
            title: '标题',
            dataIndex: 'title',
            className: 'txt-center'
        }, {
            title: '封面',
            dataIndex: 'img',
            className: 'txt-center',
            render: (img) => {
                return <Avatar shape="square" src={img} size={40}/>
            }
        }, {
            title: '商品',
            dataIndex: 'product',
            className: 'txt-center',
            render: (product, scene, indesx) => {
                let {products = []} = scene;
                return <a onClick={() => {
                    ShoppingUtils.sceneModal(products)
                }}>【{products.length}】</a>
            }
        }, {
            title: '分类',
            dataIndex: 'type',
            className: 'txt-center',
            render: (type, scene, index) => {
                return ShoppingUtils.getSceneTypeName(sceneTypes, type)
            }
        }, {
            title: '状态',
            dataIndex: 'status',
            className: 'txt-center',
            render: ((obj, scene, index) => {
                let {status} = scene;
                return <div> {Utils.common.byte2status(status)}</div>
            })
        }, {
            title: '创建时间',
            dataIndex: 'createdAt',
            className: 'txt-center',
            render: ((obj, scene, index) => {
                let {createdAt} = scene;
                return <div>{U.date.format(new Date(createdAt), 'yyyy-MM-dd HH:mm:ss')} </div>
            })
        }]

    };

    let loadSceneType = (component) => {

        App.api('adm/sceneType/allTypes').then((sceneTypes) => {
            component.setState({sceneTypes})

        })

    };

    let getSceneTypeName = (sceneTypes, typeId) => {
        if (!typeId) {
            return;
        }
        let typeName = '';
        sceneTypes.map((type, index) => {
            let {id, name} = type;
            if (id === typeId) {
                typeName = name;
            }
        })
        return typeName;
    };

    let sceneModal = (items) => {
        Utils.common.renderReactDOM(<SceneModal items={items}/>)
    };

    let sceneDrawer = (scene) => {
        Utils.common.renderReactDOM(<SceneDrawer scene={scene}/>)
    };

    let scenePicker = (items, syncItems, withOption) => {
        Utils.common.renderReactDOM(<ScenePicker items={items} syncItems={syncItems} withOption={withOption}/>)
    };

    let sceneTypeEdit = (sceneType, loadData) => {
        Utils.common.renderReactDOM(<SceneTypeEdit sceneType={sceneType} loadData={loadData}/>)
    };


    return {sceneDrawer, sceneModal, loadSceneType, basicColumns, scenePicker, getSceneTypeName, sceneTypeEdit};

})();

export default ShoppingUtils;