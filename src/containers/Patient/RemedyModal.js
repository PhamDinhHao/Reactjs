import React, { Component } from 'react';
import { connect } from 'react-redux';
import './ManagePatient.scss';
import { getAllPatientForDoctor, getDEtailInforDoctor } from '../../services/userService'; 
import MarkdownIt from 'markdown-it';
import 'react-markdown-editor-lite/lib/index.css';
import _ from 'lodash';
import DatePicker from '../../components/Input/DatePicker';
import moment from 'moment';
import { CommonUtils } from '../../utils';
import { Modal, ModalBody, ModalFooter } from 'reactstrap';

// Initialize a markdown parser
const mdParser = new MarkdownIt(/* Markdown-it options */);





class RemedyModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email:'',
            imgBase64:''
        }
    }

    async componentDidMount() {
        if(this.props.dataModal){
            this.setState({
                email: this.props.dataModal.email,
            })
        }
    }
    
   

    async componentDidUpdate(prevProps, prevState, snapshot) {

        if(prevProps.dataModal !== this.props.dataModal){
            this.setState({
                email: this.props.dataModal.email,
            })
        }

    }
    handleOnChangeEmail = (e) => {
        this.setState({
            email: e.target.value
        })
    }
    handleOnChangeImgBase64 = async (e) => {
        let data = e.target.files[0];
        if(data){
            let base64 = await CommonUtils.getBase64(data);
            this.setState({
                imgBase64: base64
            })
        }
    }
    handleSendRemedy = () => {
        this.props.sendRemedy(this.state);
    }
    render() {
        let {isOpenModal, closeRemedyModal, sendRemedy, dataModal} = this.props;
        return (
            <Modal
                isOpen={isOpenModal}
                toggle={closeRemedyModal}
                size="md"
                centered
                className="booking-modal-container"
            >
                <div className='modal-header'>
                    <h5 className='modal-title'>
                        gui hoa don kham benh thanh cong
                    </h5>
                    <button type='button' className='close' onClick={closeRemedyModal}>
                        <span aria-hidden="true">x</span>
                    </button>
                </div>
                <ModalBody>
                    <div className='row'>
                        <div className='col-6 form-group'>
                            <label>email</label>
                            <input type='text' className='form-control' value={this.state.email} onChange={this.handleOnChangeEmail} />
                        </div>
                        <div className='col-6 form-group'>
                            <label>Chon file don thuoc</label>
                            <input type='file' className='form-control-file' onChange={(e) => this.handleOnChangeImgBase64(e)} />
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <button type='button' className='btn btn-secondary' onClick={closeRemedyModal}>
                        huy
                    </button>
                    <button type='button' className='btn btn-primary' onClick={() => this.handleSendRemedy()}>
                        gui
                    </button>
                </ModalFooter>
            </Modal>
        );
    }

}

const mapStateToProps = state => {
    return {

        language: state.app.language,
        user: state.user.unserInfo
    };
};

const mapDispatchToProps = dispatch => {
    return {
        
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(RemedyModal);
