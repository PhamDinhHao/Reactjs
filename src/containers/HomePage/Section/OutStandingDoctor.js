import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { FormattedMessage } from 'react-intl';
import Slider from 'react-slick';
import * as actions from '../../../store/actions';
import { LANGUAGES } from '../../../utils';
import './OutStandingDoctor.scss';

class OutStandingDoctor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            arrDoctor: []
        };
    }

    componentDidMount() {
        this.props.loadTopDoctors();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.topDoctorsRedux !== this.props.topDoctorsRedux) {
            this.setState({
                arrDoctor: this.props.topDoctorsRedux
            });
        }
    }

    handleViewDetailDoctor = (doctor) => {
        this.props.history.push(`/detail-doctor/${doctor.id}`);
    }

    render() {
        const { arrDoctor } = this.state;
        const { language } = this.props;

        return (
            <div className='outstanding-doctor-section'>
                <div className='section-container'>
                    <div className='section-header'>
                        <div className='header-content'>
                            <h2 className='title'>
                                <i className="fas fa-user-md"></i>
                                <FormattedMessage id="homepage.outstanding-doctor" />
                            </h2>
                            <button className='view-more-btn'>
                                <FormattedMessage id="homepage.more-infor" />
                                <i className="fas fa-arrow-right"></i>
                            </button>
                        </div>
                    </div>

                    <div className='section-body'>
                        <Slider {...this.props.setting}>
                            {arrDoctor && arrDoctor.length > 0 && arrDoctor.map((item, index) => {
                                const imageBase64 = item.image ? 
                                    new Buffer(item.image, 'base64').toString('binary') : '';
                                const nameVi = `${item.positionData.valueVi}, ${item.lastName} ${item.firstName}`;
                                const nameEn = `${item.positionData.valueEn}, ${item.firstName} ${item.lastName}`;

                                return (
                                    <div className='doctor-card' key={index}>
                                        <div className='card-content' 
                                             onClick={() => this.handleViewDetailDoctor(item)}>
                                            <div className='doctor-image'>
                                                <div className='image-container'>
                                                    <div className='image'
                                                         style={{ backgroundImage: `url(${imageBase64})` }}>
                                                    </div>
                                                </div>
                                                <div className='specialty-badge'>
                                                    <i className="fas fa-stethoscope"></i>
                                                    Cơ xương khớp
                                                </div>
                                            </div>

                                            <div className='doctor-info'>
                                                <h3 className='doctor-name'>
                                                    {language === LANGUAGES.VI ? nameVi : nameEn}
                                                </h3>
                                                <div className='specialty'>
                                                    <i className="fas fa-hospital"></i>
                                                    <span>Cơ xương khớp 1</span>
                                                </div>
                                                <div className='view-profile'>
                                                    <FormattedMessage id="homepage.view-profile" />
                                                    <i className="fas fa-chevron-right"></i>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </Slider>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    language: state.app.language,
    isLoggedIn: state.user.isLoggedIn,
    topDoctorsRedux: state.admin.topDoctors
});

const mapDispatchToProps = dispatch => ({
    loadTopDoctors: () => dispatch(actions.fetchTopDoctor()),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(OutStandingDoctor));
