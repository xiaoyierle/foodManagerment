import React from 'react';
import Home from '../home/home';
import {Form,Icon,Input,Button,Card,Select} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
class CateAddBox extends React.Component{
    constructor(){
        super();
        this.state={
            store:[]
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
                fetch('/add_cat',{
                    credentials:'include',
                    method:'post',
                    headers:{
                        'Content-Type':'application/json'
                    },
                    body:JSON.stringify(value)
                }).then(res=>res.json())
                    .then(data=>{
                        if(data==='ok'){
                            window.location.href="/goods/cate_edit";
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
        const{store}=this.state;
        const list = store.map(v=>(
            <Option value={v.id.toString()} key={v.id}>{v.name}</Option>
        ))
        return(
            <Form onSubmit={(e)=>{e.preventDefault();this.submit()}}>
                <FormItem label="选择店铺" {...style} hasFeedback>
                    {getFieldDecorator('id', {
                        rules: [
                            { required: true, message: '请选择店铺' },
                        ],
                    })(
                        <Select placeholder="选择店铺">
                            {list}
                        </Select>
                    )}
                </FormItem>
                <FormItem label="分类名称" {...style}>
                    {
                        getFieldDecorator('name',{
                            rules:[{required:true}]
                        })(
                            <Input prefix={<Icon type="lock"/>} autoComplete="off"/>
                        )
                    }
                </FormItem>
                <FormItem label="分类描述" {...style}>
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
const AddForm = Form.create()(CateAddBox)
class CateAdd extends React.Component{
    render(){
        return(
            <Home selected="cate_add">
                <Card title="添加分类">
                    <AddForm/>
                </Card>
            </Home>
        )
    }
}
export default CateAdd;