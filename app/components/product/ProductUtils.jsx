import React from 'react';
import { Breadcrumb, Tag } from 'antd';
import { U, Utils } from "../../common";
import App from "../../common/App";
import ProductPicker from "./ProductPicker";
import TemplateDrawer from '../template/TemplateDrawer';

let ProductUtils = (() => {


    let currentProductPageKey = 'key-product-pageno';
    let currentTemplatePageKey = 'key-template-pageno';
    let currentBrandPageKey = 'key-brand-pageno';

    let setProductCurrentPage = (pageno) => {
        Utils._setCurrentPage(currentProductPageKey, pageno);
    };

    let getProductCurrentPage = () => {
        return Utils._getCurrentPage(currentProductPageKey);
    };

    let setTemplateCurrentPage = (pageno) => {
        Utils._setCurrentPage(currentTemplatePageKey, pageno);
    };

    let getTemplateCurrentPage = () => {
        return Utils._getCurrentPage(currentTemplatePageKey);
    };

    let setBrandCurrentPage = (pageno) => {
        Utils._setCurrentPage(currentBrandPageKey, pageno);
    };

    let getBrandCurrentPage = () => {
        return Utils._getCurrentPage(currentBrandPageKey);
    };
     let templateDrawer = (productList, index) => {
        Utils.common.renderReactDOM(<TemplateDrawer productList={productList} index={index}/>)
      }

    let renderCategoryNames = (productCategories, id) => {

        let ret = [];
        if (!productCategories || productCategories.length === 0) {
            return ret;
        }

        if (!id || id === 0) {
            return ret;
        }

        let sequence = '';
        productCategories.map((t1) => {
            if (t1.id === id) {
                sequence = t1.sequence;
            }
            t1.children.map((t2) => {
                if (t2.id === id) {
                    sequence = t2.sequence;
                }
                t2.children.map((t3) => {
                    if (t3.id === id) {
                        sequence = t3.sequence;
                    }
                })
            })
        });

        if (U.str.isEmpty(sequence)) {
            return ret;
        }

        productCategories.map((t1, index1) => {
            if (t1.sequence.substr(0, 2) === sequence.substr(0, 2)) {
                ret.push(<Breadcrumb.Item key={index1}>{t1.title}</Breadcrumb.Item>);
                t1.children.map((t2, index2) => {
                    if (t2.sequence.substr(0, 4) === sequence.substr(0, 4)) {
                        ret.push(<Breadcrumb.Item key={`${index1}-${index2}`}>{t2.title}</Breadcrumb.Item>);
                        t2.children.map((t3, index3) => {
                            if (t3.sequence === sequence) {
                                ret.push(<Breadcrumb.Item
                                    key={`${index1}-${index2}-${index3}`}>{t3.title}</Breadcrumb.Item>);
                            }
                        })
                    }
                })
            }
        });

        return <Breadcrumb separator=">">{ret}</Breadcrumb>

    };

    let renderProductCategories = (productCategories, productCategorySequences) => {


        if (!productCategories || productCategories.length === 0) {
            return null;
        }

        let arr = [];
        productCategorySequences.map((sequence, index) => {
            let ret = [];
            productCategories.map((t1, index1) => {
                if (t1.sequence.substr(0, 2) === sequence.substr(0, 2)) {
                    ret.push(t1.title);
                    t1.children.map((t2, index2) => {
                        if (t2.sequence.substr(0, 4) === sequence.substr(0, 4)) {
                            ret.push(t2.title);
                            t2.children.map((t3, index3) => {
                                if (t3.sequence === sequence) {
                                    ret.push(t3.title);
                                }
                            })
                        }
                    })
                }
            });
            if (ret.length > 0) {
                arr.push(<Tag style={{ margin: '4px' }} key={index}>{ret}</Tag>);
            }
        });

        return arr;

    };


    let parseSequence = (s) => {
        return s.substring(0, 2) + '-' + s.substring(2, 4) + '-' + s.substring(4, 6);
    };

    let loadProductCategories = (component, disable) => {
        App.api('adm/product/findAllCategories').then((productCategories) => {
            productCategories.map((t1) => {

                let { id, sequence, name, children = [], status } = t1;
                t1.key = parseSequence(sequence);
                t1.value = sequence;
                t1.title = (status === 2 ? '[已下架]' : '') + name;
                t1.disabled = disable;
                children.map((t2) => {
                    let { id, sequence, name, children = [], status } = t2;

                    t2.key = parseSequence(sequence);
                    t2.value = sequence;
                    t2.title = (status === 2 ? '[已下架]' : '') + name;
                    t2.disabled = disable;
                    children.map((t3) => {
                        let { id, sequence, name, status } = t3;

                        t3.key = parseSequence(sequence);
                        t3.value = sequence;
                        t3.title = (status === 2 ? '[已下架]' : '') + name;
                    })
                })

            });
            component.setState({ productCategories });
    
        });
    };

    let getCategoryName = (productCategories, sequence, withParent = true) => {
        if (!sequence) {
            return;
        }
        let name = '', t1Name = '', t2Name = '';
        productCategories.map((t1) => {
            let { children = [] } = t1;
            if (t1.sequence === sequence) {
                name = t1.name
            }
            children.map((t2) => {
                if (t2.sequence === sequence) {
                    name = t2.name
                }
                let { children = [] } = t2;
                children.map((t3) => {
                    if (t3.sequence === sequence) {
                        name = t3.name;
                        t1Name = t1.name;
                        t2Name = t2.name;
                    }
                })

            })

        });
        return withParent ? t1Name + '>' + t2Name + '>' + name : name;

    };

    let productPicker = (items, syncItems, multi) => {
        Utils.common.renderReactDOM(<ProductPicker items={items} syncItems={syncItems} multi={multi} />)
    };


    return {
        setProductCurrentPage,
        getProductCurrentPage,
        setTemplateCurrentPage,
        getTemplateCurrentPage,
        setBrandCurrentPage,
        getBrandCurrentPage,
        renderCategoryNames,
        loadProductCategories,
        renderProductCategories,
        getCategoryName,
        productPicker,
        templateDrawer,
    }

})();

export default ProductUtils;
