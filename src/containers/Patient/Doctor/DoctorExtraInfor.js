import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import './DoctorExtraInfor.scss';
import * as actions from "../../../store/actions";
import { getExtraInforDoctorById } from '../../../services/userService';
import NumberFormat from 'react-number-format';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';

import 'react-markdown-editor-lite/lib/index.css';

import Select from 'react-select';
import { CRUD_ACTIONS, LANGUAGES } from '../../../utils';




// Initialize a markdown parser
const mdParser = new MarkdownIt(/* Markdown-it options */);





class DoctorExtraInfor extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isShowDetailInfor: false,
            extraInfor:{}
        }
    }

    async componentDidMount() {
        if (this.props.doctorIdFromParent) {
            let res = await getExtraInforDoctorById(this.props.doctorIdFromParent)
            if (res && res.errCode === 0) {
                this.setState({
                    extraInfor: res.data
                })
            }
        }
    }
    async componentDidUpdate(prevProps, prevState, snapshot) {

        if (prevProps.language !== this.props.language) {

        }
        if (this.props.doctorIdFromParent !== prevProps.doctorIdFromParent) {
            let res = await getExtraInforDoctorById(this.props.doctorIdFromParent)
            if (res && res.errCode === 0) {
                this.setState({
                    extraInfor: res.data
                })
            }
        }
    }
    showDetailInfor = (status) => {
        this.setState({
            isShowDetailInfor: status
        })
    }
    render() {


        let { isShowDetailInfor, extraInfor } = this.state
        let { language } = this.props

        return (
            <div className='doctor-extra-infor-container'>
                <div className='content-up'>
                    <div className='text-address'>
                        <FormattedMessage id='patient.extra-infor-doctor.text-address' />
                    </div>
                    <div className='name-clinic'>
                        {extraInfor && extraInfor.nameClinic ? extraInfor.nameClinic : ''}
                    </div>
                    <div className='detail-address'>
                        {extraInfor && extraInfor.addresClinic ? extraInfor.addresClinic : ''}
                    </div>
                </div>
                <div className='content-down'>
                    {isShowDetailInfor === false && (
                        <div className='short-infor'>
                            <FormattedMessage id='patient.extra-infor-doctor.price' />
                            {extraInfor && extraInfor.priceTypeData && language === LANGUAGES.VI && (
                                <NumberFormat value={extraInfor.priceTypeData.valueVi} className='currency' displayType='text' thousandSeparator={true} suffix='VND' />
                            )}
                            {extraInfor && extraInfor.priceTypeData && language === LANGUAGES.EN && (
                                <NumberFormat value={extraInfor.priceTypeData.valueEn} className='currency' displayType='text' thousandSeparator={true} suffix='USD' />
                            )}
                            <span onClick={() => this.showDetailInfor(true)}><FormattedMessage id='patient.extra-infor-doctor.detail' /></span>

                        </div>
                    )}
                    {isShowDetailInfor === true && (
                        <>
                            <div className='title-price'><FormattedMessage id='patient.extra-infor-doctor.price' /></div>
                            <div className='detail-infor'>
                                <div className='price'>
                                    <span className='left'><FormattedMessage id='patient.extra-infor-doctor.price' /></span>
                                    {extraInfor && extraInfor.priceTypeData && language === LANGUAGES.VI && (
                                        <span className='right'><NumberFormat value={extraInfor.priceTypeData.valueVi} className='currency' displayType='text' thousandSeparator={true} suffix='VND' /></span>
                                    )}
                                    {extraInfor && extraInfor.priceTypeData && language === LANGUAGES.EN && (
                                        <span className='right'><NumberFormat value={extraInfor.priceTypeData.valueEn} className='currency' displayType='text' thousandSeparator={true} suffix='USD' /></span>
                                    )}
                                </div>
                                <div className='note'>
                                    {extraInfor && extraInfor.note ? extraInfor.note : ''}
                                </div>
                            </div>
                            <div className='payment'>
                                <FormattedMessage id='patient.extra-infor-doctor.payment' />
                                {extraInfor && extraInfor.paymentTypeData && language === LANGUAGES.VI && (
                                    <span>{extraInfor.paymentTypeData.valueVi}</span>
                                )}
                                {extraInfor && extraInfor.paymentTypeData && language === LANGUAGES.EN && (
                                    <span>{extraInfor.paymentTypeData.valueEn}</span>
                                )}
                            </div>
                            <div className='hide-price'>
                                <span onClick={() => this.showDetailInfor(false)}><FormattedMessage id='patient.extra-infor-doctor.hide-price' /></span>
                            </div>
                        </>
                    )}
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

export default connect(mapStateToProps, mapDispatchToProps)(DoctorExtraInfor);
