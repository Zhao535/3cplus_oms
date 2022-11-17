import React from 'react'

import App from '../../common/App.jsx'
import U from '../../common/U.jsx'
import {Button, Card, Input, message, Modal, Radio, Select} from 'antd';

import '../../assets/css/setting/home-ui.less'
import Sortable from 'sortablejs'
import SettingUtils from "../common/SettingUtils";
import ShoppingUtils from "../shopping/ShoppingUtils";
import ArticleUtils from "../article/ArticleUtils";
import ProductUtils from "../product/ProductUtils";
import BrandUtils from "../brand/BrandUtils";
import CategoryUtils from "../category/CategoryUtils";
import MerchantUtils from "../merchant/MerchantUtils";
import SecKillUtils from "../secKill/SecKillUtils";

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const {Option} = Select;

export default class UIEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            type: parseInt(this.props.match.params.type),
            id: parseInt(this.props.match.params.id),

            allComponents: SettingUtils.UIComponentTypes,
            actions: SettingUtils.linkActions,

            homeComps: [],

            shakeIndex: -1,

            currModuleIndex: -1,
            currModuleKey: '',

        };
    }

    componentDidMount() {
        this.loadData();
    }

    loadData = () => {

        let {id} = this.state;
        if (!id) {
            return;
        }
        App.api('/adm/ui/ui', {id}).then((result) => {
                console.log(result);
                this.setState({
                    title: result.title,
                    homeComps: result.components,
                }, () => {
                    this.filterHomeModules();
                });
            }
        );
    };

    syncBanner = (obj) => {

        let cindex = obj.cindex;
        let item = this.getItemByKey(null, cindex) || {};

        let {list = []} = item;
        if (obj.index === -1) {
            list.push(obj);
        } else {
            list[obj.index] = obj;
        }
        item.list = list;
        this.setItem(item, cindex);
    };

    itemSortListener = (index) => {
        let banners_saved = document.getElementById('item_sorter_' + index);
        if (banners_saved) {
            let sortable = Sortable.create(banners_saved, {
                dataIdAttr: 'data-id',
                store: {
                    get: () => {
                        let list = this.getItemByKey(null, index).list || [];
                        let sort = [];
                        list.map((s) => {
                            sort.push(JSON.stringify(s));
                        });
                        return sort;
                    },
                    set: (sortable) => {
                        let sort = sortable.toArray();
                        let list = [];
                        sort.map((s) => {
                            list.push(JSON.parse(s));
                        });

                        let item = this.getItemByKey(null, index);
                        item.list = list;
                        this.setItem(item, index);
                    }
                },
                onEnd: () => {
                    setTimeout(() => {
                        let list = this.getItemByKey(null, index).list || [];
                        let sort = [];
                        list.map((s) => {
                            sort.push(JSON.stringify(s));
                        });
                        sortable.sort(sort);
                    }, 10);
                },
            });
        }
    };

    save = () => {

        let error = false;
        let {id, type, title, homeComps = []} = this.state;
        for (let i = 0, flag = true; i < homeComps.length; flag ? i++ : i) {

            flag = true;
            let am = homeComps[i];
            let key = am.key;
            if ((key === 'BANNER' || key === 'AD') && (!am.list || am.list.length === 0)) {
                message.error('序号为' + (i + 1) + ' 的组件 ' + this.getItemByKey(key, i).name + ' 自定义内容未设置');
                error = true;
            } else if (U.str.isEmpty(am.title)) {
                message.error('序号为' + (i + 1) + ' 的组件 ' + this.getItemByKey(key, i).name + ' 标题未填写');
                error = true;
            } else if (!am.list || am.list.length === 0) {
                message.error('序号为' + (i + 1) + ' 的组件 ' + this.getItemByKey(key, i).name + ' 自定义内容未设置');
                error = true;
            }

            if (error) {
                return;
            }
        }
        this.setState({homeComps});

        let restbuy = homeComps.find(value => value.key === 'BESTBUY') || {};
        if (restbuy.list && restbuy.list.length % 2 !== 0) {
            message.error(`添加${restbuy.title}的数量应为偶数`);
            return;
        }
        let sales = homeComps.find(value => value.key === 'SALES') || {};
        if (sales.list && sales.list.length < 3) {
            message.error(`添加${sales.title}的数量不应小于3`);
            return;
        }
        let atlas = homeComps.find(value => value.key === 'ATLAS') || {};
        if (atlas.list && atlas.list.length % 3 !== 0) {
            message.error(`添加的${atlas.title}数量应为3的倍数`);
            return;
        }
        App.api('/adm/ui/save', {
            ui: JSON.stringify({
                id,
                type,
                title,
                components: homeComps
            })
        }).then(() => {
            message.success('首页配置已保存');
            App.go(`/app/setting/uis/${type}`)
        });
    };

    show = (common, index, key, val) => {

        this.setState({
            currModuleIndex: index,
            currModuleKey: common ? key : '',
            [key]: !common ? (val ? val : false) : false,
        }, () => {
            if (['BANNER', 'AD', 'BRAND', 'MERCHANT', 'CATEGORY', 'SALES', 'BESTBUY', 'NAV', 'CASE', 'ATLAS', 'ARTISAN', 'ARTICLE', 'SCENE'].includes(key) && val) {
                this.itemSortListener(index);
            }
        })
    };

    filterHomeModules = () => {
        let {homeComps = [], allComponents = []} = this.state;

        allComponents.map((am) => {
            homeComps.map((m) => {
                if (am.key === m.key) {
                    m.name = am.name;
                    //防止广告位被强制写入标题
                    if (m.key !== 'AD') {
                        m.title = m.title || am.name;
                    }
                    m.rand = U.str.randomString(4);//!!!加入随机码防止comp相同时sort组件挂掉
                }
            });
        });

        homeComps.map((m, i) => {
            m.listStyle = m.listStyle || 1;
            m.commonComp = !['AD', 'BANNER'].includes(m.key);
            m.withStyle = ['BESTBUY'].includes(m.key);
            m.withTitle = ['MERCHANT', 'SALES', 'BRAND', 'BESTBUY', 'ARTICLE', 'ARTISAN', 'CASE', 'ATLAS', 'SCENE'].includes(m.key);
            m.withMore = ['SALES', 'BRAND', 'BESTBUY', 'ARTICLE', 'ARTISAN', 'CASE', 'ATLAS'].includes(m.key);
            m.withSortName = ['MERCHANT'].includes(m.key);
        });

        this.setState({
            homeComps
        }, () => {
            this.homeCompsSortListener();
        })
    };

    addHomeComp = (am) => {
        let homeComps = this.state.homeComps;
        let shakeIndex = Math.min(homeComps.length, 2);

        homeComps = U.array.insert(homeComps, shakeIndex, {...am, title: am.name});

        this.setState({
            homeComps,
            shakeIndex,
        }, () => {
            console.log('addHomeComp', this.state.homeComps);
            this.filterHomeModules();
            this.show(true, shakeIndex, am.key, true);
        })
    };

    removeHomeComp = (index) => {
        this.setState({
            shakeIndex: index
        });
        Modal.confirm({
            title: `确认删除组件?`,
            onOk: () => {
                let {homeComps = []} = this.state;
                if (homeComps.length === 1) {
                    message.info('请最少保留一个类别');
                    return;
                }
                this.setState({
                    homeComps: U.array.remove(homeComps, index),
                    currModuleIndex: -1,
                    currModuleKey: ''
                }, () => {
                    this.filterHomeModules();
                })
            },
            onCancel: () => {
            },
        });
    };

    homeCompsSortListener = () => {
        let home_comps = document.getElementById('home_comps');
        if (home_comps) {
            let sortable = Sortable.create(home_comps, {
                dataIdAttr: 'data-id',
                store: {
                    get: () => {
                        let {homeComps = []} = this.state;
                        let sort = [];
                        homeComps.map((s) => {
                            sort.push(JSON.stringify(s));
                        });
                        return sort;
                    },
                    set: (sortable) => {
                        let sort = sortable.toArray();
                        let homeComps = [];
                        sort.map((s) => {
                            homeComps.push(JSON.parse(s));
                        });
                        this.setState({
                            homeComps,
                            //强制清理组件当前选定值，防止窜数据
                            currModuleIndex: -1, currModuleKey: '',
                        });
                    }
                },
                onEnd: () => {
                    setTimeout(() => {
                        let {homeComps = []} = this.state;
                        let sort = [];
                        homeComps.map((s) => {
                            sort.push(JSON.stringify(s));
                        });
                        sortable.sort(sort);
                    }, 10);
                },
            });
        }
    };

    getItemByKey = (k, index) => {
        let homeComps = this.state.homeComps || [];
        let item = {};
        if (index > -1) {
            return homeComps[index];
        } else {
            homeComps.map((c) => {
                if (c.key === k) {
                    item = c;
                }
            });
        }
        return item;
    };

    setItem = (item, index) => {

        let {homeComps = []} = this.state;
        if (index > -1) {
            homeComps[index] = item;
        } else {
            homeComps.map((c) => {
                if (c.key === item.key) {
                    c = item;
                }
            });
        }
        this.setState({
            homeComps
        })
    };

    syncItems = (items) => {
        console.log(items);
        let {homeComps = [], currModuleIndex} = this.state;
        let item = homeComps[currModuleIndex];
        item.list = items;
        this.setState({
            homeComps
        })
    };

    render() {

        let {allComponents = [], homeComps = [], title, currModuleIndex, currModuleKey, type} = this.state;
        console.log(homeComps);
        console.log(currModuleKey);
        let isBanner = currModuleKey === 'BANNER';
        let isAd = currModuleKey === 'AD';
        let isBrand = currModuleKey === 'BRAND';
        let isCategory = currModuleKey === 'CATEGORY';
        let isMerchant = currModuleKey === 'MERCHANT';
        let isArticle = currModuleKey === 'ARTICLE';
        let isNav = currModuleKey === 'NAV';
        let isArtisan = currModuleKey === 'ARTISAN';
        let isCase = currModuleKey === 'CASE';
        let isAtlas = currModuleKey === 'ATLAS';
        let isProduct = ['SALES', 'BESTBUY'].includes(currModuleKey);
        let isScene = currModuleKey === 'SCENE';
        let isSecKill = currModuleKey === 'SECKILL';

        let currItem = this.getItemByKey(currModuleKey, currModuleIndex) || {};

        let {list = []} = currItem;
        return <div className="home-ui-page">

            <Card extra={<Button type="primary" icon="save" onClick={() => this.save()}>保存配置</Button>}>

                <div style={{minWidth: '1000px'}}>

                    <Card title="添加组件" style={{width: '250px', float: 'left'}}>
                        <div className="label-type">页面名称</div>
                        <Input defaultValue={title} value={title}
                               onChange={(e) => this.setState({title: e.target.value})}/>

                        <div className="label-type">内容组件</div>
                        <ul className='all-modules'>
                            {allComponents.map((m, i) => {
                                return <li style={{width: "45%", marginRight: "5%"}} key={i} onClick={() => {
                                    this.addHomeComp(m)
                                }}><p>{m.name}</p><i/></li>
                            })}
                        </ul>
                    </Card>

                    <div className='preview-block'>
                        <div className='preview-page'>

                            <ul className='modules' id='home_comps'>
                                {homeComps.map((m, i) => {

                                    let bg_className = m.key;
                                    if (m.withStyle) {
                                        bg_className += '-' + m.listStyle;
                                    }

                                    let className = currModuleIndex === i ? ' highlightborder' : '';

                                    return <li key={i}
                                               data-id={JSON.stringify(m)}
                                               className={className}
                                               onClick={() => this.show(true, i, m.key, true)}>
                                        <div className='close' onClick={() => this.removeHomeComp(i)}/>

                                        {m.withTitle &&
                                        <div className='sub-title'><p>{m.title}</p><p>{m.subHeading}</p>{m.withMore &&
                                        <a className='more'>更多</a>}</div>}
                                        <div className={bg_className}/>

                                    </li>
                                })}
                            </ul>

                        </div>
                    </div>

                    {currModuleIndex > -1 && <Card title={currItem.name} style={{width: '400px', float: 'left'}}>

                        <div className='common-module-form'>

                            {currItem.withTitle && <div className='line'>
                                <p className='required'>显示标题</p>
                                <Input value={currItem.title} maxLength={24} className='input-wide' onChange={(e) => {
                                    currItem.title = e.target.value;
                                    this.setItem(currItem, currModuleIndex);
                                }}/>

                                <p className='required'>显示副标题</p>
                                <Input value={currItem.subHeading} maxLength={24} className='input-wide'
                                       onChange={(e) => {
                                           currItem.subHeading = e.target.value;
                                           this.setItem(currItem, currModuleIndex);
                                       }}/>
                            </div>}

                            {currItem.withSortName && <div className='line'>
                                <p className='required'>商品规则</p>
                                <Select value={currItem.contentSortPropertyName || 'id'} style={{flex: 1}}
                                        onChange={(v) => {
                                            currItem.contentSortPropertyName = v;
                                            this.setItem(currItem, currModuleIndex);
                                        }}>
                                    <Option value='id'>请选择</Option>
                                    <Option value='pubAt'>最新上架</Option>
                                    <Option value='salesCount'>销量最高</Option>
                                    <Option value='priority'>权重最高</Option>
                                </Select>
                            </div>}

                            <div className='line'>
                                <Button type="primary" icon="file-add" onClick={() => {
                                    if (isBanner || isAd) {
                                        let banner = {
                                            index: -1,
                                            cindex: currModuleIndex,
                                            act: 'NONE',
                                            type: currModuleKey
                                        };
                                        SettingUtils.bannerEdit(type, banner, this.syncBanner);
                                    } else if (isBrand) {
                                        BrandUtils.brandPicker(list, this.syncItems);
                                    } else if (isCategory) {
                                        CategoryUtils.categoryPicker(list, this.syncItems);
                                    } else if (isMerchant) {
                                        MerchantUtils.merchantPicker(list, this.syncItems, true);
                                    } else if (isProduct) {
                                        ProductUtils.productPicker(list, this.syncItems, true);
                                    } else if (isArticle) {
                                        ArticleUtils.articlePicker(list, this.syncItems)
                                    } else if (isNav) {
                                        let nav = {
                                            index: -1,
                                            cindex: currModuleIndex,
                                        };
                                        SettingUtils.navEdit(nav, this.syncBanner)
                                    } else if (isArtisan) {
                                        SettingUtils.artisanPicker(list, this.syncItems)
                                    } else if (isCase) {
                                        SettingUtils.casePicker(list, this.syncItems)
                                    } else if (isAtlas) {
                                        SettingUtils.atlasPicker(list, this.syncItems)
                                    } else if (isScene) {
                                        ShoppingUtils.scenePicker(list, this.syncItems)
                                    } else if (isSecKill) {
                                        SecKillUtils.secKillPicker(list, this.syncItems)
                                    }
                                }}>添加内容</Button>
                            </div>

                            {/* {currItem.withStyle && <div className='line'>
                                <p className='required' style={{clear: 'both'}}>展示样式</p>

                                <RadioGroup onChange={(e) => {
                                    currItem.listStyle = e.target.value;
                                    this.setItem(currItem, currModuleIndex);
                                }} value={currItem.listStyle}>
                                    <RadioButton
                                        value={1}>盒子样式</RadioButton>
                                    <RadioButton value={2}>列表样式</RadioButton>
                                </RadioGroup>

                            </div>} */}

                            {(isBanner || isAd) && <ul className='banners' id={`item_sorter_${currModuleIndex}`}>
                                {list.map((b, i) => {

                                    return <li key={i} data-id={JSON.stringify(b)}>
                                        <div className='img'><img src={b.img}/>
                                            <i className='close' onClick={() => {
                                                currItem.list = U.array.remove(list, i);
                                                this.setItem(currItem, currModuleIndex);
                                            }}/>
                                            <i className='edit'
                                               onClick={() => {
                                                   b.index = i;
                                                   b.cindex = currModuleIndex;
                                                   b.type = currModuleKey;
                                                   SettingUtils.bannerEdit(type,b, this.syncBanner);
                                               }}/>
                                        </div>
                                        <p>
                                            跳转：{SettingUtils.parseAct(b)}
                                        </p>
                                    </li>
                                })}
                            </ul>}

                            {(isCategory || isBrand || isMerchant || isNav || isArtisan || isAtlas) &&
                            <ul className='banners categories' id={`item_sorter_${currModuleIndex}`}>
                                {list.map((b, i) => {
                                    return <li key={i} data-id={JSON.stringify(b)}>
                                        <div className='img'><img
                                            src={b.logo || b.icon || b.avatar || (b.imgs && b.imgs[0])}/>
                                            <i className='close' onClick={() => {
                                                currItem.list = U.array.remove(list, i);
                                                this.setItem(currItem, currModuleIndex);
                                            }}/>
                                        </div>
                                        {(isMerchant || isNav || isArtisan) && <p>
                                            {b.name}
                                        </p>}
                                    </li>
                                })}
                            </ul>}

                            {isProduct && <ul className='products' id={`item_sorter_${currModuleIndex}`}>
                                {list.map((item, i) => {
                                    let {specs = [], title} = item;
                                    let imgs = specs.length > 0 ? specs[0].imgs : [];
                                    return <li key={i} data-id={JSON.stringify(item)}>
                                        <img key={imgs[0]} src={imgs[0]}/>
                                        <div className='title'>
                                            {title}
                                        </div>
                                        <a className='opt' onClick={() => {
                                            currItem.list = U.array.remove(list, i);
                                            this.setItem(currItem, currModuleIndex);
                                        }}>删除</a>
                                    </li>
                                })}

                            </ul>}

                            {(isArticle || isCase) && <ul className='products' id={`item_sorter_${currModuleIndex}`}>
                                {list.map((b, i) => {
                                    return <li key={i} data-id={JSON.stringify(b)}>
                                        <img src={(b.picture || b.img)}/>
                                        <div className='title'>
                                            {b.title}
                                        </div>
                                        <a className='opt' onClick={() => {
                                            currItem.list = U.array.remove(list, i);
                                            this.setItem(currItem, currModuleIndex);
                                        }}>删除</a>
                                    </li>
                                })}

                            </ul>}

                            {(isScene) && <ul className='products' id={`item_sorter_${currModuleIndex}`}>
                                {list.map((b, i) => {
                                    return <li key={i} data-id={JSON.stringify(b)}>
                                        <img style={{width: '60px', height: '60px'}} src={(b.picture || b.img)}/>
                                        <div className='title'>
                                            {b.title}
                                        </div>
                                        <a className='opt' onClick={() => {
                                            currItem.list = U.array.remove(list, i);
                                            this.setItem(currItem, currModuleIndex);
                                        }}>删除</a>
                                    </li>
                                })}
                            </ul>}
                            {(isSecKill) && <ul className='products' id={`item_sorter_${currModuleIndex}`}>
                                {list.map((b, i) => {
                                    let {product = {}} = b;
                                    let {specs = []} = product;
                                    let {imgs = []} = specs[0];
                                    return <li key={i} data-id={JSON.stringify(b)}>
                                        <img style={{width: '60px', height: '60px'}} src={imgs[0]}/>
                                        <div className='title'>
                                            {b.title}
                                        </div>
                                        <a className='opt' onClick={() => {
                                            currItem.list = U.array.remove(list, i);
                                            this.setItem(currItem, currModuleIndex);
                                        }}>删除</a>
                                    </li>
                                })}
                            </ul>}

                            {/*{isSelect && <ul className='line'>*/}
                            {/*<p className='required'>搜索提示</p>*/}
                            {/*<Input value={currItem.placeholder} placeholder='请输入搜索提示' maxLength={10}*/}
                            {/*className='input-wide'*/}
                            {/*onChange={(e) => {*/}
                            {/*currItem.placeholder = e.target.value;*/}
                            {/*this.setItem(currItem, currModuleIndex);*/}
                            {/*}}/>*/}
                            {/*</ul>}*/}

                        </div>
                    </Card>}


                    <div className='clearfix'/>

                </div>

            </Card>
        </div>
    }
}
