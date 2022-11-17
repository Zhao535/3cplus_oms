import React from 'react';
import {App, CTYPE, Utils, U} from "../../common";
import BreadcrumbCustom from "../../common/BreadcrumbCustom";
import {Link} from "react-router-dom";
import {Button, Card, Cascader, Icon, Input, TreeSelect, Form, InputNumber, Switch, message} from "antd";
import {PosterEdit} from "../../common/CommonEdit";
import {CommonPeriodSelector} from "../common/CommonComponents";
import HtmlEditor from "../../common/HtmlEditor";
import '../../assets/css/common/common-edit.less';

const FormItem = Form.Item

class ArticleEdit extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            id: parseInt(this.props.match.params.id),
            article: {
                status: 2,
            },

        }

    }


    componentDidMount() {
        this.loadData();
    }

    loadData = () => {
        let {id} = this.state;
        if (id) {
            App.api('adm/article/item', {id: id}).then((article) => {
                this.setState({article: article})
            })
        }

    }

    handleSubmit = () => {
        let {article} = this.state;
        let {id, title, intro, picture, pageView, supportNum, collectNum, status, content} = article;
        if (U.str.isEmpty(title)) {
            message.warn('请输入文章标题')

        } else if (title.length > 30 || title.length < 5) {
            message.warn('文章标题长度需要大于5个小于30个字符')

        } else if (U.str.isEmpty(intro)) {
            message.warn('请输入文章简介')

        } else if (intro.length > 50 || intro.length < 10) {
            message.warn('文章简介长度需要大于10个小于50个字符')

        } else if (U.str.isEmpty(content)) {
            message.warn('内容不能为空')

        } else {
            App.api(`adm/article/save`, {article: JSON.stringify(article)}).then(() => {
                message.success('保存成功');
                App.go('/app/article/articles');
            })
        }


    }


    render() {
        let {article} = this.state;
        let {id, title, intro, picture, pageView, supportNum, collectNum, status, content} = article;
        return (
            <div className="common-edit-page">
                <BreadcrumbCustom
                    first={<Link to={CTYPE.link.articles.path}>{CTYPE.link.articles.txt}</Link>}
                    second={id ? '编辑文章' : '新建文章'}/>

                <Card extra={<Button type="primary" icon="save" onClick={() => {
                    this.handleSubmit();
                }}>保存</Button>}>
                    <FormItem
                        required={true}
                        {...CTYPE.formItemLayout} label='文章标题'>
                        <Input.TextArea rows={1} placeholder="输入文章标题" maxLength={140}
                                        value={title}
                                        onChange={(e) => {
                                            this.setState({
                                                article: {
                                                    ...article,
                                                    title: e.target.value
                                                }
                                            });
                                        }}/>
                    </FormItem>
                    <FormItem
                        required={true}
                        {...CTYPE.formItemLayout} label='文章简介'>
                        <Input.TextArea rows={1} placeholder="输入文章简介" maxLength={140}
                                        value={intro}
                                        onChange={(e) => {
                                            this.setState({
                                                article: {
                                                    ...article,
                                                    intro: e.target.value
                                                }
                                            });
                                        }}/>
                    </FormItem>

                    <PosterEdit title='封面图' type='s' img={picture}  required={true} syncPoster={(url) => {
                        article.picture = url;
                        this.setState({
                            article: article
                        });
                    }}/>

                    <FormItem
                        {...CTYPE.formItemLayout} label='浏览量'>
                        <InputNumber min={0} rows={1} maxLength={14}
                                     value={pageView}
                                     onChange={(e) => {
                                         this.setState({
                                             article: {
                                                 ...article,
                                                 pageView: e
                                             }
                                         });
                                     }}/>
                    </FormItem>


                    <FormItem
                        {...CTYPE.formItemLayout} label='点赞量'>
                        <InputNumber min={0} rows={1} maxLength={140}
                                     value={supportNum}
                                     onChange={(e) => {
                                         this.setState({
                                             article: {
                                                 ...article,
                                                 supportNum: e
                                             }
                                         });
                                     }}/>
                    </FormItem>
                    <FormItem
                        {...CTYPE.formItemLayout} label='收藏量'>
                        <InputNumber min={0} rows={1} maxLength={140}
                                     value={collectNum}
                                     onChange={(e) => {
                                         this.setState({
                                             article: {
                                                 ...article,
                                                 collectNum: e
                                             }
                                         });
                                     }}/>
                    </FormItem>
                    <FormItem required={true} {...CTYPE.formItemLayout} label='上架'>
                        <Switch defaultChecked={false} onChange={(checked, event) => {
                            {
                                checked ? (status = 1) : (status = 2)
                            }
                            this.setState({
                                article: {
                                    ...article,
                                    status: status
                                }
                            })
                        }}/>
                    </FormItem>

                    <FormItem required={false} {...CTYPE.formItemLayout} label='产品介绍'>
                        <HtmlEditor content={content} syncContent={(content) => {
                            this.setState({
                                article: {
                                    ...article,
                                    content: content
                                }
                            })

                        }}/>
                    </FormItem>
                </Card>
            </div>
        );
    }
}

export default ArticleEdit;