import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import Lightbox from 'react-image-lightbox';
import { LANGUAGES, CRUD_ACTIONS, CommonUtils } from '../../../utils';
import * as actions from "../../../store/actions";
import TableManageUser from './TableManageUser';
import './UserRedux.scss';

class UserRedux extends Component {


    constructor(props) {
        super(props);
        this.state = {
            genderArr: [],
            positionArr: [],
            roleArr: [],
            previewImgUrl: "",
            isOpen: false,



            email: '',
            password: '',
            firstName: '',
            lastName: '',
            phoneNumber: '',
            address: '',
            gender: '',
            position: '',
            role: '',
            avatar: '',

            action: '',
            userEditId: '',
        };
    }

    async componentDidMount() {
        this.props.getGenderStart();
        this.props.getPositionStart();
        this.props.getRoleStart();
        // this.props.dispatch(actions.fetchGenderStart())
        // try {
        //     let res = await getAllCodeService('gender');
        //     if (res && res.errCode === 0) {
        //         this.setState({
        //             genderArr: res.data
        //         })
        //     }

        // } catch (error) {
        //     console.log(error)
        // }
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.genderRedux !== this.props.genderRedux) {
            let arrGenders = this.props.genderRedux;
            this.setState({
                genderArr: arrGenders,
                gender: arrGenders && arrGenders.length > 0 ? arrGenders[0].keyMap : ""
            })
        }
        if (prevProps.roleRedux !== this.props.roleRedux) {
            let arrRoles = this.props.roleRedux
            this.setState({
                roleArr: arrRoles,
                role: arrRoles && arrRoles.length > 0 ? arrRoles[0].keyMap : ""
            })
        }
        if (prevProps.positionRedux !== this.props.positionRedux) {
            let arrPositions = this.props.positionRedux
            this.setState({
                positionArr: arrPositions,
                position: arrPositions && arrPositions.length > 0 ? arrPositions[0].keyMap : ""
            })
        }
        if (prevProps.listUsers !== this.props.listUsers) {
            let arrGenders = this.props.genderRedux;
            let arrRoles = this.props.roleRedux
            let arrPositions = this.props.positionRedux
            this.setState({
                email: '',
                password: '',
                firstName: '',
                lastName: '',
                phoneNumber: '',
                address: '',
                gender: arrGenders && arrGenders.length > 0 ? arrGenders[0].keyMap : "",
                position: arrPositions && arrPositions.length > 0 ? arrPositions[0].keyMap : "",
                role: arrRoles && arrRoles.length > 0 ? arrRoles[0].keyMap : "",
                avatar: '',
                action: CRUD_ACTIONS.CREATE,
                previewImgUrl: ''
            })
        }
    }

    handleOnchangeImage = async (event) => {
        let data = event.target.files;
        let file = data[0];
        if (file) {
            let base64 = await CommonUtils.getBase64(file);
            console.log(base64);
            let objectUrl = URL.createObjectURL(file);
            this.setState({
                previewImgUrl: objectUrl,
                avatar: base64
            })

        }


    }
    openPreviewImage = () => {
        if (!this.state.previewImgUrl) return;
        this.setState({
            isOpen: true
        })
    }
    handleSaveUser = (event) => {
        //event nay ngan ko cho re-render
        event.preventDefault();
        let isValid = this.checkValidateInput();
        if (isValid === false) return;
        let { action } = this.state;
        if (action === CRUD_ACTIONS.CREATE) {
            //fire redux create user
            this.props.createNewUser({
                email: this.state.email,
                password: this.state.password,
                firstName: this.state.firstName,
                lastName: this.state.lastName,
                address: this.state.address,
                phonenumber: this.state.phoneNumber,
                gender: this.state.gender,
                roleId: this.state.role,
                positionId: this.state.position,
                avatar: this.state.avatar
            })

        }
        if (action === CRUD_ACTIONS.EDIT) {
            //fire redux edit user
            this.props.editUserRedux({
                id: this.state.userEditId,
                email: this.state.email,
                password: this.state.password,
                firstName: this.state.firstName,
                lastName: this.state.lastName,
                address: this.state.address,
                phonenumber: this.state.phoneNumber,
                gender: this.state.gender,
                roleId: this.state.role,
                positionId: this.state.position,
                avatar: this.state.avatar
            })
        }




    }
    checkValidateInput = () => {
        let isValid = true;
        let arrCheck = ['email', 'password', 'firstName', 'lastName', 'phoneNumber', 'address']
        for (let i = 0; i < arrCheck.length; i++) {
            if (!this.state[arrCheck[i]]) {
                isValid = false;
                alert('This input is required: ' + arrCheck[i])
                break;
            }

        }
        return isValid;
    }
    onChangeInput = (event, id) => {
        let copyState = { ...this.state }

        copyState[id] = event.target.value;
        this.setState({
            ...copyState
        })


    }
    handleEditUserFromParent = (user) => {
        let imageBase64 = '';
        if (user.image) {
            imageBase64 = new Buffer(user.image, 'base64').toString('binary');
        }
        this.setState({
            email: user.email,
            password: 'HARDCODE',
            firstName: user.firstName,
            lastName: user.lastName,
            phoneNumber: user.phonenumber,
            address: user.address,
            gender: user.gender,
            position: user.positionId,
            role: user.roleId,
            avatar: '',
            previewImgUrl: imageBase64,
            action: CRUD_ACTIONS.EDIT,
            userEditId: user.id,
        })
    }
    render() {
        const { language, isLoadingGender } = this.props;
        const { 
            email, password, firstName, lastName, phoneNumber, 
            address, gender, position, role, action,
            genderArr, roleArr, positionArr, previewImgUrl 
        } = this.state;

        return (
            <div className='user-redux-container'>
                <div className='page-header'>
                    <h2 className='page-title'>
                        <i className="fas fa-user-cog"></i>
                        <FormattedMessage id="manage-user.title"/>
                    </h2>
                </div>

                <div className="main-content">
                    <div className='form-container'>
                        <form onSubmit={this.handleSaveUser}>
                            <div className='form-header'>
                                <h3>
                                    <i className="fas fa-user-plus"></i>
                                    <FormattedMessage id="manage-user.add"/>
                                </h3>
                                {isLoadingGender && 
                                    <div className='loading-indicator'>
                                        <i className="fas fa-spinner fa-spin"></i>
                                        Loading...
                                    </div>
                                }
                            </div>

                            <div className='form-grid'>
                                <div className='form-group'>
                                    <label>
                                        <i className="fas fa-envelope"></i>
                                        <FormattedMessage id="manage-user.email"/>
                                    </label>
                                    <input 
                                        type="email"
                                        value={email}
                                        onChange={(e) => this.onChangeInput(e, 'email')}
                                        disabled={action === CRUD_ACTIONS.EDIT}
                                        placeholder="example@email.com"
                                    />
                                </div>

                                <div className='form-group'>
                                    <label>
                                        <i className="fas fa-lock"></i>
                                        <FormattedMessage id="manage-user.password"/>
                                    </label>
                                    <input 
                                        type="password"
                                        value={password}
                                        onChange={(e) => this.onChangeInput(e, 'password')}
                                        disabled={action === CRUD_ACTIONS.EDIT}
                                    />
                                </div>

                                <div className='form-group'>
                                    <label>
                                        <i className="fas fa-user"></i>
                                        <FormattedMessage id="manage-user.first-name"/>
                                    </label>
                                    <input 
                                        type="text"
                                        value={firstName}
                                        onChange={(e) => this.onChangeInput(e, 'firstName')}
                                        placeholder="First Name"
                                    />
                                </div>

                                <div className='form-group'>
                                    <label>
                                        <i className="fas fa-user"></i>
                                        <FormattedMessage id="manage-user.last-name"/>
                                    </label>
                                    <input 
                                        type="text"
                                        value={lastName}
                                        onChange={(e) => this.onChangeInput(e, 'lastName')}
                                        placeholder="Last Name"
                                    />
                                </div>

                                <div className='form-group'>
                                    <label>
                                        <i className="fas fa-phone"></i>
                                        <FormattedMessage id="manage-user.phone-number"/>
                                    </label>
                                    <input 
                                        type="text"
                                        value={phoneNumber}
                                        onChange={(e) => this.onChangeInput(e, 'phoneNumber')}
                                        placeholder="Phone Number"
                                    />
                                </div>

                                <div className='form-group'>
                                    <label>
                                        <i className="fas fa-map-marker-alt"></i>
                                        <FormattedMessage id="manage-user.address"/>
                                    </label>
                                    <input 
                                        type="text"
                                        value={address}
                                        onChange={(e) => this.onChangeInput(e, 'address')}
                                        placeholder="Address"
                                    />
                                </div>

                                <div className='form-group'>
                                    <label>
                                        <i className="fas fa-venus-mars"></i>
                                        <FormattedMessage id="manage-user.gender"/>
                                    </label>
                                    <select 
                                        value={gender}
                                        onChange={(e) => this.onChangeInput(e, 'gender')}
                                    >
                                        {genderArr.map((item, index) => (
                                            <option key={index} value={item.keyMap}>
                                                {language === LANGUAGES.VI ? item.valueVi : item.valueEn}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className='form-group'>
                                    <label>
                                        <i className="fas fa-briefcase"></i>
                                        <FormattedMessage id="manage-user.position"/>
                                    </label>
                                    <select 
                                        value={position}
                                        onChange={(e) => this.onChangeInput(e, 'position')}
                                    >
                                        {positionArr.map((item, index) => (
                                            <option key={index} value={item.keyMap}>
                                                {language === LANGUAGES.VI ? item.valueVi : item.valueEn}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className='form-group'>
                                    <label>
                                        <i className="fas fa-user-tie"></i>
                                        <FormattedMessage id="manage-user.role"/>
                                    </label>
                                    <select 
                                        value={role}
                                        onChange={(e) => this.onChangeInput(e, 'role')}
                                    >
                                        {roleArr.map((item, index) => (
                                            <option key={index} value={item.keyMap}>
                                                {language === LANGUAGES.VI ? item.valueVi : item.valueEn}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className='form-group image-upload'>
                                    <label>
                                        <i className="fas fa-image"></i>
                                        <FormattedMessage id="manage-user.image"/>
                                    </label>
                                    <div className='upload-container'>
                                        <input 
                                            id='previewImg' 
                                            type="file" 
                                            hidden
                                            onChange={this.handleOnchangeImage}
                                        />
                                        <label className='upload-button' htmlFor='previewImg'>
                                            <i className='fas fa-cloud-upload-alt'></i>
                                            <FormattedMessage id="manage-user.upload"/>
                                        </label>
                                        {previewImgUrl && (
                                            <div 
                                                className='preview-image'
                                                style={{ backgroundImage: `url(${previewImgUrl})` }}
                                                onClick={this.openPreviewImage}
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className='form-actions'>
                                <button 
                                    type="submit"
                                    className={action === CRUD_ACTIONS.EDIT ? 'edit-button' : 'save-button'}
                                >
                                    <i className={action === CRUD_ACTIONS.EDIT ? 'fas fa-edit' : 'fas fa-save'}></i>
                                    {action === CRUD_ACTIONS.EDIT ? 
                                        <FormattedMessage id="manage-user.edit"/> : 
                                        <FormattedMessage id="manage-user.save"/>
                                    }
                                </button>
                            </div>
                        </form>
                    </div>

                    <div className='table-container'>
                        <TableManageUser
                            handleEditUserFromParentKey={this.handleEditUserFromParent}
                            action={action}
                        />
                    </div>
                </div>

                {this.state.isOpen && (
                    <Lightbox
                        mainSrc={previewImgUrl}
                        onCloseRequest={() => this.setState({ isOpen: false })}
                    />
                )}
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        genderRedux: state.admin.genders,
        roleRedux: state.admin.roles,
        positionRedux: state.admin.positions,
        isLoadingGender: state.admin.isLoadingGender,
        listUsers: state.admin.users,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getGenderStart: () => dispatch(actions.fetchGenderStart()),
        getPositionStart: () => dispatch(actions.fetchPositionStart()),
        getRoleStart: () => dispatch(actions.fetchRoleStart()),
        createNewUser: (data) => dispatch(actions.createNewUser(data)),
        fetchUserRedux: () => dispatch(actions.fetchAllUsersStart()),
        editUserRedux: (data) => dispatch(actions.editUser(data))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserRedux);
