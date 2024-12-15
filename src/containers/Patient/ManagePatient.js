import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import DatePicker from 'react-flatpickr';
import RemedyModal from './RemedyModal';
import { getAllPatientForDoctor, postSendRemedy } from '../../services/userService';
import { toast } from 'react-toastify';
import moment from 'moment';
import './ManagePatient.scss';
import { getDEtailInforDoctor } from '../../services/userService';
    
class ManagePatient extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataPatient: [],
            currentDate: moment(new Date()).startOf('day').valueOf(),
            isOpenRemedyModal: false,
            dataModal: "",
            isShowLoading: false
        }
    }

    // ... existing methods ...
    async componentDidMount() {

        this.getDataPatient();
    }
    getDataPatient = async () => {
        let {user} = this.props;
        let {currentDate} = this.state;
        let formatedDate= new Date(currentDate).getTime();
        let data = await getAllPatientForDoctor({doctorId: user.id, date: formatedDate});
        if(data ){
            this.setState({
                dataPatient: data.data
            })
        }
    }
    getInforDoctor = async (doctorId) => {
        let result = {}
        if (doctorId) {
            let data = await getDEtailInforDoctor(doctorId)
            if (data && data.errCode === 0) {
                result = data.data
            }
        }
        return result
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {

        if (prevProps.language !== this.props.language) {

        }

    }
    handleOnChangeDatePicker = (date) => {
        this.setState({
            currentDate: date[0]
        },()=>{
            this.getDataPatient();
        })
    }
    btnConfirmBooking = (item) => {
        let data = {
            patientId: item.patientId,
            doctorId: item.doctorId,
            email: item.patientData.email,
            timeType: item.timeType,
            patientName: item.patientData.firstName,
        }
        this.setState({
            isOpenRemedyModal: true,
            dataModal: data
        })
    }
    closeRemedyModal = () => {
        this.setState({
            isOpenRemedyModal: false,
            dataModal: {}
        })
    }
    sendRemedy = async (data) => {
        let {dataModal} = this.state
        this.setState({
            isShowLoading: true
        })
        let res = await postSendRemedy({
            email: data.email,
            patientName: data.patientName,
            timeType: data.timeType,
            language: this.props.language,
            imgBase64: data.imgBase64,
            doctorId: data.doctorId,
            patientId: data.patientId
        });
        if(res && res.errCode === 0){
            this.setState({
                isShowLoading: false
            })
            toast.success("Đã gửi điều trị");
            this.closeRemedyModal();
        }
        else{
            this.setState({
                isShowLoading: false
            })
            toast.error("Gửi điều trị thất bại");
        }
    }
    render() {
        const { dataPatient, isOpenRemedyModal, isShowLoading, dataModal, currentDate } = this.state;
        const { language } = this.props;
        console.log('dataPatient', isOpenRemedyModal);
        return (
            <React.Fragment>
                <div className='manage-patient-container'>
                    <div className='header-container'>
                        <div className='header-content'>
                            <h2 className='title'>
                                <i className="fas fa-hospital-user"></i>
                                <span>
                                    {language === 'vi' ? 'Quản lý bệnh nhân khám bệnh' : 'Patient Management'}
                                </span>
                            </h2>
                            <div className='date-picker-container'>
                                <label>
                                    <i className="far fa-calendar-alt"></i>
                                    {language === 'vi' ? 'Chọn ngày khám' : 'Select Date'}
                                </label>
                                <DatePicker
                                    onChange={this.handleOnChangeDatePicker}
                                    className='custom-datepicker'
                                    value={currentDate}
                                />
                            </div>
                        </div>
                    </div>

                    <div className='content-container'>
                        {dataPatient && dataPatient.length > 0 ? (
                            <div className='table-responsive'>
                                <table className='patient-table'>
                                    <thead>
                                        <tr>
                                            <th><i className="fas fa-hashtag"></i> STT</th>
                                            <th><i className="far fa-clock"></i> Thời gian</th>
                                            <th><i className="far fa-user"></i> Họ tên</th>
                                            <th><i className="fas fa-map-marker-alt"></i> Địa chỉ</th>
                                            <th><i className="fas fa-venus-mars"></i> Giới tính</th>
                                            <th><i className="fas fa-cogs"></i> Thao tác</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {dataPatient.map((item, index) => {
                                            console.log('item', item);
                                            const time = language === "vi" ? 
                                                item.timeTypeDataPatient.valueVi : 
                                                item.timeTypeDataPatient.valueEn;
                                            const gender = language === "vi" ? 
                                                item.patientData.genderData.valueVi : 
                                                item.patientData.genderData.valueEn;
                                            return (
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>{time}</td>
                                                    <td className='patient-name'>
                                                        {item.patientData.firstName} {item.patientData.lastName}
                                                    </td>
                                                    <td>{item.patientData.address}</td>
                                                    <td>{gender}</td>
                                                    <td className='action-buttons'>
                                                        <button 
                                                            className='btn-confirm'
                                                            onClick={() => this.btnConfirmBooking(item)}
                                                        >
                                                            <i className="fas fa-check-circle"></i>
                                                            {language === 'vi' ? 'Xác nhận' : 'Confirm'}
                                                        </button>
                                                        <button 
                                                            className='btn-remedy'
                                                            onClick={() => this.btnConfirmRemedy(item)}
                                                        >
                                                            <i className="fas fa-pills"></i>
                                                            {language === 'vi' ? 'Điều trị' : 'Treatment'}
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className='no-data'>
                                <i className="fas fa-folder-open"></i>
                                <p>{language === 'vi' ? 'Không có dữ liệu bệnh nhân' : 'No patient data available'}</p>
                            </div>
                        )}
                    </div>
                </div>

                <RemedyModal 
                    isOpen={isOpenRemedyModal}
                    closeRemedyModal={this.closeRemedyModal}
                    dataModal={dataModal}
                    sendRemedy={this.sendRemedy}
                    language={language}
                    loadPatientData={this.getDataPatient}
                />
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => ({
    language: state.app.language,
    user: state.user.userInfo
});

export default connect(mapStateToProps)(ManagePatient);