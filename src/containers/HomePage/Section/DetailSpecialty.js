import React, { Component } from 'react';
import { connect } from 'react-redux';
import HomeHeader from '../HomeHeader';
import DoctorExtraInfor from '../../Patient/Doctor/DoctorExtraInfor';
import ProfileDoctor from '../../Patient/Doctor/ProfileDoctor';
import DoctorSchedule from '../../Patient/Doctor/DoctorSchedule';
import { getAllDetailSpecialtyById, getAllProvince } from '../../../services/userService';
import { LANGUAGES } from '../../../utils';
import _ from 'lodash';
import './DetailSpecialty.scss';

class DetailSpecialty extends Component {
    constructor(props) {
        super(props);
        this.state = {
            arrDoctorId: [],
            dataDetailSpecialty: {},
            listProvince: [],
            selectedLocation: 'ALL'
        }
    }

    async componentDidMount(){
        if(this.props.match && this.props.match.params && this.props.match.params.id){
            let res = await getAllDetailSpecialtyById({
                id: this.props.match.params.id,
                location: 'ALL'
            });
            let resProvince = await getAllProvince('PROVINCE');
            if(res && res.errCode === 0 && resProvince && resProvince.errCode === 0){
                let data = res.data;
                let arrDoctorId = [];
                if(data && !_.isEmpty(res.data)){
                    let arr = data.DoctorSpecialty;
                    if(arr && arr.length > 0){
                        arr.forEach(item => {
                            arrDoctorId.push(item.doctorId);
                        });
                    }
                }
                let dataProvince = resProvince.data;
                if(dataProvince && dataProvince.length > 0){
                    dataProvince.unshift({
                        createdAt: null,
                        keyMap: 'ALL',
                        type: 'PROVINCE',
                        valueVi: 'Toàn quốc',
                        valueEn: 'All'
                    })
                }
                this.setState({
                    dataDetailSpecialty: data,
                    arrDoctorId: arrDoctorId,
                    listProvince: dataProvince ? dataProvince : []
                })
            }
        }
    }
    componentDidUpdate(prevProps, prevState, snapshot){
        if(this.props.language !== prevProps.language){
        }
    }

    handleOnchangeSelect = async (event) => {
        if(this.props.match && this.props.match.params && this.props.match.params.id){
            let res = await getAllDetailSpecialtyById({
                id: this.props.match.params.id,
                location: event.target.value
            });
            if(res && res.errCode === 0){
                let data = res.data;
                let arrDoctorId = [];
                if(data && !_.isEmpty(data)){
                    let arr = data.DoctorSpecialty;
                    if(arr && arr.length > 0){
                        arr.forEach(item => {
                            arrDoctorId.push(item.doctorId);
                        });
                    }
                }
                this.setState({
                    dataDetailSpecialty: data,
                    arrDoctorId: arrDoctorId
                })
            }
        }
        
    }

    render() {
        const { arrDoctorId, dataDetailSpecialty, listProvince } = this.state;
        const { language } = this.props;

        return (
            <div className='specialty-container'>
                <HomeHeader />
                
                <div className='specialty-banner'>
                    <div className='specialty-overlay'></div>
                    <div className='specialty-content'>
                        <h1 className='specialty-title'>
                            {dataDetailSpecialty.name}
                        </h1>
                    </div>
                </div>

                <div className='specialty-body'>
                    <div className='specialty-description'>
                        {dataDetailSpecialty && !_.isEmpty(dataDetailSpecialty) && (
                            <div className='description-content'
                                dangerouslySetInnerHTML={{ 
                                    __html: dataDetailSpecialty.descriptionHTML 
                                }}>
                            </div>
                        )}
                    </div>

                    <div className='location-filter'>
                        <div className='filter-wrapper'>
                            <i className="fas fa-map-marker-alt"></i>
                            <select 
                                onChange={this.handleOnchangeSelect}
                                value={this.state.selectedLocation}
                            >
                                {listProvince.map((item, index) => (
                                    <option key={index} value={item.keyMap}>
                                        {language === LANGUAGES.VI ? item.valueVi : item.valueEn}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className='doctor-list'>
                        {arrDoctorId.map((doctorId, index) => (
                            <div className='doctor-card' key={index}>
                                <div className='card-left'>
                                    <ProfileDoctor
                                        doctorId={doctorId}
                                        isShowDescription={false}
                                        isShowLinkDetail={true}
                                        isShowPrice={false}
                                    />
                                </div>
                                
                                <div className='card-right'>
                                    <div className='schedule-section'>
                                        <h3 className='section-title'>
                                            <i className="far fa-calendar-alt"></i>
                                            {language === LANGUAGES.VI ? 'Lịch khám' : 'Schedule'}
                                        </h3>
                                        <DoctorSchedule doctorIdFromParent={doctorId} />
                                    </div>
                                    
                                    <div className='extra-info-section'>
                                        <h3 className='section-title'>
                                            <i className="fas fa-info-circle"></i>
                                            {language === LANGUAGES.VI ? 'Thông tin thêm' : 'Extra Info'}
                                        </h3>
                                        <DoctorExtraInfor doctorIdFromParent={doctorId} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    language: state.app.language,
});

export default connect(mapStateToProps)(DetailSpecialty);
