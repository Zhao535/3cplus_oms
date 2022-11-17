import { Utils } from "../../common";
import CouponEdit from "./CouponEdit";
import React from "react";


let CouponUtils = (() => {

    let couponEdit = (item, loadData) => {
        Utils.common.renderReactDOM(<CouponEdit coupon={item} loadData={loadData}/>)
    }
    return { couponEdit };

})();
export default CouponUtils;