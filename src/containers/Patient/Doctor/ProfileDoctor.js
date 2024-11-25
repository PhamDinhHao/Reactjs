import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import './DoctorExtraInfor.scss';
import * as actions from "../../../store/actions";
import { getDEtailInforDoctor, getExtraInforDoctorById, getProfileDoctorById } from '../../../services/userService';
import NumberFormat from 'react-number-format';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import './Booking.Modal.scss';
import 'react-markdown-editor-lite/lib/index.css';
import { LANGUAGES } from '../../../utils';
import Select from 'react-select';
import { Modal } from 'reactstrap';
import './ProfileDoctor.scss';
import _ from 'lodash';
import moment from 'moment'

// Initialize a markdown parser
const mdParser = new MarkdownIt(/* Markdown-it options */);





class ProfileDoctor extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dataProfile:{}
        }
    }

    async componentDidMount() {
        let data = await this.getInforDoctor(this.props.doctorId)
        console.log(data);
        
        this.setState({
            dataProfile: data
        })
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
    renderTimeBooking = (dataTime) => {
        let language = this.props.language
        if(dataTime && !_.isEmpty(dataTime)){
            let time = language === LANGUAGES.VI ? dataTime.timeTypeData.valueVi : dataTime.timeTypeDataEn.valueEn
            let date = language === LANGUAGES.VI ? moment.unix(dataTime.date/1000).format('DD/MM/YYYY') : moment.unix(dataTime.dateEn/1000).format('DD/MM/YYYY')
            return (<>
                <div className='time-content'>{time} - {date}</div>
                <div><FormattedMessage id="patient.booking-modal.price-booking-modal"/></div>
            </>)
        }
    }

    render() {
        let { dataProfile } = this.state
        let { language,isshowDescriptionDoctor, dataTime } = this.props

        let nameVi = '', nameEn = ''
        if (dataProfile && dataProfile.positionData) {
            nameVi = `${dataProfile.positionData.valueVi}, ${dataProfile.lastName} ${dataProfile.firstName}`
            nameEn = `${dataProfile.positionData.valueEn}, ${dataProfile.firstName} ${dataProfile.lastName}`
        }
        console.log(dataProfile)
        return (
            <div className='profile-doctor-container'>
                <div className='intro-doctor'>
                    <div className='content-left' style={{backgroundImage: `url(${dataProfile && dataProfile.image ? dataProfile.image : ''})`}}>
                    </div>
                    <div className='content-right'>
                        <div className='up'>
                            {language === LANGUAGES.VI ? nameVi : nameEn}
                        </div>
                        <div className='down'>
                            {isshowDescriptionDoctor === true ? <> {dataProfile && dataProfile.Markdown && dataProfile.Markdown.description && <span>{dataProfile.Markdown.description}</span>}</> : <>
                            {this.renderTimeBooking(dataTime)}</>}
                        </div>
                    </div>
                </div>
                <div className='price'>
                    <FormattedMessage id="patient.extra-infor-doctor.price"/>
                    {dataProfile && dataProfile.Doctor_Infor && language === LANGUAGES.VI && <NumberFormat className='currency' value={dataProfile.Doctor_Infor.priceTypeData} displayType={'text'} thousandSeparator={true} suffix='VND' />}
                    {dataProfile && dataProfile.Doctor_Infor && language === LANGUAGES.EN && <NumberFormat className='currency' value={dataProfile.Doctor_Infor.priceTypeData} displayType={'text'} thousandSeparator={true} suffix='USD' />}
                </div>
            </div>
        );
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

export default connect(mapStateToProps, mapDispatchToProps)(ProfileDoctor);
