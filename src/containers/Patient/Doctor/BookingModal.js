import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import './DoctorExtraInfor.scss';
import * as actions from "../../../store/actions";
import { getExtraInforDoctorById } from '../../../services/userService';
import NumberFormat from 'react-number-format';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import './Booking.Modal.scss';
import 'react-markdown-editor-lite/lib/index.css';
import ProfileDoctor from './ProfileDoctor';
import Select from 'react-select';
import { Modal } from 'reactstrap';
import _ from 'lodash';


// Initialize a markdown parser
const mdParser = new MarkdownIt(/* Markdown-it options */);





class BookingModal extends Component {

    constructor(props) {
        super(props);
        this.state = {

        }
    }

    async componentDidMount() {
    }
    async componentDidUpdate(prevProps, prevState, snapshot) {

        if (prevProps.language !== this.props.language) {

        }

    }

    render() {
        let { language } = this.props
        let { isOpen, closeModalBooking, dataTime } = this.props
        let doctorId = ''
        if (dataTime && !_.isEmpty(dataTime)) {
            doctorId = dataTime.doctorId
        console.log(isOpen);
    }

        return (
            <Modal isOpen={isOpen} toggle={closeModalBooking} className='booking-modal-container' size='lg' centered onClosed={closeModalBooking}>
                <div className='booking-modal-content'>
                    <div className='booking-modal-header'>
                        <span className='left'>thông tin lịch khám bệnh</span>
                        <span className='right' onClick={closeModalBooking}><i className="fas fa-times"></i></span>
                    </div>
                    <div className='booking-modal-body'>
                        <div className='doctor-info'>
                            <ProfileDoctor doctorId={doctorId} />
                        </div>
                        <div className='price'>
                            gia kham 500.000VND
                        </div>
                        <div className='row'>
                            <div className='col-6 form-group'>
                                <label>Ho ten</label>
                                <input className='form-control'/>
                            </div>
                            <div className='col-6 form-group'>
                                <label>So dien thoai</label>
                                <input className='form-control'/>
                            </div>
                            <div className='col-6 form-group'>
                                <label>dia chi email</label>
                                <input className='form-control'/>
                            </div>
                            <div className='col-6 form-group'>
                                <label>Dia chi lien he</label>
                                <input className='form-control'/>
                            </div>
                            <div className='col-12 form-group'>
                                <label>Ly do kham</label>
                                <input className='form-control'/>
                            </div>
                            <div className='col-6 form-group'>
                                <label>Dat cho ai</label>
                                <input className='form-control'/>
                            </div>
                            <div className='col-6 form-group'>
                                <label>Gioi tinh</label>
                                <input className='form-control'/>
                            </div>
                        </div>
                    </div>
                    <div className='booking-modal-footer'>
                        <button className='btn-booking-confirm' onClick={() => {}}>xac nhan</button>
                        <button className='btn-booking-cancel' onClick={closeModalBooking}>huy</button>
                    </div>
                </div>
            </Modal>



        );
    }

}

const mapStateToProps = state => {
    return {

        language: state.app.language,
    };
};

const mapDispatchToProps = dispatch => {
    return {

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(BookingModal);
