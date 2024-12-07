import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import DatePicker from '../../../components/Input/DatePicker';
import RemedyModal from './RemedyModal';
import LoadingOverlay from 'react-loading-overlay';
import { getAllPatientForDoctor, postSendRemedy } from '../../../services/userService';
import { toast } from 'react-toastify';
import moment from 'moment';
import './ManagePatient.scss';

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

    render() {
        const { dataPatient, isOpenRemedyModal, isShowLoading, dataModal, currentDate } = this.state;
        const { language } = this.props;

        return (
            <LoadingOverlay
                active={isShowLoading}
                spinner
                text='Processing...'
            >
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
                                            const time = language === "vi" ? 
                                                item.timeTypeDatePatient.valueVi : 
                                                item.timeTypeDatePatient.valueEn;
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
                />
            </LoadingOverlay>
        );
    }
}

const mapStateToProps = state => ({
    language: state.app.language,
    user: state.user.userInfo
});

export default connect(mapStateToProps)(ManagePatient);