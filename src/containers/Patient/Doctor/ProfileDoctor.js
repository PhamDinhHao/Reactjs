import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import NumberFormat from 'react-number-format';
import moment from 'moment';
import _ from 'lodash';
import { LANGUAGES } from '../../../utils';
import { getDEtailInforDoctor } from '../../../services/userService';
import './ProfileDoctor.scss';

class ProfileDoctor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataProfile: {},
            isLoading: true
        }
    }

    async componentDidMount() {
        const data = await this.getInforDoctor(this.props.doctorId);
        this.setState({
            dataProfile: data,
            isLoading: false
        });
    }

    getInforDoctor = async (doctorId) => {
        let result = {};
        if (doctorId) {
            const res = await getDEtailInforDoctor(doctorId);
            if (res && res.errCode === 0) {
                result = res.data;
            }
        }
        return result;
    }

    renderTimeBooking = (dataTime) => {
        const { language } = this.props;
        
        if (dataTime && !_.isEmpty(dataTime)) {
            const time = language === LANGUAGES.VI ? 
                dataTime.timeTypeData.valueVi : 
                dataTime.timeTypeDataEn.valueEn;
            
            const date = language === LANGUAGES.VI ? 
                moment.unix(dataTime.date/1000).format('DD/MM/YYYY') : 
                moment.unix(dataTime.dateEn/1000).format('DD/MM/YYYY');

            return (
                <div className='booking-time'>
                    <div className='time-slot'>
                        <i className="far fa-clock"></i>
                        <span>{time}</span>
                    </div>
                    <div className='date'>
                        <i className="far fa-calendar-alt"></i>
                        <span>{date}</span>
                    </div>
                    <div className='booking-note'>
                        <i className="fas fa-info-circle"></i>
                        <FormattedMessage id="patient.booking-modal.price-booking-modal"/>
                    </div>
                </div>
            );
        }
        return null;
    }

    render() {
        const { dataProfile, isLoading } = this.state;
        const { 
            language, 
            isshowDescriptionDoctor, 
            dataTime, 
            isShowPrice, 
            isShowLinkDetail, 
            doctorId 
        } = this.props;

        if (isLoading) {
            return <div className="profile-loading">
                <i className="fas fa-circle-notch fa-spin"></i>
            </div>;
        }

        const nameVi = dataProfile?.positionData ? 
            `${dataProfile.positionData.valueVi}, ${dataProfile.lastName} ${dataProfile.firstName}` : '';
        const nameEn = dataProfile?.positionData ? 
            `${dataProfile.positionData.valueEn}, ${dataProfile.firstName} ${dataProfile.lastName}` : '';

        return (
            <div className='profile-doctor-container'>
                <div className='doctor-intro'>
                    <div 
                        className='doctor-image' 
                        style={{
                            backgroundImage: `url(${dataProfile?.image || ''})`
                        }}
                    >
                        {!dataProfile?.image && 
                            <i className="fas fa-user-md placeholder-icon"></i>
                        }
                    </div>
                    
                    <div className='doctor-info'>
                        <h2 className='doctor-name'>
                            {language === LANGUAGES.VI ? nameVi : nameEn}
                        </h2>
                        
                        <div className='doctor-description'>
                            {isshowDescriptionDoctor ? (
                                <p>{dataProfile?.Markdown?.description}</p>
                            ) : (
                                this.renderTimeBooking(dataTime)
                            )}
                        </div>

                        {isShowPrice && (
                            <div className='price-section'>
                                <i className="fas fa-tag"></i>
                                <span className='price-label'>
                                    <FormattedMessage id="patient.extra-infor-doctor.price"/>
                                </span>
                                <span className='price-amount'>
                                    {dataProfile?.Doctor_Infor && (
                                        <NumberFormat 
                                            value={dataProfile.Doctor_Infor.priceTypeData}
                                            displayType={'text'}
                                            thousandSeparator={true}
                                            suffix={language === LANGUAGES.VI ? ' VND' : ' USD'}
                                            className='price-value'
                                        />
                                    )}
                                </span>
                            </div>
                        )}

                        {isShowLinkDetail && (
                            <Link to={`/detail-doctor/${doctorId}`} className='view-detail-btn'>
                                <span>
                                    <FormattedMessage id="patient.detail-doctor.view-more"/>
                                </span>
                                <i className="fas fa-chevron-right"></i>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    language: state.app.language,
});

export default connect(mapStateToProps)(ProfileDoctor);
