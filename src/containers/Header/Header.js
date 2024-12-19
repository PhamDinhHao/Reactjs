import React, { Component } from 'react';
import { connect } from 'react-redux';

import * as actions from "../../store/actions";
import Navigator from '../../components/Navigator';
import { adminMenu, doctorMenu } from './menuApp';
import './Header.scss';
import { LANGUAGES, USER_ROLE } from '../../utils';
import { FormattedMessage } from 'react-intl';
import HomeHeader from '../HomePage/HomeHeader';
import _ from 'lodash';
class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            menuApp: [],
            showSettingsModal: false,
            stream: null,
            videoRef: React.createRef(),
            verifyingFace: false,
            verificationMessage: ''
        }
    }


    handleChangeLanguage = (language) => {

        this.props.changeLanguageAppRedux(language)
    }
    componentDidMount() {
        let { userInfo } = this.props;
        let menu = []
        if (userInfo && !_.isEmpty(userInfo)) {
            console.log("check user", userInfo)
            let role = userInfo.roleId;
            if (role === USER_ROLE.ADMIN) {
                menu = adminMenu;
            } if (role === USER_ROLE.DOCTOR) {
                menu = doctorMenu;
            }
        }
        this.setState({
            menuApp: menu
        })
    }

    handleOpenSettings = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            this.setState({
                showSettingsModal: true,
                stream: stream,
                verifyingFace: true,
                verificationMessage: 'Đang xác thực khuôn mặt...'
            });

            // Bắt đầu xác thực khuôn mặt
            setTimeout(async () => {
                try {
                    const videoTrack = stream.getVideoTracks()[0];
                    const imageCapture = new ImageCapture(videoTrack);
                    const blob = await imageCapture.takePhoto();
                    const formData = new FormData();
                    formData.append('faceImage', blob);
                    formData.append('firstName', this.props.userInfo.firstName);
                    formData.append('lastName', this.props.userInfo.lastName);
                    formData.append('roleId', this.props.userInfo.roleId);
                    formData.append('id', this.props.userInfo.id);
                    formData.append('faceId', true)
                    const response = await fetch('http://localhost:8080/api/face-recognition', {
                        method: 'POST',
                        body: formData,
                    });

                    if (!response.ok) {
                        throw new Error('Xác thực khuôn mặt thất bại');
                    }

                    this.setState({
                        verificationMessage: 'Xác thực thành công!',
                        verifyingFace: false
                    });
                } catch (error) {
                    this.setState({
                        verificationMessage: 'Xác thực thất bại. Vui lòng thử lại.',
                        verifyingFace: false
                    });
                    // Đóng stream camera nếu xác thực thất bại
                    this.closeCamera();
                }
            }, 2000); // Đợi 2 giây để camera khởi động

        } catch (err) {
            console.error("Không thể truy cập camera:", err);
            this.setState({
                verificationMessage: 'Không thể truy cập camera',
                verifyingFace: false
            });
        }
    }

    closeCamera = () => {
        if (this.state.stream) {
            const tracks = this.state.stream.getTracks();
            tracks.forEach(track => track.stop());
            this.setState({
                stream: null,
                showSettingsModal: false
            });
        }
    }

    componentWillUnmount() {
        this.closeCamera();
    }

    render() {
        const { processLogout, language, userInfo } = this.props;
        const { showSettingsModal, verifyingFace, verificationMessage } = this.state;

        return (
            <div className="header-container">
                {/* thanh navigator */}
                <div className="header-tabs-container">
                    <Navigator menus={this.state.menuApp} />
                </div>
                <div className='languages'>
                    <span className='welcome'><FormattedMessage id="home-header.welcome" />
                        {userInfo && userInfo.firstName ? userInfo.firstName : ""} !</span>
                    <span className={language === LANGUAGES.VI ? 'language-vi active' : 'language-vi'} onClick={() => this.handleChangeLanguage(LANGUAGES.VI)}>VN</span>
                    <span className={language === LANGUAGES.EN ? 'language-en active' : 'language-en'} onClick={() => this.handleChangeLanguage(LANGUAGES.EN)}>EN</span>
                    {/* nút logout */}
                    <div className="btn btn-logout" onClick={processLogout} title='Log out'>
                        <i className="fas fa-sign-out-alt"></i>
                    </div>
                </div>
                <div className='logout-container' style={{ marginRight: '30px', cursor: 'pointer' }}>
                    <i className="fas fa-cog" onClick={this.handleOpenSettings}></i>
                </div>

                {showSettingsModal && (
                    <div className="settings-modal">
                        <div className="modal-header">
                            <h3><FormattedMessage id="settings.facial-recognition" /></h3>
                            <span className="close-button" onClick={this.closeCamera}>×</span>
                        </div>
                        <div className="modal-body">
                            <video 
                                autoPlay 
                                ref={video => {
                                    if (video && this.state.stream) {
                                        video.srcObject = this.state.stream;
                                    }
                                }}
                                style={{ width: '100%', maxWidth: '400px' }}
                            />
                            <div className="verification-status">
                                {verifyingFace && <div className="loading-spinner"></div>}
                                <p className={verifyingFace ? 'verifying' : 'verified'}>
                                    {verificationMessage}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        language: state.app.language,
        userInfo: state.user.userInfo,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        processLogout: () => dispatch(actions.processLogout()),
        changeLanguageAppRedux: (language) => dispatch(actions.changeLanguageApp(language))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
