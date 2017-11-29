import React from 'react';
import Home from '../home/home';
import {Form,Icon,Input,Button,Card,message,Breadcrumb} from 'antd';
import {Redirect,Link} from 'react-router-dom';
const FormItem = Form.Item;
message.config({
    duration:5
})
class CateAddBox extends React.Component{
    constructor(){
        super();
        this.state={
            r:false
        }
    }
    submit(){
        this.props.form.validateFields((err,value)=>{
            if(!err){
                fetch('/add_cate1',{
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
                        }else{

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
                   this.state.r?
                       (
                           <Redirect to="/admin/goods/cate_manager"/>
                       ):(
                           <Form onSubmit={(e)=>{e.preventDefault();this.submit()}}>
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
           </div>
        )
    }
}
const AddForm = Form.create()(CateAddBox)
class CateAdd extends React.Component{
    render(){
        return(
            <Home selected="cate_add">
                <Card title={
                    <Breadcrumb>
                        <Breadcrumb.Item>
                            <Link to="/admin"><Icon type="home" /></Link>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>
                            <Icon type="user" />
                            <span>添加分类</span>
                        </Breadcrumb.Item>
                    </Breadcrumb>
                }>
                    <AddForm/>
                </Card>
            </Home>
        )
    }
}
export default CateAdd;