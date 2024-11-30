import React, { Component } from 'react';
import { connect } from 'react-redux';
import './DetailSpecialty.scss';
import HomeHeader from '../HomeHeader';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import DoctorExtraInfor from '../../Patient/Doctor/DoctorExtraInfor';
import ProfileDoctor from '../../Patient/Doctor/ProfileDoctor';
import DoctorSchedule from '../../Patient/Doctor/DoctorSchedule';
import { getAllDetailSpecialtyById, getAllProvince } from '../../../services/userService';
import _ from 'lodash';
import { LANGUAGES } from '../../../utils';
class DetailSpecialty extends Component {
    constructor(props){
        super(props);
        this.state = {
            arrDoctorId: [],
            dataDetailSpecialty: {},
            listProvince: []
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

    render(){
        let {arrDoctorId, dataDetailSpecialty, listProvince} = this.state;
        let {language} = this.props;
        return (
            <><div className='detail-specialty-container'>
                <HomeHeader />
                <div className='detail-specialty-body'>
                    <div className='description-specialty'>
                        {dataDetailSpecialty && !_.isEmpty(dataDetailSpecialty) && (
                            <div dangerouslySetInnerHTML={{__html: dataDetailSpecialty.descriptionHTML}}></div>
                        )}
                    </div>
                    <div className='search-sp-docter'>
                        <select onChange={(event) => this.handleOnchangeSelect(event)}>
                            {listProvince.map((item, index) => {
                                return <option key={index} value={item.keyMap}>{language === LANGUAGES.VI ? item.valueVi : item.valueEn}</option>
                            })}
                        </select>
                    </div>
                    {arrDoctorId.length > 0 && arrDoctorId.map((item, index) => {
                        return <div className='each-doctor' key={index}>
                            <div className='dt-content-left'>
                                <div className='profile-doctor'>
                                    <ProfileDoctor
                                        doctorId={item}
                                        isShowDescription={false}
                                        isShowLinkDetail={false}
                                        isShowPrice={false}
                                    />
                                </div>
                            </div>
                            <div className='dt-content-right'>
                                <div className='doctor-schedule'>
                                    <DoctorSchedule
                                        doctorIdFromParent={item}
                                    />
                                </div>
                                <div className='doctor-extra-info'>
                                    <DoctorExtraInfor
                                        doctorIdFromParent={item}
                                    />
                                </div>
                            </div>
                        </div>
                    })}
                </div>
            </div>
                
                
            </>

        )
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

export default connect(mapStateToProps, mapDispatchToProps)(DetailSpecialty);
