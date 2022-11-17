import React, { Component } from 'react';
import { App, U, Utils } from "../../common";
import CategoryPicker from "./CategoryPicker";
import CategoryCouponPicker from "./CategoryCouponPicker";

let CategoryUtils = (() => {


    let categoryPicker = (items, syncItems) => {
        Utils.common.renderReactDOM(<CategoryPicker items={items} syncItems={syncItems} />);
    };

    let categoryCouponPicker = (category, syncItems) => {
        Utils.common.renderReactDOM(<CategoryCouponPicker category={category} syncItems={syncItems} />)
    }

    let categorys2List = (categories) => {
        let list = [];
        categories.map((item, index) => {
            list.push(item)
            let { children = [] } = item;
            children.map((item2, index2) => {
                list.push(item2)
                item2.children && item2.children.map((item3, index3) => {
                    list.push(item3)
                })
            })
        })

        return list;
    }

    return { categoryPicker, categoryCouponPicker,categorys2List };

})();

export default CategoryUtils;