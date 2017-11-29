import React from 'react';
import Home from '../home/home';
import {Form,Icon,Input,Button,Card,Select} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
class GoodsAddBox extends React.Component{
    constructor(){
        super();
        this.state={
            store:[],
            cate:[]
        }
    }
    componentDidMount(){
        fetch('/get_store',{credentials:'include'})
            .then(res=>res.json())
            .then(data=>{
                this.setState({
                    store:data
                })
            })
    }
    submit(){
        this.props.form.validateFields((err,value)=>{
            if(!err){
                fetch('/add_goods',{
                    credentials:'include',
                    method:'post',
                    headers:{
                        'Content-Type':'application/json'
                    },
                    body:JSON.stringify(value)
                }).then(res=>res.json())
                    .then(data=>{
                        if(data==='ok'){
                            window.location.href="/goods/goods_add";
                        }
                    })
            }
        })
    }
    handleSelectChange = (value) => {
        console.log(value);
        fetch(`/add_goods_getcate?id=${value}`)
            .then(res=>res.json())
            .then(data=>{
                this.setState({
                    cate:data
                })
            })
        /*this.props.form.setFieldsValue({
            note: `Hi, ${value === 'male' ? 'man' : 'lady'}!`,
        });*/
    }
    render(){
        let style = {
            labelCol:{span:2,offset:6},
            wrapperCol:{span:10}
        }
        const{getFieldDecorator}=this.props.form;
        const{store,cate}=this.state;
        const list = store.map(v=>(
            <Option value={v.id.toString()} key={v.id}>{v.name}</Option>
        ))
        const cates = cate.map(v=>(
            <Option value={v.id.toString()} key={v.id}>{v.name}</Option>
        ));
        return(
            <Form onSubmit={(e)=>{e.preventDefault();this.submit()}}>
                <FormItem label="选择店铺" {...style} hasFeedback>
                    {getFieldDecorator('store_id', {
                        rules: [
                            { required: true, message: '请选择店铺' },
                        ],
                    })(
                        <Select placeholder="选择店铺" onChange={this.handleSelectChange}>
                            {list}
                        </Select>
                    )}
                </FormItem>
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
                            <Input prefix={<Icon type="lock"/>} autoComplete="off"/>
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
}
const AddForm = Form.create()(GoodsAddBox)
class GoodsAdd extends React.Component{
    render(){
        return(
            <Home selected="goods_add">
                <Card title="添加商品">
                    <AddForm/>
                </Card>
            </Home>
        )
    }
}
export default GoodsAdd;