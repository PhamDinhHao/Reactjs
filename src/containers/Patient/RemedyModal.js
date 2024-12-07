import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Modal } from 'reactstrap';
import { CommonUtils } from '../../utils';
import { toast } from 'react-toastify';
import './RemedyModal.scss';

class RemedyModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            imgBase64: '',
            fileName: '',
            isLoading: false
        }
    }

    componentDidMount() {
        if(this.props.dataModal) {
            this.setState({
                email: this.props.dataModal.email
            });
        }
    }

    componentDidUpdate(prevProps) {
        if(prevProps.dataModal !== this.props.dataModal) {
            this.setState({
                email: this.props.dataModal.email
            });
        }
    }

    handleOnChangeEmail = (e) => {
        this.setState({ email: e.target.value });
    }

    handleOnChangeImgBase64 = async (e) => {
        let data = e.target.files[0];
        if(data) {
            let fileName = data.name;
            let base64 = await CommonUtils.getBase64(data);
            this.setState({
                imgBase64: base64,
                fileName: fileName
            });
        }
    }

    handleSendRemedy = async () => {
        const { email, imgBase64 } = this.state;
        const { dataModal, closeRemedyModal, sendRemedy } =this.props;

        if (!email || !imgBase64) {
            toast.error('Please fill in all required fields');
            return;
        }

        try {
            this.setState({ isLoading: true });

            const data = {
                email: email,
                imgBase64: imgBase64,
                doctorId: dataModal.doctorId,
                patientId: dataModal.patientId,
                timeType: dataModal.timeType,
                language: this.props.language,
                patientName: dataModal.patientData.firstName
            };

            let res = await sendRemedy(data);

            if (res && res.errCode === 0) {
                toast.success('Send remedy succeed');
                closeRemedyModal();
                await this.props.loadPatientData();
            } else {
                toast.error('Something went wrong...');
            }
        } catch (error) {
            console.error('Send remedy error:', error);
            toast.error('Error sending remedy');
        } finally {
            this.setState({ isLoading: true });
        }
    }

    render() {
        const { isOpen, closeRemedyModal, sendRemedy } = this.props;
        const { email, fileName } = this.state;
        
        return (
            <Modal
                isOpen={isOpen}
                toggle={closeRemedyModal}
                className="remedy-modal"
                centered
                size="md"
            >
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">
                            <i className="fas fa-file-medical"></i>
                            <FormattedMessage id="remedy.send-invoice" />
                        </h5>
                        <button 
                            className="close-button"
                            onClick={closeRemedyModal}
                        >
                            <i className="fas fa-times"></i>
                        </button>
                    </div>

                    <div className="modal-body">
                        <div className="form-group">
                            <label>
                                <i className="fas fa-envelope"></i>
                                <FormattedMessage id="remedy.email" />
                            </label>
                            <input
                                type="email"
                                className="form-control"
                                value={email}
                                onChange={this.handleOnChangeEmail}
                                placeholder="patient@example.com"
                            />
                        </div>

                        <div className="form-group">
                            <label>
                                <i className="fas fa-file-prescription"></i>
                                <FormattedMessage id="remedy.prescription" />
                            </label>
                            <div className="file-upload-wrapper">
                                <input
                                    type="file"
                                    className="file-upload"
                                    onChange={this.handleOnChangeImgBase64}
                                    accept="image/*,.pdf"
                                    id="file-upload"
                                />
                                <label htmlFor="file-upload" className="file-upload-label">
                                    <i className="fas fa-cloud-upload-alt"></i>
                                    {fileName || <FormattedMessage id="remedy.choose-file" />}
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button
                            className="btn-cancel"
                            onClick={closeRemedyModal}
                        >
                            <i className="fas fa-times-circle"></i>
                            <FormattedMessage id="remedy.cancel" />
                        </button>
                        <button
                            className="btn-send"
                            onClick={() => this.handleSendRemedy()}
                            disabled={!this.state.imgBase64 || this.state.isLoading}
                        >
                            {this.state.isLoading ? (
                                <i className="fas fa-spinner fa-spin"></i>
                            ) : (
                                <i className="fas fa-paper-plane"></i>
                            )}
                            <FormattedMessage id="remedy.send" />
                        </button>
                    </div>
                </div>
            </Modal>
        );
    }
}

const mapStateToProps = state => ({
    language: state.app.language,
    user: state.user.userInfo
});

export default connect(mapStateToProps)(RemedyModal);
