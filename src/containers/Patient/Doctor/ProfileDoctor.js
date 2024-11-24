import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import './DoctorExtraInfor.scss';
import * as actions from "../../../store/actions";
import { getExtraInforDoctorById, getProfileDoctorById } from '../../../services/userService';
import NumberFormat from 'react-number-format';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import './Booking.Modal.scss';
import 'react-markdown-editor-lite/lib/index.css';
import { LANGUAGES } from '../../../utils';
import Select from 'react-select';
import { Modal } from 'reactstrap';
import './ProfileDoctor.scss';


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
        this.setState({
            dataProfile: data
        })
    }
    getInforDoctor = async (doctorId) => {
        let result = {}
        if (doctorId) {
            let data = await getProfileDoctorById(doctorId)
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

    render() {
        let { dataProfile } = this.state
        let { language } = this.props

        let nameVi = '', nameEn = ''
        if (dataProfile && dataProfile.positionData) {
            nameVi = `${dataProfile.positionData.valueVi}, ${dataProfile.lastName} ${dataProfile.firstName}`
            nameEn = `${dataProfile.positionData.valueEn}, ${dataProfile.firstName} ${dataProfile.lastName}`
        }

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
                            {dataProfile && dataProfile.Markdown && dataProfile.Markdown.description && <span>{dataProfile.Markdown.description}</span>}
                        </div>
                    </div>
                </div>
                <div className='price'>
                    gia kham :
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
