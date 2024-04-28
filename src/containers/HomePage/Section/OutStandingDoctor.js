import React, { Component } from 'react';

import { connect } from 'react-redux';
import './Specialty.scss';
import { FormattedMessage } from 'react-intl';
import Slider from 'react-slick';
import * as actions from '../../../store/actions'
import { LANGUAGES, CRUD_ACTIONS, CommonUtils } from '../../../utils';
import { withRouter } from 'react-router';
class OutStandingDoctor extends Component {

    constructor(props) {
        super(props)
        this.state = {
            arrDoctor: []
        }
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.topDoctorsRedux != this.props.topDoctorsRedux) {
            this.setState({
                arrDoctor: this.props.topDoctorsRedux
            })
        }
    }
    componentDidMount() {
        this.props.loadTopDoctors()
    }
    handleViewDEtailDoctor = (doctor) => {

        this.props.history.push(`/detail-doctor/${doctor.id}`)
    }

    render() {
        console.log("check porops", this.props.topDoctorsRedux)
        let allDoctors = this.state.arrDoctor;
        let { language } = this.props;

        return (
            <div className='section-share section-outstanding-doctor'>
                <div className='section-container'>
                    <div className='section-header'>
                        <span className='title-section'><FormattedMessage id="homepage.outstanding-doctor" /></span>
                        <button className='btn-section'><FormattedMessage id="homepage.more-infor" /></button>
                    </div>
                    <div className='section-body'>
                        <Slider {...this.props.setting}>

                            {allDoctors && allDoctors.length > 0 && allDoctors.map((item, index) => {
                                let imageBase64 = '';
                                if (item.image) {
                                    imageBase64 = new Buffer(item.image, 'base64').toString('binary');
                                }
                                let nameVi = `${item.positionData.valueVi}, ${item.lastName} ${item.firstName} `;
                                let nameEn = `${item.positionData.valueEn}, ${item.firstName} ${item.lastName}`;
                                return (
                                    <div className='section-customize' key={index} onClick={() => this.handleViewDEtailDoctor(item)}>
                                        <div className='customize-border'>
                                            <div className='outer-bg'>
                                                <div className='bg-img section-outstaning-doctor'
                                                    style={{ backgroundImage: `url(${imageBase64})` }}
                                                ></div>
                                            </div>

                                            <div className='position text-center'>
                                                <div>{language === LANGUAGES.VI ? nameVi : nameEn}</div>
                                                <div>Cơ xương khớp 1</div>
                                            </div>
                                        </div>

                                    </div>
                                )
                            })}


                        </Slider>
                    </div>

                </div>
            </div>

        );
    }

}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        isLoggedIn: state.user.isLoggedIn,
        topDoctorsRedux: state.admin.topDoctors
    };
};

const mapDispatchToProps = dispatch => {
    return {
        loadTopDoctors: () => dispatch(actions.fetchTopDoctor()),

    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(OutStandingDoctor));
