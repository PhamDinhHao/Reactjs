import React, { Component } from 'react';
import { connect } from 'react-redux';
import './ManagePatient.scss';
import { getAllPatientForDoctor, getDEtailInforDoctor, postSendRemedy } from '../../services/userService'; 
import MarkdownIt from 'markdown-it';
import 'react-markdown-editor-lite/lib/index.css';
import _ from 'lodash';
import DatePicker from '../../components/Input/DatePicker';
import moment from 'moment';
import { toast } from 'react-toastify';
import RemedyModal from './RemedyModal';

// Initialize a markdown parser
const mdParser = new MarkdownIt(/* Markdown-it options */);





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

    async componentDidMount() {

        this.getDataPatient();
    }
    getDataPatient = async () => {
        let {user} = this.props;
        let {currentDate} = this.state;
        let formatedDate= new Date(currentDate).getTime();
        let data = await getAllPatientForDoctor({doctorId: user.doctorId, date: formatedDate});
        if(data && data.errCode === 0){
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
        let {dataPatient, isOpenRemedyModal, isShowLoading, dataModal} = this.state;
        let language = this.props.language;
        return (
            <>
                <div className='manage-patient-container'>
                    <div className='m-p-tilte'>
                    Quản lý bệnh nhân khám bệnh
                </div>
                <div className='manage-patient-body row'>
                    <div className='col-4 form-group'>
                        <label>Chọn ngay kham</label>
                        <DatePicker
                            onChange={this.handleOnChangeDatePicker}
                            className='form-control'
                            value={this.state.currentDate}
                        />
                    </div>
                    <div className='col-12 table-manage-patient'>
                        <table id="TableManagePatient" width="100%">
                            <tbody>
                                <tr>
                                    <th>STT</th>
                                    <th>Thời gian</th>
                                    <th>Họ tên</th>
                                    <th>Địa chỉ</th>
                                    <th>Giới tính</th>
                                    <th>Chức năng</th>
                                </tr>
                                {dataPatient && dataPatient.map((item,index)=>{
                                    let time= language === "vi" ? item.timeTypeDatePatient.valueVi : item.timeTypeDatePatient.valueEn;
                                    let gender = language === "vi" ? item.patientData.genderData.valueVi : item.patientData.genderData.valueEn;
                                    return (
                                        <tr>
                                            <td>{index+1}</td>
                                            <td>{time}</td>
                                            <td>{item.patientData.firstName} {item.patientData.lastName}</td>
                                            <td>{item.patientData.address}</td>
                                            <td>{gender}</td>
                                            <td>
                                                <button className='mp-btn-confirm' onClick={()=>this.btnConfirmBooking(item)}>Chấp nhận</button>
                                                <button className='mp-btn-remedy' onClick={()=>this.btnConfirmRemedy(item)}>Điều trị</button>
                                            </td>
                                        </tr>
                                    )
                                })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <RemedyModal isOpen={isOpenRemedyModal} closeRemedyModal={this.closeRemedyModal} sendRemedy={this.sendRemedy} dataModal={dataModal} />
            </>
        );
    }

}

const mapStateToProps = state => {
    return {

        language: state.app.language,
        user: state.user.userInfo
    };
};

const mapDispatchToProps = dispatch => {
    return {
        
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManagePatient);
