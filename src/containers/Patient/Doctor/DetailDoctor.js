import React, { Component } from 'react';
import { connect } from "react-redux";
import HomeHeader from '../../HomePage/HomeHeader';
import './DetailDoctor.scss';
import { getDEtailInforDoctor } from '../../../services/userService';
import { LANGUAGES } from '../../../utils';
import DoctorSchedule from './DoctorSchedule';
import DoctorExtraInfor from './DoctorExtraInfor';

class DetailDoctor extends Component {
    constructor(props) {
        super(props)
        this.state = {
            detailDoctor: {},
            currentDoctorId: -1,
        }
    }

    async componentDidMount() {
        if (this.props.match && this.props.match.params && this.props.match.params.id) {
            let id = this.props.match.params.id;
            this.setState({
                currentDoctorId: id
            })
            let res = await getDEtailInforDoctor(id);

            if (res && res.errCode === 0) {
                this.setState({
                    detailDoctor: res.data
                })
            }


        }
    }
    componentDidUpdate(prevProps, prevState, snapshot) {

    }
    render() {
        let { detailDoctor, currentDoctorId } = this.state;
        let { language } = this.props;
        let nameVi = '', nameEn = '';
        if (detailDoctor && detailDoctor.positionData) {
            nameVi = `${detailDoctor.positionData.valueVi}, ${detailDoctor.lastName} ${detailDoctor.firstName}`;
            nameEn = `${detailDoctor.positionData.valueEn}, ${detailDoctor.firstName} ${detailDoctor.lastName}`;
        }

        return (
            <div className="doctor-detail-page">
                <HomeHeader isShowBanner={false} />
                
                <div className='doctor-detail-container'>
                    <div className='doctor-intro-container'>
                        <div className='doctor-intro-content'>
                            <div className='doctor-image' 
                                 style={{ backgroundImage: `url(${detailDoctor?.image || ''})` }}>
                            </div>
                            
                            <div className='doctor-info'>
                                <h2 className='doctor-name'>
                                    {language === LANGUAGES.VI ? nameVi : nameEn}
                                </h2>
                                
                                {detailDoctor?.Markdown?.description && (
                                    <div className='doctor-description'>
                                        {detailDoctor.Markdown.description}
                                    </div>
                                )}
                                
                                <div className='doctor-social'>
                                    <button className='share-btn'>
                                        <i className="fas fa-share-alt"></i> Chia sẻ
                                    </button>
                                    <button className='like-btn'>
                                        <i className="far fa-heart"></i> Lưu thông tin
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='doctor-detail-body'>
                        <div className='schedule-section'>
                            <div className='schedule-container'>
                                <div className='schedule-box'>
                                    <h3 className='section-title'>
                                        <i className="far fa-calendar-alt"></i>
                                        Lịch khám
                                    </h3>
                                    <DoctorSchedule doctorIdFromParent={currentDoctorId} />
                                </div>
                                
                                <div className='extra-info-box'>
                                    <h3 className='section-title'>
                                        <i className="fas fa-info-circle"></i>
                                        Thông tin thêm
                                    </h3>
                                    <DoctorExtraInfor doctorIdFromParent={currentDoctorId} />
                                </div>
                            </div>
                        </div>

                        <div className='detail-section'>
                            {detailDoctor?.Markdown?.contentHTML && (
                                <div className='detail-content'>
                                    <h3 className='section-title'>
                                        <i className="fas fa-user-md"></i>
                                        Thông tin chi tiết
                                    </h3>
                                    <div className='markdown-content'
                                         dangerouslySetInnerHTML={{ __html: detailDoctor.Markdown.contentHTML }}>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className='comment-section'>
                            <h3 className='section-title'>
                                <i className="far fa-comments"></i>
                                Đánh giá từ bệnh nhân
                            </h3>
                            {/* Add comment component here */}
                        </div>
                    </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(DetailDoctor);
