import React, {Component} from 'react';
import {App, U, Utils} from "../../common";
import ArticlePicker from "./AtriclePicker";

let ArticleUtils = (() => {

    let articlePicker = (items, syncItems) => {
        Utils.common.renderReactDOM(<ArticlePicker items={items} syncItems={syncItems}/>)
    };

    return {articlePicker};

})();


export default ArticleUtils;