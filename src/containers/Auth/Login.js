import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from "connected-react-router";
import * as actions from "../../store/actions";
import './Login.scss';
import { handleLoginAPI } from '../../services/userService';
import { userLoginSuccess } from "../../store/actions/userActions";


class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            isShowPassword: false,
            errMessage: '',
            faceIdSupported: false,
            isCameraOpen: false,
            videoRef: React.createRef(),
        };
    }

    async componentDidMount() {
        // Check WebAuthn support
        if (window.PublicKeyCredential) {
            try {
                // Check if device supports biometric authentication
                const available = await window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
                this.setState({ faceIdSupported: available });
            } catch (error) {
                console.warn('Cannot check biometric authentication support:', error);
                this.setState({ faceIdSupported: false });
            }
        }
    }

    handleOnChangeUsername = (event) => {
        this.setState({ username: event.target.value });
    }

    handleOnChangePassword = (event) => {
        this.setState({ password: event.target.value });
    }

    handleLogin = async () => {
        this.setState({ errMessage: '' });
        try {
            let userData;
            // Kiểm tra xem có phải đăng nhập bằng mật khẩu không
            if (this.state.password) {
                // Đăng nhập bằng mật khẩu
                let response = await handleLoginAPI(this.state.username, this.state.password);
                userData = response.user;
            }

            if (userData) {
                this.props.userLoginSuccess(userData);
                console.log('Đăng nhập thành công');
            } else {
                this.setState({ errMessage: 'Thông tin đăng nhập không chính xác' });
            }
        } catch (error) {
            console.error('Lỗi đăng nhập:', error);
            this.setState({ errMessage: error.message || 'Đăng nhập thất bại' });
        }
    }

    handleShowHidePassword = () => {
        this.setState({ isShowPassword: !this.state.isShowPassword });
    }

    handleKeyDown = (event) => {
        if (event.key === 'Enter' || event.keyCode === 13) {
            this.handleLogin();
        }
    }

    handleOpenCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            this.setState({ isCameraOpen: true });
            if (this.state.videoRef.current) {
                this.state.videoRef.current.srcObject = stream;
            }
        } catch (error) {
            console.error('Không thể mở camera:', error);
            this.setState({ errMessage: 'Không thể mở camera. Vui lòng kiểm tra quyền truy cập.' });
        }
    }

    handleFaceIDLogin = async () => {
        try {
            await this.handleOpenCamera();
            // Sau khi nhận diện thành công, đóng camera
            if (this.state.videoRef.current?.srcObject) {
                this.state.videoRef.current.srcObject.getTracks().forEach(track => track.stop());
            }
            this.setState({ isCameraOpen: false });

            // Tạo challenge ngẫu nhiên
            const challenge = new Uint8Array(32);
            window.crypto.getRandomValues(challenge);

            const publicKey = {
                challenge: challenge,
                timeout: 60000,
                rpId: window.location.hostname,
                userVerification: "required",
                allowCredentials: [], // Server nên cung cấp danh sách credentials đã đăng ký
            };

            // Yêu cầu xác thực thay vì tạo mới
            const assertion = await navigator.credentials.get({
                publicKey: publicKey
            });

            // Chuyển đổi dữ liệu để gửi lên server
            const credentialId = btoa(String.fromCharCode(...new Uint8Array(assertion.rawId)));
            const clientDataJSON = btoa(String.fromCharCode(...new Uint8Array(assertion.response.clientDataJSON)));
            const authenticatorData = btoa(String.fromCharCode(...new Uint8Array(assertion.response.authenticatorData)));
            const signature = btoa(String.fromCharCode(...new Uint8Array(assertion.response.signature)));

            // Gửi thông tin xác thực lên server
            const response = await fetch('http://localhost:8080/api/get-face-id', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    credentialId,
                    clientDataJSON,
                    authenticatorData,
                    signature
                })
            });

            if (response.ok) {
                const userData = await response.json();
                this.props.userLoginSuccess(userData);
            } else {
                throw new Error('Xác thực thất bại');
            }
        } catch (error) {
            console.error('Lỗi xác thực Face ID:', error);
            this.setState({ errMessage: 'Xác thực Face ID thất bại. Vui lòng thử lại.' });
        }
    }

    render() {
        return (
            <div className='login-background'>
                <div className='login-container'>
                    <div className='login-content'>
                        <div className='col-12 text-login'>Login</div>
                        <div className='col-12 form-group login-input'>
                            <label>Username</label>
                            <input type='text' className='form-control' placeholder='Enter your username'
                                value={this.state.username}
                                onChange={this.handleOnChangeUsername}
                                onKeyDown={this.handleKeyDown} />
                        </div>
                        <div className='col-12 form-group login-input'>
                            <label>Password</label>
                            <div className="custom-input-password">
                                <input type={this.state.isShowPassword ? 'text' : 'password'}
                                    className='form-control'
                                    placeholder='Enter your password'
                                    value={this.state.password}
                                    onChange={this.handleOnChangePassword}
                                    onKeyDown={this.handleKeyDown}
                                />
                                <span onClick={this.handleShowHidePassword}>
                                    <i className={this.state.isShowPassword ? 'far fa-eye' : 'far fa-eye-slash'}></i>
                                </span>
                            </div>
                        </div>
                        <div className='col-12' style={{ color: 'red' }}>
                            {this.state.errMessage}
                        </div>
                        <div>
                            <button className='btn-login' onClick={() => this.handleLogin()}>
                                Login with Password
                            </button>
                            {/* <button className='btn-login mt-3' onClick={() => this.setState({ password: '' }, this.handleLogin)}>
                                Login with Face Recognition
                            </button> */}
                        </div>

                        <div className='col-12 text-center mt-3'>
                            <span className='text-other-login'>Or Login With:</span>
                        </div>
                        <div className='col-12 social-login'>
                            <i className="fab fa-google-plus-g google"></i>
                            <i className="fab fa-facebook-f facebook"></i>
                            {this.state.faceIdSupported && (
                                <i className="fas fa-face-viewfinder faceid" onClick={this.handleFaceIDLogin}></i>
                            )}
                        </div>

                        {/* {this.state.isCameraOpen && (
                            <div className='camera-container'>
                                <video
                                    ref={this.state.videoRef}
                                    autoPlay
                                    playsInline
                                    style={{ width: '100%', maxWidth: '400px' }}
                                />
                            </div>
                        )} */}
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    language: state.app.language
});

const mapDispatchToProps = dispatch => ({
    navigate: (path) => dispatch(push(path)),
    userLoginSuccess: (userInfo) => dispatch(actions.userLoginSuccess(userInfo))
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
