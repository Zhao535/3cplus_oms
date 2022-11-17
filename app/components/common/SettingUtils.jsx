import React from 'react';
import Utils from "../../common/Utils";
import { BannerEdit, NavEdit } from "./SettingComps";
import ProductPicker from "../product/ProductPicker";
import MerchantPicker from "../merchant/MerchantPicker";
import BrandPicker from "../brand/BrandPicker";
import ScenePicker from "../shopping/ScenePicker";
import ArticlePicker from "../article/AtriclePicker";
import SecKillPicker from "../secKill/SecKillPicker";
import CategoryPicker from '../category/CategoryPicker';




let SettingUtils = (() => {

    const UITypes = [{ type: 1, label: '首页', disabled: false }, { type: 2, label: '新品上架', disabled: false }, {
        type: 3,
        label: '限时特惠',
        disabled: false
    }];

    const UIComponentTypes = [
        {
            "key": "BANNER",
            "name": "轮播图"
        },
        {
            "key": "NAV",
            "name": "二级导航"
        },
        {
            "key": "AD",
            "name": "广告位"
        },
        {
            "key": "BESTBUY",
            "name": "热销"
        },

        // {
        //     "key": "CATEGORY",
        //     "name": "一级分类"
        // },
        // {
        //     "key": "BRAND",
        //     "name": "品牌榜"
        // },
        {
            "key": "MERCHANT",
            "name": "推荐商家"
        },
        {
            "key": "SCENE",
            "name": "情景购"
        },
        // {
        //     "key": "SALES",
        //     "name": "特价商品"
        // },


        /*{
            "key": "ARTISAN",
            "name": "推荐达人"
        },
        {
            "key": "CASE",
            "name": "推荐案例"
        },
        {
            "key": "ATLAS",
            "name": "推荐图集"
        },*/
        {
            "key": "ARTICLE",
            "name": "推荐文章"
        },
        {
            "key": "SECKILL",
            "name": "秒杀活动"
        }
    ];

    const linkActions = [
        {
            "key": "NONE",
            "name": "无"
        },
        {
            "key": "LINK",
            "name": "链接"
        },
        {
            "key": "MERCHANT",
            "name": "商户"
        },
        {
            "key": "PRODUCT",
            "name": "商品详细"
        }, {
            "key": "SECKILL",
            "name": "秒杀活动"
        }

    ];

    let bannerEdit = (UIType, banner, syncBanner) => {
        Utils.common.renderReactDOM(<BannerEdit UIType={UIType} banner={banner} syncBanner={syncBanner} />);
    };

    let merchantPicker = (items, syncItems, multi) => {
        Utils.common.renderReactDOM(<MerchantPicker items={items} syncItems={syncItems} multi={multi} />);
    };

    let brandPicker = (items, syncItems) => {
        Utils.common.renderReactDOM(<BrandPicker items={items} syncItems={syncItems} />);
    };

    let categoryPicker = (items, syncItems) => {
        Utils.common.renderReactDOM(<CategoryPicker items={items} syncItems={syncItems} />);
    };

    let productPicker = (items, syncItems, multi) => {
        Utils.common.renderReactDOM(<ProductPicker items={items} syncItems={syncItems} multi={multi} />);
    };

    let articlePicker = (items, syncItems) => {
        Utils.common.renderReactDOM(<ArticlePicker items={items} syncItems={syncItems} />);
    };
    let navEdit = (nav, syncBanner) => {
        Utils.common.renderReactDOM(<NavEdit nav={nav} syncBanner={syncBanner} />);
    };

    let scenePiker = (items, syncItems) => {
        Utils.common.renderReactDOM(<ScenePicker items={items} syncItems={syncItems} />);
    };

    let parseAct = (b) => {
        let act = '';
        if (b.act === 'NONE') {
            act = '不跳转';
        } else if (b.act === 'LINK') {
            act = '跳转链接';
        } else {
            if (b.payload) {
                act = b.payload.title
            } else {
                act = (SettingUtils.linkActions.find(bn => bn.key === b.act) || {}).name;
            }
        }
        return act;
    };

    let seckillPicker = (items, syncItems,multi) => {
        Utils.common.renderReactDOM(<SecKillPicker items={items} syncItems={syncItems} multi={multi} />)
    }

    return {
        UITypes, UIComponentTypes, linkActions, bannerEdit, merchantPicker,
        brandPicker, categoryPicker, productPicker, articlePicker, navEdit,
        parseAct, scenePiker,seckillPicker
    }

})();

export default SettingUtils;
