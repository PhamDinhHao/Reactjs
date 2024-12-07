import React, { Component } from 'react';
import { connect } from "react-redux";
import HomeHeader from '../../HomePage/HomeHeader';
import DoctorSchedule from '../Doctor/DoctorSchedule';
import DoctorExtraInfor from '../Doctor/DoctorExtraInfor';
import ProfileDoctor from '../Doctor/ProfileDoctor';
import { getAllDetailClinicById } from '../../../services/userService';
import { LANGUAGES } from '../../../utils';
import _ from 'lodash';
import './DetailClinic.scss';

class DetailClinic extends Component {
    constructor(props) {
        super(props);
        this.state = {
            arrDoctorId: [],
            dataDetailClinic: {},
            isLoading: true
        }
    }

    convertBufferToBase64 = (imageBuffer) => {
        try {
            if (!imageBuffer || !imageBuffer.data) return '';
            
            // Convert the buffer data directly to base64
            const base64String = Buffer.from(imageBuffer.data).toString('base64');
            return `data:image/jpeg;base64,${base64String}`;
        } catch (error) {
            console.error('Error converting image buffer:', error);
            return '';
        }
    }

    async componentDidMount() {
        if (this.props.match?.params?.id) {
            try {
                const res = await getAllDetailClinicById({ 
                    id: this.props.match.params.id 
                });

                if (res) {
                    const data = res;
                    const arrDoctorId = [];
                    
                    if (data.doctorClinic && !_.isEmpty(data.doctorClinic)) {
                        data.doctorClinic.forEach(element => {
                            arrDoctorId.push(element.doctorId);
                        });
                    }

                    // Convert image buffer to base64
                    const imageUrl = this.convertBufferToBase64(data.image);
                    console.log('Image data:', data.image); // Debug log
                    console.log('Converted image URL:', imageUrl); // Debug log

                    this.setState({
                        dataDetailClinic: {
                            ...data,
                            imageUrl
                        },
                        arrDoctorId,
                        isLoading: false
                    });
                }
            } catch (error) {
                console.error('Error fetching clinic details:', error);
                this.setState({ isLoading: false });
            }
        }
    }

    render() {
        const { dataDetailClinic, arrDoctorId, isLoading } = this.state;
        const { language } = this.props;
        if (isLoading) {
            return (
                <div className="loading-container">
                    <div className="loading-spinner">
                        <i className="fas fa-circle-notch fa-spin"></i>
                    </div>
                </div>
            );
        }

        return (
            <div className='clinic-detail-container'>
                <HomeHeader />
                
                <div className='clinic-banner'>
                    {dataDetailClinic.imageUrl ? (
                        <div 
                            className='clinic-image' 
                            style={{
                                backgroundImage: `url("${dataDetailClinic.imageUrl}")`
                            }}
                        />
                    ) : (
                        <div className="clinic-image-placeholder">
                            <i className="fas fa-hospital-alt"></i>
                        </div>
                    )}
                    <div className='clinic-info'>
                        <h1 className='clinic-name'>
                            {dataDetailClinic.name || 'Clinic Name'}
                        </h1>
                        {dataDetailClinic.address && (
                            <div className='clinic-address'>
                                <i className="fas fa-map-marker-alt"></i>
                                <span>{dataDetailClinic.address}</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className='clinic-body'>
                    {dataDetailClinic.descriptionHTML && (
                        <div className='clinic-description'>
                            <h2>
                                <i className="fas fa-info-circle"></i>
                                {language === LANGUAGES.VI ? 'Giới thiệu' : 'Introduction'}
                            </h2>
                            <div 
                                className='description-content'
                                dangerouslySetInnerHTML={{ 
                                    __html: dataDetailClinic.descriptionHTML 
                                }} 
                            />
                        </div>
                    )}

                    {arrDoctorId.length > 0 && (
                        <div className='clinic-doctors'>
                            <h2>
                                <i className="fas fa-user-md"></i>
                                {language === LANGUAGES.VI ? 
                                    `Đội ngũ bác sĩ (${arrDoctorId.length})` : 
                                    `Our Doctors (${arrDoctorId.length})`
                                }
                            </h2>

                            <div className='doctor-list'>
                                {arrDoctorId.map((doctorId, index) => (
                                    <div className='doctor-card' key={index}>
                                        <ProfileDoctor 
                                            doctorId={doctorId}
                                            isShowDescriptionDoctor={true}
                                            isShowLinkDetail={true}
                                            isShowPrice={false}
                                        />
                                        <div className='doctor-schedule'>
                                            <DoctorSchedule 
                                                doctorIdFromParent={doctorId} 
                                            />
                                        </div>
                                        <div className='doctor-extra-info'>
                                            <DoctorExtraInfor 
                                                doctorIdFromParent={doctorId} 
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
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

export default connect(mapStateToProps)(DetailClinic);
