import React, { Component } from 'react';
import { CommonUtils } from '../../utils';
import { createNewClinic } from '../../services/userService';
import { toast } from 'react-toastify';
import { Button } from 'reactstrap';
import MdEditor from 'react-markdown-editor-lite';
import MarkdownIt from 'markdown-it';
const mdParser = new MarkdownIt(/* Markdown-it options */);

class ManageClinic extends Component {
    constructor(props){
        super(props);
        this.state = {
            name: '',
            address: '',
            descriptionHtml: '',
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
            descriptionHtml: html,
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
                descriptionHtml: '',
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
                <div className='ms-title'>
                    Manage clinic
                </div>
                <div className='add-new-clinic-row'>
                    <div className='col-6 form-group'>
                        <label>Tên phòng khám</label>
                        <input type='text' className='form-control' onChange={(event) => this.handleOnchangeInput(event, 'name')} value={this.state.name} />
                    </div>
                    <div className='col-6 form-group'>
                        <label>Ảnh phòng khám</label>
                        <input type='file' className='form-control' onChange={(event) => this.handleOnchangeImage(event)} />
                    </div>
                    <div className='col-12'>
                        <MdEditor onChange={this.handleOnchangeEditor} value={this.state.descriptionMarkdown} 
                            style={{ height: '300px' }} renderHTML={text => mdParser.render(text)}
                        />
                    </div>
                    <div className='col-12'>
                        <Button className='btn-save-clinic' color='primary' onClick={() => this.handleSaveNewClinic()}>Save</Button>
                    </div>
                </div>
            </div>
        );
    }
}

export default ManageClinic;