import React, { Component } from 'react';
import { connect } from 'react-redux';
import HomeHeader from '../../HomePage/HomeHeader';
import './DoctorSchedule.scss';
import { getDEtailInforDoctor, getScheduleByDate } from '../../../services/userService';
import { LANGUAGES } from '../../../utils';
import moment from 'moment';
import 'moment/locale/vi';
import { FormattedMessage } from 'react-intl';
import BookingModal from './BookingModal';
class DoctorSchedule extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allDays: [],
            allAvailableTime: [],
            isOpenModalBooking: false,
            dataScheduleTimeModal: {}
        };
    }

    async componentDidMount() {
        const { language } = this.props;
        const allDays = this.getArrDays(language);
        if(this.props.doctorIdFromParent){
            const res = await getScheduleByDate(this.props.doctorIdFromParent, allDays[0].value);
            this.setState({
                allAvailableTime: res.data || []
            })
        }
    }

    async componentDidUpdate(prevProps) {
        if (this.props.language !== prevProps.language) {
            const allDays = this.getArrDays(this.props.language);
            this.setState({ allDays });
        }
        if (this.props.doctorIdFromParent !== prevProps.doctorIdFromParent) {
            const allDays = this.getArrDays(this.props.language);
            const res = await getScheduleByDate(this.props.doctorIdFromParent, allDays[0].value);
            console.log(res)

            this.setState({ allAvailableTime: res.data || [] });
        }
    }

    capitallizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    getArrDays = (language) => {
        const allDays = [];
        for (let i = 0; i < 7; i++) {
            const object = {};
            if (language === LANGUAGES.VI) {
                if (i === 0) {
                    const ddMM = moment(new Date()).format('DD/MM');
                    object.label = `Hôm nay - ${ddMM}`;
                } else {
                    const labelVi = moment(new Date()).add(i, 'days').format('dddd - DD/MM');
                    object.label = this.capitallizeFirstLetter(labelVi);
                }
            } else {
                if (i === 0) {
                    const ddMM = moment(new Date()).format('DD/MM');
                    object.label = `Today - ${ddMM}`;
                } else {
                    object.label = moment(new Date()).add(i, 'days').locale('en').format('dddd - DD/MM');
                }
            }
            object.value = moment(new Date()).add(i, 'days').startOf('day').valueOf();
            allDays.push(object);
        }
        return allDays;
    };

    handleOnChangeSelect = async (event) => {
        if (this.props.doctorIdFromParent && this.props.doctorIdFromParent !== -1) {
            const doctorId = this.props.doctorIdFromParent;
            const date = event.target.value;
            const res = await getScheduleByDate(doctorId, date);

            if (res && res.errCode === 0) {
                this.setState({ allAvailableTime: res.data || [] });
            }
            console.log(res);
        }
    };

    hanleClickScheduleTime = (time) => {
        this.setState({ isOpenModalBooking: true, dataScheduleTimeModal: time });
    }
    closeModalBooking = () => {
        this.setState({ isOpenModalBooking: false });
    }

    render() {
        const { allDays, allAvailableTime, isOpenModalBooking, dataScheduleTimeModal } = this.state;
        const { language } = this.props;
        console.log(dataScheduleTimeModal);
        return (
            <>
                <div className="doctor-schedule-container">
                    <div className="all-schedule">
                        <select onChange={this.handleOnChangeSelect}>
                            {allDays.map((item, index) => (
                                <option value={item.value} key={index}>
                                {item.label}
                                </option>
                            ))}
                        </select>
                    </div>
                <div className="all-available-time">
                    <div className="text-calendar">
                        <i className="fas fa-calendar-alt">
                            <span>
                                <FormattedMessage id="patient.detail-doctor.schedule" />
                            </span>
                        </i>
                    </div>
                    <div className="time-content">
                        {allAvailableTime.length > 0 ? (
                            <>
                                <div className="time-content-btns">
                                    {allAvailableTime.map((item, index) => {
                                        const timeDisplay =
                                            language === LANGUAGES.VI
                                                ? item.timeTypeData.valueVi
                                                : item.timeTypeData.valueEn;
                                        return (
                                            <button
                                                key={index}
                                                className={language === LANGUAGES.VI ? 'btn-vie' : 'btn-en'}
                                                onClick={() => this.hanleClickScheduleTime(item)}
                                            >
                                                {timeDisplay}
                                            </button>
                                        );
                                    })}
                                </div>
                                <div className="book-free">
                                    <span>
                                        <FormattedMessage id="patient.detail-doctor.choose" />
                                        <i className="far fa-hand-point-up"></i>
                                        <FormattedMessage id="patient.detail-doctor.book-free" />
                                    </span>
                                </div>
                            </>
                        ) : (
                            <div className="no-schedule">
                                <FormattedMessage id="patient.detail-doctor.no-schedule" />
                            </div>
                        )}
                        </div>
                    </div>
                </div>
                <BookingModal
                    isOpen={isOpenModalBooking}
                    dataScheduleTimeModal={dataScheduleTimeModal}
                    closeModalBooking={this.closeModalBooking}
                />
            </>
        );
    }
}

const mapStateToProps = (state) => ({
    language: state.app.language,
});

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(DoctorSchedule);
