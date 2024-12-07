import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import Select from 'react-select';
import DatePicker from '../../../components/Input/DatePicker';
import { toast } from 'react-toastify';
import moment from 'moment';
import _ from 'lodash';
import * as actions from "../../../store/actions";
import { LANGUAGES } from '../../../utils';
import { saveBulkScheduleDoctor } from '../../../services/userService';
import './ManageSchedule.scss';

class ManageSchedule extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listDoctors: [],
            selectedDoctor: {},
            currentDate: '',
            rangeTime: [],

        }
    }
    componentDidMount() {
        this.props.fetchAllDoctorRedux();
        this.props.fetchAllScheduleTime();
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.allDoctors !== this.props.allDoctors) {
            let dataSelect = this.buildDataInputSelect(this.props.allDoctors)
            this.setState({
                listDoctors: dataSelect
            })

        }
        if (prevProps.allScheduleTime !== this.props.allScheduleTime) {
            let data = this.props.allScheduleTime;
            if (data && data.length > 0) {
                // data = data.map(item => {  // them 1 bien
                //     item.isSelected = false;
                //     return item
                // })
                data = data.map(item => ({ ...item, isSelected: false })) // them 1 bien
            }
            this.setState({
                rangeTime: data
            })
        }
    }
    buildDataInputSelect = (inputData) => {
        let result = [];
        let { language } = this.props;
        if (inputData && inputData.length > 0) {
            inputData.map((item, index) => {
                let object = {};
                let labelVi = `${item.lastName} ${item.firstName}`
                let labelEn = `${item.firstName} ${item.lastName} `
                object.label = language === LANGUAGES.VI ? labelVi : labelEn;
                object.value = item.id;
                result.push(object);
            })

        }
        return result
    }
    handleChangeSelect = async (selectedDoctor) => {
        this.setState({ selectedDoctor: selectedDoctor });

    };
    handleOnchangeDatePicker = (date) => {
        this.setState({
            currentDate: date[0]
        })
    }
    hadleClickBtnTime = (time) => {

        let { rangeTime } = this.state;
        if (rangeTime && rangeTime.length > 0) {
            rangeTime = rangeTime.map(item => {
                if (item.id === time.id) {
                    item.isSelected = !item.isSelected;

                }
                return item
            })

            this.setState({
                rangeTime: rangeTime
            })
        }
    }
    handleSaveSchedule = async () => {
        let { rangeTime, selectedDoctor, currentDate } = this.state;

        let result = [];
        if (!currentDate) {
            toast.error("Invalid date !")
            return
        }
        if (selectedDoctor && _.isEmpty(selectedDoctor)) {
            toast.error("Invalid selected Doctor!")
            return
        }
        // let formatedDate = moment(currentDate).format(dateFormat.SEND_TO_SERVER);
        // let formatedDate = moment(currentDate).unix();
        let formatedDate = new Date(currentDate).getTime(); //format date

        if (rangeTime && rangeTime.length > 0) {
            let selectedTime = rangeTime.filter(item => item.isSelected === true);
            if (selectedTime && selectedTime.length > 0) {
                selectedTime.map(schedule => {
                    let object = {};
                    object.doctorId = selectedDoctor.value;
                    object.date = "" + formatedDate;
                    object.timeType = schedule.keyMap;
                    result.push(object)
                })
            }
            else {
                toast.error("Invalid selected time!")
                return
            }

        }
        let res = await saveBulkScheduleDoctor({
            arrSchedule: result,
            doctorId: selectedDoctor.value,
            formatedDate: formatedDate
        })
        if (res && res.errCode === 0) {
            toast.success("Save Infor succeed");
        }
        else {
            toast.error("error save Bulk Schedule Doctor");
        }

    }
    render() {
        const { language } = this.props;
        const { rangeTime, selectedDoctor, currentDate } = this.state;
        const yesterday = new Date(new Date().setDate(new Date().getDate() - 1));

        return (
            <div className='schedule-container'>
                <div className='schedule-header'>
                    <h2 className='page-title'>
                        <i className="fas fa-calendar-alt"></i>
                        <FormattedMessage id="manage-schedule.title" />
                    </h2>
                </div>

                <div className='schedule-content'>
                    <div className='schedule-form'>
                        <div className='form-row'>
                            <div className='form-group'>
                                <label>
                                    <i className="fas fa-user-md"></i>
                                    <FormattedMessage id="manage-schedule.choose-doctor" />
                                </label>
                                <Select
                                    value={selectedDoctor}
                                    onChange={this.handleChangeSelect}
                                    options={this.state.listDoctors}
                                    className='doctor-select'
                                    placeholder={<FormattedMessage id="manage-schedule.select-doctor" />}
                                />
                            </div>

                            <div className='form-group'>
                                <label>
                                    <i className="fas fa-calendar"></i>
                                    <FormattedMessage id="manage-schedule.choose-date" />
                                </label>
                                <DatePicker
                                    onChange={this.handleOnchangeDatePicker}
                                    className='date-picker'
                                    selected={currentDate}
                                    minDate={yesterday}
                                    placeholderText={language === LANGUAGES.VI ? 'Chọn ngày' : 'Select date'}
                                />
                            </div>
                        </div>

                        <div className='time-slots-container'>
                            <h3 className='time-slots-title'>
                                <i className="fas fa-clock"></i>
                                <FormattedMessage id="manage-schedule.choose-time" />
                            </h3>
                            <div className='time-slots-grid'>
                                {rangeTime && rangeTime.map((item, index) => (
                                    <button
                                        key={index}
                                        className={`time-slot ${item.isSelected ? 'active' : ''}`}
                                        onClick={() => this.hadleClickBtnTime(item)}
                                    >
                                        <span className='time-text'>
                                            {language === LANGUAGES.VI ? item.valueVi : item.valueEn}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className='form-actions'>
                            <button 
                                className='save-button'
                                onClick={this.handleSaveSchedule}
                            >
                                <i className="fas fa-save"></i>
                                <FormattedMessage id="manage-schedule.save" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    allDoctors: state.admin.allDoctors,
    language: state.app.language,
    isLoggedIn: state.user.isLoggedIn,
    allScheduleTime: state.admin.allScheduleTime,
});

const mapDispatchToProps = dispatch => ({
    fetchAllDoctorRedux: () => dispatch(actions.fetchAllDoctor()),
    fetchAllScheduleTime: () => dispatch(actions.fetchAllScheduleTime()),
});

export default connect(mapStateToProps, mapDispatchToProps)(ManageSchedule);
