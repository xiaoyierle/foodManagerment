import React from 'react';
import Home from '../home/home';
import {Card,Table, Input, Popconfirm ,Icon ,Button,message} from 'antd';
import './edit_goods.css';
class EditableCell extends React.Component {
    state = {
        value: this.props.value,
        editable: false,
    }
    handleChange = (e) => {
        const value = e.target.value;
        this.setState({ value });
    }
    check = () => {
        this.setState({ editable: false });
        if (this.props.onChange) {
            this.props.onChange(this.state.value);
        }
    }
    edit = () => {
        this.setState({ editable: true });
    }
    render() {
        const { value, editable } = this.state;
        return (
            <div className="editable-cell">
                {
                    editable ?
                        <div className="editable-cell-input-wrapper">
                            <Input
                                value={value}
                                onChange={this.handleChange}
                                onPressEnter={this.check}
                            />
                            <Icon
                                type="check"
                                className="editable-cell-icon-check"
                                onClick={this.check}
                            />
                        </div>
                        :
                        <div className="editable-cell-text-wrapper">
                            {value || ' '}
                            <Icon
                                type="edit"
                                className="editable-cell-icon"
                                onClick={this.edit}
                            />
                        </div>
                }
            </div>
        );
    }
}
class EditGoods extends React.Component{
    constructor(props) {
        super(props);
        this.columns = [{
            title: '商品ID',
            dataIndex: 'id',
            width: '10%',
        },{
            title: '商品名称',
            dataIndex: 'name',
            width: '20%',
            render: (text, record) => (
                <EditableCell
                    value={text}
                    onChange={this.onCellChange(record.key, 'name')}
                />
            ),
        }, {
            title: '商品图片',
            dataIndex: 'pic',
            width: '20%',
            render: (text, record) => (
                <EditableCell
                    value={text}
                    onChange={this.onCellChange(record.key, 'pic')}
                />
            ),
        }, {
            title: '商品价格',
            dataIndex: 'price',
            width: '10%',
            render: (text, record) => (
                <EditableCell
                    value={text}
                    onChange={this.onCellChange(record.key, 'price')}
                />
            ),
        },{
            title: '商品描述',
            dataIndex: 'desc',
            width: '30%',
            render: (text, record) => (
                <EditableCell
                    value={text}
                    onChange={this.onCellChange(record.key, 'desc')}
                />
            ),
        }, {
            title: '操作',
            dataIndex: 'operation',
            render: (text, record) => {
                return (
                    this.state.dataSource.length > 1 ?
                        (
                            <Popconfirm title="Sure to delete?" onConfirm={() => this.onDelete(record.key)}>
                                <a href="#">删除</a>
                            </Popconfirm>
                        ) : null
                );
            },
        }];

        this.state = {
            dataSource1: [{
                key: '0',
                name: 'Edward King 0',
                age: '32',
                address: 'London, Park Lane no. 0',
            }, {
                key: '1',
                name: 'Edward King 1',
                age: '32',
                address: 'London, Park Lane no. 1',
            }],
            count: 0,
            dataSource:[]
        };
    }
    componentDidMount(){
        fetch('/get_goods',{credentials:'include'})
            .then(res=>res.json())
            .then(data=>{
                let data2=[];
                data.forEach((item,index)=>{
                    let data1={};
                    for(let i in item){
                        data1[i]=data[index][i]
                        data1['key']=item.id;
                    }
                    data2.push(data1);
                })
                this.setState({
                    dataSource:data2,
                    count:data2.length
                });
            })
    }
    onCellChange = (key, dataIndex) => {
        return (value) => {
            const dataSource = [...this.state.dataSource];
            const target = dataSource.find(item => item.key === key);
            if (target) {
                target[dataIndex] = value;
                this.setState({ dataSource });
                fetch(`/update_goods?title=${dataIndex}&id=${key}&value=${value}`)
                    .then(res=>res.json)
                    .then(data=>{
                        if(data==='ok'){
                            alert('修改成功');
                        }
                    })
            }
        };

    }
    onDelete = (key) => {
        const dataSource = [...this.state.dataSource];
        this.setState({ dataSource: dataSource.filter(item => item.key !== key) });
        fetch(`/delete_goods?id=${key}`)
            .then(res=>res.json())
            .then(data=>{
                if(data=='ok'){
                    message.success('删除成功');
                }else{
                    message.error('删除失败');
                }
            })
    }
    handleAdd = () => {
        const { count, dataSource } = this.state;
        const newData = {
            key: count,
            name: `Edward King ${count}`,
            age: 32,
            address: `London, Park Lane no. ${count}`,
        };
        this.setState({
            dataSource: [...dataSource, newData],
            count: count + 1,
        });
    }
    render(){
        const { dataSource } = this.state;
        const columns = this.columns;
        return(
            <Home selected="goods_edit">
                <Card title="商品管理">
                    <Button className="editable-add-btn" onClick={this.handleAdd}>添加商品</Button>
                    <Table bordered dataSource={dataSource} columns={columns} />
                </Card>
            </Home>
        )
    }
}
export default EditGoods;