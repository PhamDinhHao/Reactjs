import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import './DoctorExtraInfor.scss';
import { getExtraInforDoctorById } from '../../../services/userService';
import NumberFormat from 'react-number-format';
import { LANGUAGES } from '../../../utils';

class DoctorExtraInfor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isShowDetailInfor: false,
            extraInfor: {}
        }
    }

    async componentDidMount() {
        if (this.props.doctorIdFromParent) {
            let res = await getExtraInforDoctorById(this.props.doctorIdFromParent)
            console.log('res', res)
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
        let { isShowDetailInfor, extraInfor } = this.state;
        let { language } = this.props;

        return (
            <div className='doctor-extra-infor-container'>
                <div className='clinic-info'>
                    <div className='info-header'>
                        <i className="fas fa-hospital-alt"></i>
                        <FormattedMessage id='patient.extra-infor-doctor.text-address' />
                    </div>
                    
                    {extraInfor && extraInfor.nameClinic && (
                        <div className='clinic-name'>
                            <h3>{extraInfor.nameClinic}</h3>
                            <div className='clinic-address'>
                                <i className="fas fa-map-marker-alt"></i>
                                {extraInfor.addresClinic}
                            </div>
                        </div>
                    )}
                </div>

                <div className='price-info'>
                    {!isShowDetailInfor ? (
                        <div className='price-summary'>
                            <div className='price-header'>
                                <i className="fas fa-money-bill-wave"></i>
                                <FormattedMessage id='patient.extra-infor-doctor.price' />
                            </div>
                            
                            <div className='price-content'>
                                {extraInfor?.priceTypeData && (
                                    <NumberFormat 
                                        value={language === LANGUAGES.VI ? 
                                            extraInfor.priceTypeData.valueVi : 
                                            extraInfor.priceTypeData.valueEn} 
                                        className='price-amount' 
                                        displayType='text' 
                                        thousandSeparator={true} 
                                        suffix={language === LANGUAGES.VI ? 'VND' : 'USD'} 
                                    />
                                )}
                                <button 
                                    className='show-detail-btn'
                                    onClick={() => this.showDetailInfor(true)}
                                >
                                    <i className="fas fa-info-circle"></i>
                                    <FormattedMessage id='patient.extra-infor-doctor.detail' />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className='price-details'>
                            <div className='details-header'>
                                <i className="fas fa-file-invoice-dollar"></i>
                                <FormattedMessage id='patient.extra-infor-doctor.price' />
                            </div>

                            <div className='price-breakdown'>
                                <div className='price-row'>
                                    <span className='label'>
                                        <FormattedMessage id='patient.extra-infor-doctor.price' />
                                    </span>
                                    <NumberFormat 
                                        value={language === LANGUAGES.VI ? 
                                            extraInfor?.priceTypeData?.valueVi : 
                                            extraInfor?.priceTypeData?.valueEn} 
                                        className='amount' 
                                        displayType='text' 
                                        thousandSeparator={true} 
                                        suffix={language === LANGUAGES.VI ? 'VND' : 'USD'} 
                                    />
                                </div>

                                {extraInfor?.note && (
                                    <div className='note-section'>
                                        <i className="fas fa-sticky-note"></i>
                                        {extraInfor.note}
                                    </div>
                                )}

                                <div className='payment-method'>
                                    <i className="fas fa-credit-card"></i>
                                    <span className='label'>
                                        <FormattedMessage id='patient.extra-infor-doctor.payment' />
                                    </span>
                                    <span className='method'>
                                        {extraInfor?.paymentTypeData && 
                                            (language === LANGUAGES.VI ? 
                                                extraInfor.paymentTypeData.valueVi : 
                                                extraInfor.paymentTypeData.valueEn)
                                        }
                                    </span>
                                </div>
                            </div>

                            <button 
                                className='hide-detail-btn'
                                onClick={() => this.showDetailInfor(false)}
                            >
                                <i className="fas fa-chevron-up"></i>
                                <FormattedMessage id='patient.extra-infor-doctor.hide-price' />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    language: state.app.language,
});

export default connect(mapStateToProps)(DoctorExtraInfor);
