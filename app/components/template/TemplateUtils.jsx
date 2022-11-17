import React, {Component} from 'react';
import ProductCategoriesEdit from "../category/ProductCategoriesEdit";
import {U, Utils} from "../../common";
import TemplateDrawer from "./TemplateDrawer";
import ProductUtils from "../product/ProductUtils";

let TemplateUtils = (() => {

    let basicColumn =(productCategories,template)=>{

        return [{
            title: '序号',
            dataIndex: 'id',
            className: 'txt-center',
            render: (col, row, i) => i + 1
        }, {
            title: '类别',
            dataIndex: 'sequence',
            className: 'txt-center',
            render: ((categoryId, template, index) => {
                return <span>{ProductUtils.getCategoryName(productCategories, template.sequence)}</span>
            })

        }, {
            title: '产品名称',
            dataIndex: 'title',
            className: 'txt-center',
        }, {
            title: '图片',
            dataIndex: 'img',
            className: 'txt-center',
            render: (obj, template, index) => {
                let {specs = []} = template;
                let images = [];
                specs.map((spec, index) => {
                    let {imgs = []} = spec;
                    imgs.map((img, index) => {
                        images.push(img)
                    })
                })
                return <img style={{width: '60px', height: '60px'}} src={images[0]}
                            onClick={() => Utils.common.showImgLightbox(images)}/>

            }
        },
            {
                title: '规格',
                dataIndex: 'specs_count',
                className: 'txt-center',
                width: '80px',
                render: (obj, product, index) => {
                    let length = product.specs.length
                    return <p style={{color: '#1890FF', cursor: 'pointer'}}
                              onClick={() => {
                                ProductUtils.templateDrawer(template, index)
                              }}>【{length}】</p>
                  }
                
            }, {
                title: '参数',
                dataIndex: 'params_count',
                className: 'txt-center',
                width: '80px',
                render: (obj, product, index) => {
                    let length = product.specs.length
                    return <p style={{color: '#1890FF', cursor: 'pointer'}}
                              onClick={() => {
                                ProductUtils.templateDrawer(template, index)
                              }}>【{length}】</p>
                  }
            },
            {
                title: '创建时间',
                dataIndex: 'createdAt',
                className: 'txt-center',
                render: (obj, merchant, index) => {
                    return <span>{U.date.format(new Date(merchant['createdAt'] || 0), 'yyyy-MM-dd HH:mm:ss')}</span>
                }
            }, {
                title: '状态',
                dataIndex: 'status',
                className: 'txt-center',
                render: (obj, template, index) => {
                    let {status} = template;
                    return <span>{Utils.common.byte2status(template.status)}</span>
                }
            },]
    };


    let editCategories = (self, parent, level, length, loadData) => {
        Utils.common.renderReactDOM(<ProductCategoriesEdit self={self} parent={parent} level={level} length={length}
                                                           loadData={loadData}/>)
    };

    let templateDrawer = (template) => {
        Utils.common.renderReactDOM(<TemplateDrawer template={template}/>)
    };


    return {editCategories, templateDrawer,basicColumn}


})();

export default TemplateUtils;