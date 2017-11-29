import React from 'react';
import Home from '../home/home';
import {Form,Icon,Input,Button,Card,Breadcrumb,Upload} from 'antd';
import {Link,Redirect} from 'react-router-dom';
const FormItem = Form.Item;
class AddFormBox extends  React.Component{
    constructor(){
        super();
        this.state={
            r:false
        }
    }
    submit(){
        this.props.form.validateFields((err,value)=>{
            if(!err){
                fetch('/add_store',{
                    credentials:'include',
                    method:'post',
                    headers:{
                        'Content-Type':'application/json'
                    },
                    body:JSON.stringify(value)
                }).then(res=>res.json())
                    .then(data=>{
                        if(data==='ok'){
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
        return(
            <div>
                {
                    this.state.r?(
                        <Redirect to="/admin/store/info"/>
                    ):(
                        <Form onSubmit={(e)=>{e.preventDefault();this.submit()}}>
                            <FormItem label="店铺名称" {...style}>
                                {
                                    getFieldDecorator('name',{
                                        rules:[{required:true}]
                                    })(
                                        <Input prefix={<Icon type="lock"/>} autoComplete="off"/>
                                    )
                                }
                            </FormItem>
                            <FormItem label="店铺图片" {...style}>
                                {
                                    getFieldDecorator('pic',{
                                        rules:[{required:true}]
                                    })(
                                        <Upload action="/file" name="pic" withCredentials={true}>
                                            <Button>
                                                <Icon type="upload" />
                                                点击上传
                                            </Button>
                                        </Upload>
                                    )
                                }
                            </FormItem>
                            <FormItem label="起送价" {...style}>
                                {
                                    getFieldDecorator('price',{
                                        rules:[{required:true}]
                                    })(
                                        <Input prefix={<Icon type="lock"/>} autoComplete="off"/>
                                    )
                                }
                            </FormItem>
                            <FormItem label="配送费" {...style}>
                                {
                                    getFieldDecorator('deliever',{
                                        rules:[{required:true}]
                                    })(
                                        <Input prefix={<Icon type="lock"/>} autoComplete="off"/>
                                    )
                                }
                            </FormItem>
                            <FormItem label="店铺简介" {...style}>
                                {
                                    getFieldDecorator('desc',{
                                        rules:[{required:true}]
                                    })(
                                        <Input prefix={<Icon type="lock"/>} autoComplete="off"/>
                                    )
                                }
                            </FormItem>
                            <FormItem label="店铺地址" {...style}>
                                {
                                    getFieldDecorator('address',{
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
const AddForm = Form.create()(AddFormBox)
class StoreAdd extends React.Component{
    render(){
        return(
            <Home selected="store_add">
                <Card title={<Breadcrumb>
                    <Breadcrumb.Item>
                        <Link to="/admin"><Icon type="home" /></Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        <Icon type="user" />
                        <span>添加店铺</span>
                    </Breadcrumb.Item>
                </Breadcrumb>}>
                    <AddForm/>
                </Card>
            </Home>
        )
    }
}
export default StoreAdd;