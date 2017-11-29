import React from 'react';
import Home from '../home/home';
import {Card,Table, Input, Popconfirm} from 'antd';
import './edit_cate.css';
class EditCateInfoCell extends React.Component{
    state = {
        value: this.props.value,
        editable: this.props.editable || false,
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.editable !== this.state.editable) {
            this.setState({ editable: nextProps.editable });
            if (nextProps.editable) {
                this.cacheValue = this.state.value;
            }
        }
        if (nextProps.status && nextProps.status !== this.props.status) {
            if (nextProps.status === 'save') {
                this.props.onChange(this.state.value);
            } else if (nextProps.status === 'cancel') {
                this.setState({ value: this.cacheValue });
                this.props.onChange(this.cacheValue);
            }
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        return nextProps.editable !== this.state.editable ||
            nextState.value !== this.state.value;
    }
    handleChange(e) {
        const value = e.target.value;
        this.setState({ value });
    }
    render(){
        const {editable,value}=this.state;
        return(
            <div>
                {
                    editable ?
                        <div>
                            <Input
                                value={value}
                                onChange={e => this.handleChange(e)}
                            />
                        </div>
                        :
                        <div className="editable-row-text">
                            {value.toString() || ' '}
                        </div>
                }
            </div>
        )
    }
}
class EditCate extends React.Component{
    constructor(props){
        super(props);
        this.state={
            data1: [{
                key: '0',
                id: {
                    value: '0',
                },
                name: {
                    editable: false,
                    value: '王先生脆皮烤猪',
                },
                pic: {
                    editable: false,
                    value: '12312313',
                },
                desc: {
                    editable: false,
                    value: '好吃的脆皮烤猪',
                },
                address: {
                    editable: false,
                    value: '山西省太原市小店区',
                },
            }],
            data:[]
        }
        this.columns = [{
            title: '分类id',
            dataIndex: 'id',
            width: '10%',
            render: (text, record, index) => this.renderColumns(this.state.data, index, 'id', text),
        },{
            title: '分类名称',
            dataIndex: 'name',
            width: '30%',
            render: (text, record, index) => this.renderColumns(this.state.data, index, 'name', text),
        }, {
            title: '分类简介',
            dataIndex: 'desc',
            width: '40%',
            render: (text, record, index) => this.renderColumns(this.state.data, index, 'desc', text),
        },{
            title: '编辑',
            dataIndex: 'operation',
            render: (text, record, index) => {
                const { editable } = this.state.data[index].name;
                return (
                    <div className="editable-row-operations">
                        {
                            editable ?
                                <span>
                  <a onClick={() => this.editDone(index, 'save')}>保存</a>
                  <Popconfirm title="取消编辑?" onConfirm={() => this.editDone(index, 'cancel')}>
                    <a>取消</a>
                  </Popconfirm>
                </span>
                                :
                                <span>
                  <a onClick={() => this.edit(index)}>修改信息</a>
                </span>
                        }
                    </div>
                );
            },
        }];
    }
    componentDidMount(){
        fetch('/get_cate',{credentials:'include'})
            .then(res=>res.json())
            .then(data=>{
                let data2=[];
                data.forEach((item,index)=>{
                    let data1={};
                    for(let i in item){
                        if(i!=='id'){
                            data1[i]={value:data[index][i],editable:false}
                        }else{
                            data1[i]={value:data[index][i]}
                        }
                            data1['key']=item.id;
                    }
                    data2.push(data1);
                })
                this.setState({
                    data:data2
                });
            })
    }
    renderColumns(data, index, key, text) {
        const { editable, status } = data[index][key];
        if (typeof editable === 'undefined') {
            return text;
        }
        return (<EditCateInfoCell
            editable={editable}
            value={text}
            onChange={value => this.handleChange(key, index, value)}
            status={status}
        />);
    }
    handleChange(key, index, value) {
        const { data } = this.state;
        data[index][key].value = value;
        this.setState({ data });
    }
    edit(index) {
        const { data } = this.state;
        Object.keys(data[index]).forEach((item) => {
            if (data[index][item] && typeof data[index][item].editable !== 'undefined') {
                data[index][item].editable = true;
            }
        });
        this.setState({ data });
    }
    editDone(index, type) {
        const { data } = this.state;
        Object.keys(data[index]).forEach((item) => {
            if (data[index][item] && typeof data[index][item].editable !== 'undefined') {
                data[index][item].editable = false;
                data[index][item].status = type;
            }

        });
        this.setState({ data }, () => {
            Object.keys(data[index]).forEach((item) => {
                if (data[index][item] && typeof data[index][item].editable !== 'undefined') {
                    delete data[index][item].status;
                }
            });
            fetch('/update_cate',{
                credentials:'include',
                method:'post',
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify(data[index])
            }).then(res=>res.json())
                .then(data=>{
                    if(data === 'ok'){
                        // window.location.href='/goods/cate_edit';
                        alert('修改成功');
                    }
                });
        });
    }
    render(){
        const {data} = this.state;
        const dataSource = data.map((item) => {
            const obj = {};
            Object.keys(item).forEach((key) => {
                obj[key] = key === 'key' ? item[key] : item[key].value;
            });
            return obj;
        });
        const columns = this.columns;
        return(
            <Home selected="cate_edit">
                <Card title="分类管理">
                    <Table bordered dataSource={dataSource} columns={columns}/>
                </Card>
            </Home>
        )
    }
}
export default EditCate;