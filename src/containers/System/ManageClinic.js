import React, { Component } from 'react';
import { CommonUtils } from '../../utils';
import { createNewClinic } from '../../services/userService';
import { toast } from 'react-toastify';
import { Button } from 'reactstrap';
import MdEditor from 'react-markdown-editor-lite';
import MarkdownIt from 'markdown-it';
import './ManageClinic.scss';

const mdParser = new MarkdownIt();

class ManageClinic extends Component {
    constructor(props){
        super(props);
        this.state = {
            name: '',
            address: '',
            descriptionHTML: '',
            descriptionMarkdown: '',
            imageBase64: ''
        }
    }
    async componentDidMount(){

    }
    
    handleOnchangeInput = (event, id) => {
        let stateCopy = {...this.state};
        stateCopy[id] = event.target.value;
        this.setState({
            ...stateCopy
        })
    }
    handleOnchangeEditor = ({html, text}) => {
        this.setState({
            descriptionHTML: html,
            descriptionMarkdown: text
        })
    }
    handleOnchangeImage = async (event) => {
        let data = event.target.files;
        let file = data[0];
        if(file){
            let base64 = await CommonUtils.getBase64(file)
            this.setState({
                imageBase64: base64
            })
        }
    }
    handleSaveNewClinic = async () =>{
        let res = await createNewClinic(this.state)
        if (res && res.errCode === 0){
            toast.success(res.message)
            this.setState({
                name: '',
                address: '',
                descriptionHTML: '',
                descriptionMarkdown: '',
                imageBase64: ''
            })
        } else {
            toast.error(res.message)
        }
    }
    render() {
        return (
            <div className='manage-clinic-container'>
                <div className='clinic-header'>
                    <h2>Quản lý phòng khám</h2>
                    <p>Thêm và chỉnh sửa thông tin phòng khám</p>
                </div>
                
                <div className='clinic-content'>
                    <div className='clinic-form'>
                        <div className='row'>
                            <div className='col-6 form-group'>
                                <label>Tên phòng khám</label>
                                <input 
                                    type='text' 
                                    className='form-control' 
                                    placeholder='Nhập tên phòng khám'
                                    onChange={(event) => this.handleOnchangeInput(event, 'name')} 
                                    value={this.state.name} 
                                />
                            </div>
                            <div className='col-6 form-group'>
                                <label>Địa chỉ phòng khám</label>
                                <input 
                                    type='text' 
                                    className='form-control' 
                                    placeholder='Nhập địa chỉ phòng khám'
                                    onChange={(event) => this.handleOnchangeInput(event, 'address')} 
                                    value={this.state.address} 
                                />
                            </div>
                        </div>

                        <div className='row mt-3'>
                            <div className='col-6 form-group'>
                                <label>Ảnh phòng khám</label>
                                <div className='upload-image-container'>
                                    <input 
                                        type='file' 
                                        id="clinic-image"
                                        className='form-control' 
                                        onChange={(event) => this.handleOnchangeImage(event)} 
                                        hidden
                                    />
                                    <label className='upload-label' htmlFor="clinic-image">
                                        <i className="fas fa-cloud-upload-alt"></i>
                                        <span>Chọn ảnh</span>
                                    </label>
                                    {this.state.imageBase64 && 
                                        <div className='preview-image'>
                                            <img src={this.state.imageBase64} alt="Preview" />
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>

                        <div className='row mt-3'>
                            <div className='col-12'>
                                <label>Thông tin chi tiết</label>
                                <div className='markdown-editor'>
                                    <MdEditor 
                                        onChange={this.handleOnchangeEditor} 
                                        value={this.state.descriptionMarkdown} 
                                        style={{ height: '300px' }} 
                                        renderHTML={text => mdParser.render(text)}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className='row mt-4'>
                            <div className='col-12 text-center'>
                                <Button 
                                    className='btn-save-clinic' 
                                    color='primary' 
                                    onClick={() => this.handleSaveNewClinic()}
                                >
                                    <i className="fas fa-save"></i> Lưu thông tin
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ManageClinic;