import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import './DoctorExtraInfor.scss';
import * as actions from "../../../store/actions";
import { getExtraInforDoctorById, postBookingAppointment } from '../../../services/userService';
import NumberFormat from 'react-number-format';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import './Booking.Modal.scss';
import 'react-markdown-editor-lite/lib/index.css';
import ProfileDoctor from './ProfileDoctor';
import Select from 'react-select';
import { Modal } from 'reactstrap';
import _ from 'lodash';
import { LANGUAGES } from '../../../utils';
import { toast } from 'react-toastify';
import DatePicker from '../../../components/Input/DatePicker';
import moment from 'moment';

// Initialize a markdown parser
const mdParser = new MarkdownIt(/* Markdown-it options */);





class BookingModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            fullName: '',
            phoneNumber: '',
            email: '',
            address: '',
            reason: '',
            birthday: '',
            gender: '',
            doctorId: '',
            timeType: '',
            selectedGender: ''
        }
    }

    async componentDidMount() {
        this.props.getGenders()
    }
    async componentDidUpdate(prevProps, prevState, snapshot) {

        if (prevProps.language !== this.props.language) {
            this.setState({
                genders: this.buildDataGender(this.props.genders)
            })
        }
        if (this.props.genders !== prevProps.genders) {
            this.setState({
                genders: this.buildDataGender(this.props.genders)
            })
        }
        if(this.props.dataScheduleTimeModal !== prevProps.dataScheduleTimeModal) {
            if(this.props.dataScheduleTimeModal && !_.isEmpty(this.props.dataScheduleTimeModal)) {

                this.setState({
                    doctorId: this.props.dataScheduleTimeModal.doctorId,
                    timeType: this.props.dataScheduleTimeModal.timeType,
                    price: this.props.dataScheduleTimeModal.price
                })
            }
        }


    }
    buildTimeBooking = (dataTime) => {
        let language = this.props.language
        if(dataTime && !_.isEmpty(dataTime)) {
            let time = language === LANGUAGES.VI ? dataTime.valueVi : dataTime.valueEn
            let date = language === LANGUAGES.VI ? moment.unix(+dataTime.date /1000).format('dddd - DD/MM/YYYY') : moment(+dataTime.date).locale('en').format('ddd - MM/DD/YYYY')
            return `${time} - ${date}`  
        }
        return ''
    }
    buildDataGender = (data) => {
        let language = this.props.language
        if(data && !_.isEmpty(data)) {
            let name = language === LANGUAGES.VI ? `${data.doctorData.lastName} ${data.doctorData.firstName}` : `${data.doctorData.firstName} ${data.doctorData.lastName}`
            return name
        }
        return ''
    }
    handleOnChangeInput = (event, id) => {
        this.setState({
            [id]: event.target.value
        })
    }
    handleOnChangeSelect = (selectedOption) => {
        this.setState({
            selectedGender: selectedOption
        })
    }
    handleOnChangeDatePicker = (date) => {
        this.setState({
            birthday: date
        })
    }
    handleConfirmBookingAppointment = async () => {
        let date = new Date(this.state.birthday).getTime()
        let timeBooking = this.buildTimeBooking(this.props.dataScheduleTimeModal)
        let doctorName = this.buildDataGender(this.props.dataScheduleTimeModal)

        let res = await postBookingAppointment({
            fullName: this.state.fullName,
            phoneNumber: this.state.phoneNumber,
            email: this.state.email,
            address: this.state.address,
            reason: this.state.reason,
            date: this.props.dataScheduleTimeModal?.date || '',
            birthday: date,
            doctorId: this.state.doctorId,
            timeType: this.state.timeType,
            selectedGender: this.state.selectedGender.value,
            price: this.state.price,
            doctorName: doctorName,
            timeBooking: timeBooking,
            language: this.props.language
        })
        if(res && res.errCode === 0) {
            toast.success('Dat lich kham thanh cong')
            this.props.closeModalBooking()
        } else {
            toast.error('Dat lich kham that bai')
        }
    }
    buildDataGender = (data) => {
        let result = []
        let language = this.props.language
        if (data && data.length > 0) {
            data.map((item) => {
                result.push({
                    label: language === LANGUAGES.VI ? item.valueVi : item.valueEn,
                    value: item.keyMap
                })
            })
        }
        return result
    }
    render() {
        let { language } = this.props
        let { isOpen, closeModalBooking, dataScheduleTimeModal } = this.props
        let doctorId = ''
        if (dataScheduleTimeModal && !_.isEmpty(dataScheduleTimeModal)) {
            doctorId = dataScheduleTimeModal.doctorId
    }

        return (
            <Modal isOpen={isOpen} toggle={closeModalBooking} className='booking-modal-container' size='lg' centered onClosed={closeModalBooking}>
                <div className='booking-modal-content'>
                    <div className='booking-modal-header'>
                        <span className='left'><FormattedMessage id="patient.booking-modal.title"/></span>
                        <span className='right' onClick={closeModalBooking}><i className="fas fa-times"></i></span>
                    </div>
                    <div className='booking-modal-body'>
                        <div className='doctor-info'>
                            <ProfileDoctor doctorId={doctorId} isshowDescriptionDoctor={false} dataTime={dataScheduleTimeModal} isShowPrice={false} isShowLinkDetail={false}/>
                        </div>
                        <div className='row'>
                            <div className='col-6 form-group'>
                                <label><FormattedMessage id="patient.booking-modal.full-name"/></label>
                                <input className='form-control' onChange={(event) => this.handleOnChangeInput(event, 'fullName')} value={this.state.fullName}/>
                            </div>
                            <div className='col-6 form-group'>
                                <label><FormattedMessage id="patient.booking-modal.phone-number"/></label>
                                <input className='form-control' onChange={(event) => this.handleOnChangeInput(event, 'phoneNumber')} value={this.state.phoneNumber}/>
                            </div>
                            <div className='col-6 form-group'>
                                <label><FormattedMessage id="patient.booking-modal.email"/></label>
                                <input className='form-control' onChange={(event) => this.handleOnChangeInput(event, 'email')} value={this.state.email}/>
                            </div>
                            <div className='col-6 form-group'>
                                <label><FormattedMessage id="patient.booking-modal.address"/></label>
                                <input className='form-control' onChange={(event) => this.handleOnChangeInput(event, 'address')} value={this.state.address}/>
                            </div>
                            <div className='col-12 form-group'>
                                <label><FormattedMessage id="patient.booking-modal.reason"/></label>
                                <input className='form-control' onChange={(event) => this.handleOnChangeInput(event, 'reason')} value={this.state.reason}/>
                            </div>
                            <div className='col-6 form-group'>
                                <label><FormattedMessage id="patient.booking-modal.birthday"/></label>
                                <DatePicker className='form-control' onChange={this.handleOnChangeDatePicker} value={this.state.birthday}/>
                            </div>
                            <div className='col-6 form-group'>
                                <label><FormattedMessage id="patient.booking-modal.gender"/></label>
                                <Select options={this.state.genders} onChange={this.handleOnChangeSelect} value={this.state.selectedGender}/>
                            </div>
                        </div>
                    </div>
                    <div className='booking-modal-footer'>
                        <button className='btn-booking-confirm' onClick={this.handleConfirmBookingAppointment}><FormattedMessage id="patient.booking-modal.btn-confirm"/></button>
                        <button className='btn-booking-cancel' onClick={closeModalBooking}><FormattedMessage id="patient.booking-modal.btn-cancel"/></button>
                    </div>
                </div>
            </Modal>



        );
    }

}

const mapStateToProps = state => {
    return {

        language: state.app.language,
        genders: state.admin.genders
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getGenders: () => dispatch(actions.fetchGenderStart())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(BookingModal);
