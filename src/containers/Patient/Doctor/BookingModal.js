import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import './DoctorExtraInfor.scss';
import * as actions from "../../../store/actions";
import { getExtraInforDoctorById, postBookingAppointment } from '../../../services/userService';
import NumberFormat from 'react-number-format';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import './BookingModal.scss';
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
        const { language, isOpen, closeModalBooking, dataScheduleTimeModal } = this.props;
        const doctorId = dataScheduleTimeModal?.doctorId || '';

        return (
            <Modal 
                isOpen={isOpen} 
                toggle={closeModalBooking} 
                className='booking-modal-container' 
                size='lg' 
                centered
            >
                <div className='booking-modal-content'>
                    <div className='modal-header'>
                        <h5 className='modal-title'>
                            <i className="fas fa-calendar-check pulse"></i>
                            <FormattedMessage id="patient.booking-modal.title"/>
                        </h5>
                        <button className='close-button' onClick={closeModalBooking}>
                            <i className="fas fa-times"></i>
                        </button>
                    </div>

                    <div className='modal-body'>
                        <div className='doctor-profile-section'>
                            <div className='section-title'>
                                <i className="fas fa-user-md"></i>
                                <span>
                                    <FormattedMessage id="patient.booking-modal.doctor-info"/>
                                </span>
                            </div>
                            <ProfileDoctor 
                                doctorId={doctorId} 
                                isshowDescriptionDoctor={false} 
                                dataTime={dataScheduleTimeModal} 
                                isShowPrice={false} 
                                isShowLinkDetail={false}
                            />
                        </div>

                        <div className='booking-form'>
                            <div className='section-title'>
                                <i className="fas fa-file-medical"></i>
                                <span>
                                    <FormattedMessage id="patient.booking-modal.booking-info"/>
                                </span>
                            </div>

                            <div className='form-grid'>
                                <div className='form-group'>
                                    <label>
                                        <i className="fas fa-user"></i>
                                        <FormattedMessage id="patient.booking-modal.full-name"/>
                                        <span className="required">*</span>
                                    </label>
                                    <input 
                                        className='form-control with-icon'
                                        onChange={(event) => this.handleOnChangeInput(event, 'fullName')}
                                        value={this.state.fullName}
                                        placeholder={language === LANGUAGES.VI ? "Nhập họ tên" : "Enter full name"}
                                    />
                                </div>

                                <div className='form-group'>
                                    <label>
                                        <i className="fas fa-phone-alt"></i>
                                        <FormattedMessage id="patient.booking-modal.phone-number"/>
                                        <span className="required">*</span>
                                    </label>
                                    <input 
                                        className='form-control with-icon'
                                        onChange={(event) => this.handleOnChangeInput(event, 'phoneNumber')}
                                        value={this.state.phoneNumber}
                                        placeholder={language === LANGUAGES.VI ? "Nhập số điện thoại" : "Enter phone number"}
                                    />
                                </div>

                                <div className='form-group'>
                                    <label>
                                        <i className="fas fa-envelope"></i>
                                        <FormattedMessage id="patient.booking-modal.email"/>
                                        <span className="required">*</span>
                                    </label>
                                    <input 
                                        className='form-control with-icon'
                                        onChange={(event) => this.handleOnChangeInput(event, 'email')}
                                        value={this.state.email}
                                        placeholder={language === LANGUAGES.VI ? "Nhập email" : "Enter email"}
                                    />
                                </div>

                                <div className='form-group'>
                                    <label>
                                        <i className="fas fa-map-marker-alt"></i>
                                        <FormattedMessage id="patient.booking-modal.address"/>
                                        <span className="required">*</span>
                                    </label>
                                    <input 
                                        className='form-control with-icon'
                                        onChange={(event) => this.handleOnChangeInput(event, 'address')}
                                        value={this.state.address}
                                        placeholder={language === LANGUAGES.VI ? "Nhập địa chỉ" : "Enter address"}
                                    />
                                </div>

                                <div className='form-group'>
                                    <label>
                                        <i className="fas fa-birthday-cake"></i>
                                        <FormattedMessage id="patient.booking-modal.birthday"/>
                                        <span className="required">*</span>
                                    </label>
                                    <DatePicker 
                                        className='form-control with-icon'
                                        onChange={this.handleOnChangeDatePicker}
                                        value={this.state.birthday}
                                        placeholder={language === LANGUAGES.VI ? "Nhập ngày sinh" : "Enter birthday"}
                                    />
                                </div>

                                <div className='form-group'>
                                    <label>
                                        <i className="fas fa-transgender"></i>
                                        <FormattedMessage id="patient.booking-modal.gender"/>
                                        <span className="required">*</span>
                                    </label>
                                    <Select 
                                        options={this.state.genders}
                                        onChange={this.handleOnChangeSelect}
                                        value={this.state.selectedGender}
                                        className='select__control'
                                    />
                                </div>
                            </div>

                            <div className='form-group full-width'>
                                <label>
                                    <i className="fas fa-comment-medical"></i>
                                    <FormattedMessage id="patient.booking-modal.reason"/>
                                </label>
                                <textarea 
                                    className='form-control with-icon'
                                    onChange={(event) => this.handleOnChangeInput(event, 'reason')}
                                    value={this.state.reason}
                                    rows="3"
                                    placeholder={language === LANGUAGES.VI ? "Mô tả triệu chứng" : "Describe your symptoms"}
                                />
                            </div>
                        </div>
                    </div>

                    <div className='modal-footer'>
                        <div className='footer-content'>
                            <div className='terms-notice'>
                                <i className="fas fa-info-circle"></i>
                                <span>
                                    <FormattedMessage id="patient.booking-modal.terms-notice"/>
                                </span>
                            </div>
                            
                            <div className='action-buttons'>
                                <button 
                                    className='btn-cancel' 
                                    onClick={closeModalBooking}
                                >
                                    <i className="fas fa-times"></i>
                                    <FormattedMessage id="patient.booking-modal.btn-cancel"/>
                                </button>
                                <button 
                                    className='btn-confirm' 
                                    onClick={this.handleConfirmBookingAppointment}
                                >
                                    <i className="fas fa-check"></i>
                                    <FormattedMessage id="patient.booking-modal.btn-confirm"/>
                                </button>
                            </div>
                        </div>
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
