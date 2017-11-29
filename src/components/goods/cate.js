import React from 'react';
import Home from '../home/home';
import {Table , Card , message,Icon,Breadcrumb,Popconfirm,Input,Button} from 'antd';
import {Link} from 'react-router-dom';
import './cate.css';
message.config({
    duration:5
})
class Cate extends React.Component{
    constructor(){
        super();
        this.state={
            source:[],
            name:'',
        }
    }
    componentDidMount(){
        fetch('/get_cates',{credentials:'include'})
            .then(res=>res.json())
            .then(r=>{
                if(r.code===4){
                    message.error(r.message);
                }else{
                    this.setState({source:r})
                }
            })
    }
    delete(cid){
        fetch('/delete_cate',{
            method:'post',
            headers:{
                'Content-Type':'application/json'
            },
            credentials:'include',
            body:JSON.stringify({cid}),
        }).then(res=>res.json())
            .then(r=>{
                var n = this.state.source.filter(v=>v.cid!==cid);
                if(r==='ok'){
                    this.setState({source:n});
                }
            })
    }
    update(cid,key,record){
        const {name}=this.state;
        fetch('/update_cate',{
            method:'post',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({cid,key,name})
        }).then(res=>res.json())
            .then(r=>{
                if(r==='ok'){
                    record[key]=name;
                    this.setState({
                        name:'',
                    })
                }
            })
    }
    change(e){
        this.setState({
            name:e.target.value
        })
    }
    render(){
        const tableData={
            columns:[
                {
                    title:'分类',
                    dataIndex:'cid',
                    key:'cid',
                },
                {title:'店铺名称',dataIndex:'sname',key:'sname'},
                {title:'分类名称',key:'cname',render:(record)=>(
                    <div className="cateUpdateCell">
                        {record.cname}
                        &nbsp;&nbsp;&nbsp;
                        <Popconfirm
                            title={(<Input onChange={(e)=>this.change(e)} defaultValue={record.cname}/>)}
                            onConfirm={()=>this.update(record.cid,'cname',record)}
                        >
                            <Button shape="circle" type="dashed"><Icon type="edit" /></Button>
                        </Popconfirm>
                    </div>
                )},
                {title:'分类描述',key:'cdesc',render:(record)=>(
                <div className="cateUpdateCell">
                    {record.cdesc}
                    &nbsp;&nbsp;&nbsp;
                        <Popconfirm
                            title={(<Input onChange={(e)=>this.change(e)} defaultValue={record.cdesc}/>)}
                            onConfirm={()=>this.update(record.cid,'cdesc',record)}
                        >
                            <Button shape="circle" type="dashed"><Icon type="edit" /></Button>
                        </Popconfirm>
                </div>
                )},
                {title:'操作',key:'option',render:r=>(
                    <Button type="dashed" onClick={()=>this.delete(r.cid)}>删除</Button>
                )}
            ],
            dataSource:this.state.source
        }
        return(
            <Home selected="cate_manager">
                <Card title={<Breadcrumb>
                    <Breadcrumb.Item>
                        <Link to="/admin"><Icon type="home" /></Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        <Icon type="user" />
                        <span>分类管理</span>
                    </Breadcrumb.Item>
                </Breadcrumb>}>
                    <Table bordered {...tableData}/>
                </Card>
            </Home>
        )
    }
}
export default Cate;