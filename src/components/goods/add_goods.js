import React from 'react';
import Home from '../home/home';
import {Form,Icon,Input,Button,Card,Select,message,Breadcrumb,Upload} from 'antd';
import {Redirect,Link} from 'react-router-dom';
const FormItem = Form.Item;
const Option = Select.Option;
message.config({
    duration:5
})
class GoodsAddBox extends React.Component{
    constructor(){
        super();
        this.state={
            cate:[],
            r:false
        }
    }
    componentDidMount(){
        fetch('/get_cates',{credentials:'include'})
            .then(res=>res.json())
            .then(data=>{
                if(data.code===4){
                    message.error(data.message);
                }else{
                    this.setState({
                        cate:data
                    })
                }
            })
    }
    submit(){
        this.props.form.validateFields((err,value)=>{
            if(!err){
                fetch('/add_goods1',{
                    credentials:'include',
                    method:'post',
                    headers:{
                        'Content-Type':'application/json'
                    },
                    body:JSON.stringify(value)
                }).then(res=>res.json())
                    .then(data=>{
                        if(data.code===4){
                            message.error(data.message)
                        }else{
                            this.setState({
                                r:true
                            })
                        }
                    })
            }
        })
    }
    render(){
        let style = {
            labelCol:{span:2,offset:6},
            wrapperCol:{span:10}
        }
        const{getFieldDecorator}=this.props.form;
        const{cate}=this.state;
        const cates = cate.map(v=>(
            <Option value={v.cid.toString()} key={v.cid}>{v.cname}</Option>
        ));
        return(
            <div>
                {
                    this.state.r?(
                        <Redirect to="/admin/goods/goods_manager"/>
                    ):(
                        <Form onSubmit={(e)=>{e.preventDefault();this.submit()}}>
                            <FormItem label="选择分类" {...style} hasFeedback>
                                {getFieldDecorator('cate_id', {
                                    rules: [
                                        { required: true, message: '请选择分类' },
                                    ],
                                })(
                                    <Select placeholder="选择分类">
                                        {cates}
                                    </Select>
                                )}
                            </FormItem>
                            <FormItem label="商品名称" {...style}>
                                {
                                    getFieldDecorator('name',{
                                        rules:[{required:true}]
                                    })(
                                        <Input prefix={<Icon type="lock"/>} autoComplete="off"/>
                                    )
                                }
                            </FormItem>
                            <FormItem label="商品图片" {...style}>
                                {
                                    getFieldDecorator('pic',{
                                        rules:[{required:true}]
                                    })(
                                        <Upload
                                            name="file"
                                            action="/upload_goods"
                                            withCredentials={true}
                                        >

                                            <Button>
                                                <Icon type="upload" />
                                                点击上传
                                            </Button>
                                        </Upload>
                                    )
                                }
                            </FormItem>
                            <FormItem label="商品价格" {...style}>
                                {
                                    getFieldDecorator('price',{
                                        rules:[{required:true}]
                                    })(
                                        <Input prefix={<Icon type="lock"/>} autoComplete="off"/>
                                    )
                                }
                            </FormItem>
                            <FormItem label="商品描述" {...style}>
                                {
                                    getFieldDecorator('desc',{
                                        rules:[{required:true}]
                                    })(
                                        <Input prefix={<Icon type="lock"/>} autoComplete="off"/>
                                    )
                                }
                            </FormItem>
                            <FormItem wrapperCol={{offset:8}}>
                                <Button type="primary" htmlType="submit">
                                    添加
                                </Button>
                            </FormItem>
                        </Form>
                    )
                }
            </div>
        )
    }
}
const AddForm = Form.create()(GoodsAddBox)
class GoodsAdd extends React.Component{
    render(){
        return(
            <Home selected="goods_add">
                <Card title={
                    <Breadcrumb>
                        <Breadcrumb.Item>
                            <Link to="/admin"><Icon type="home" /></Link>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>
                            <Icon type="user" />
                            <span>添加商品</span>
                        </Breadcrumb.Item>
                    </Breadcrumb>
                }>
                    <AddForm/>
                </Card>
            </Home>
        )
    }
}
export default GoodsAdd;