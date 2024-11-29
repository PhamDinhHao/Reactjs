
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';

import { connect } from 'react-redux';
import { Button, Modal } from 'reactstrap';

import { ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { emitter } from "../../utils/emitter";
import _, { isEmpty } from 'lodash';
import { CommonUtils } from '../../utils';
import { createNewSpecialty } from '../../services/userService';
import { toast } from 'react-toastify';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import MarkdownIt from 'markdown-it';
const mdParser = new MarkdownIt();



class ManageSpecialty extends Component {

    constructor(props) {
        super(props);
        this.state = {
           name: "",
           imageBase64: "",
           descriptionHTML: "",
           descriptionMarkdown: ""
        }

    }


    async componentDidMount() {
        
    }
    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.language !== this.props.language) {

        }
    }
    handleOnChangeInput = (event, id) => {
        let copyState = {...this.state};
        copyState[id] = event.target.value;
        this.setState({
            ...copyState
        })
    }
    handleEditorChange = ({html, text}) => {
        let copyState = {...this.state};
        copyState.descriptionHTML = html;
        copyState.descriptionMarkdown = text;
        this.setState({
            ...copyState
        })
    }
    handleOnchangeImage = async (event) => {
        let data = event.target.files[0];
        if (data) {
            let base64 = await CommonUtils.getBase64(data);
            this.setState({
                imageBase64: base64
            })
        }
    }
    handleSaveNewSpecialty = async () => {
        let res = await createNewSpecialty(this.state);
        if (res && res.errCode === 0) {
            toast.success("Save new specialty success!");
            this.setState({
                name: "",
                imageBase64: "",
                descriptionHTML: "",
                descriptionMarkdown: ""
            })
        } else {
            toast.error("Save new specialty error!");
        }
    }

    render() {
        
        return (
            <div className='manage-specialty-container'>
                <div className='ms-title'>
                    Manage specialty
                </div>
                <div className='add-new-specialty-row'>
                    <div className='col-6 form-group'>
                        <label>ten chuyen khoa</label>
                        <input type='text' className='form-control' onChange={(event) => this.handleOnChangeInput(event, "name")} value={this.state.name} />
                    </div>
                    <div className='col-6 form-group'>
                        <label>hinh anh</label>
                        <input type='file' className='form-control' onChange={(event) => this.handleOnchangeImage(event)} />
                    </div>
                    <div className='col-12'>
                        <MdEditor onChange={this.handleEditorChange} value={this.state.descriptionMarkdown} 
                            style={{ height: '300px' }} renderHTML={text => mdParser.render(text)}
                        />
                    </div>
                    <div className='col-12'>
                        <Button className='btn-save-specialty' color='primary' onClick={() => this.handleSaveNewSpecialty()}>Save</Button>
                    </div>
                </div>
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
        language: state.app.language
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageSpecialty);
