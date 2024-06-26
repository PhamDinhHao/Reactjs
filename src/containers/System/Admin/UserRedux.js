import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';

import { LANGUAGES, CRUD_ACTIONS, CommonUtils } from '../../../utils';
import * as actions from "../../../store/actions";
import "./UserRedux.scss";
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import TableManageUser from './TableManageUser';
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

        let genders = this.state.genderArr;
        let language = this.props.language;
        let roles = this.state.roleArr;
        let postitions = this.state.positionArr;
        let isGetGender = this.props.isLoadingGender;


        let { email, password, firstName, lastName, phoneNumber, address, gender, position, role, avatar } = this.state;

        return (
            <div className='user-redux-container'>
                <div className='title'>Manage redux</div>

                <div className="user-redux-body" >
                    <div className='container'>
                        <div className='row'>
                            <form className="row g-4">
                                <div className='col-12'><FormattedMessage id="manage-user.add" /></div>
                                <div className='col-12'>{isGetGender === true ? 'Loading Gender' : ''}</div>
                                <div className="col-md-3">
                                    <label htmlFor="inputEmail4" className="form-label"><FormattedMessage id="manage-user.email" /></label>
                                    <input type="email" className="form-control" id="inputEmail4"
                                        value={email}
                                        onChange={(event) => { this.onChangeInput(event, 'email') }}
                                        disabled={this.state.action === CRUD_ACTIONS.EDIT ? true : false} />
                                </div>
                                <div className="col-md-3">
                                    <label htmlFor="inputPassword4" className="form-label"><FormattedMessage id="manage-user.password" /></label>
                                    <input type="password" className="form-control" id="inputPassword4"
                                        value={password}
                                        onChange={(event) => { this.onChangeInput(event, 'password') }}
                                        disabled={this.state.action === CRUD_ACTIONS.EDIT ? true : false} />
                                </div>
                                <div className="col-3">
                                    <label htmlFor="inputFirstName" className="form-label"><FormattedMessage id="manage-user.first-name" /></label>
                                    <input type="text" className="form-control" id="inputFirstName"
                                        value={firstName}
                                        onChange={(event) => { this.onChangeInput(event, 'firstName') }} />
                                </div>
                                <div className="col-3">
                                    <label htmlFor="inputLastName" className="form-label"><FormattedMessage id="manage-user.last-name" /></label>
                                    <input type="text" className="form-control" id="inputLastName"
                                        value={lastName}
                                        onChange={(event) => { this.onChangeInput(event, 'lastName') }} />
                                </div>
                                <div className="col-md-3">
                                    <label htmlFor="inputPhoneNumber" className="form-label"><FormattedMessage id="manage-user.phone-number" /></label>
                                    <input type="text" className="form-control" id="inputPhoneNumber"
                                        value={phoneNumber}
                                        onChange={(event) => { this.onChangeInput(event, 'phoneNumber') }} />
                                </div>
                                <div className="col-md-9">
                                    <label htmlFor="inputAddress" className="form-label"><FormattedMessage id="manage-user.address" /></label>
                                    <input type="text" className="form-control" id="inputAddress"
                                        value={address}
                                        onChange={(event) => { this.onChangeInput(event, 'address') }} />
                                </div>
                                <div className="col-md-3">
                                    <label htmlFor="inputGender" className="form-label"><FormattedMessage id="manage-user.gender" /></label>
                                    <select id="inputGender" className="form-select" value={gender}
                                        onChange={(event) => { this.onChangeInput(event, 'gender') }}>
                                        {genders && genders.length > 0 && genders.map((item, index) => {
                                            return (
                                                <option key={index} value={item.keyMap}>{language === LANGUAGES.VI ? item.valueVi : item.valueEn}</option>
                                            )
                                        })
                                        }

                                    </select>
                                </div>
                                <div className="col-md-3">
                                    <label htmlFor="inputPosition" className="form-label"><FormattedMessage id="manage-user.position" /></label>
                                    <select id="inputPosition" className="form-select" value={position}
                                        onChange={(event) => { this.onChangeInput(event, 'position') }}>
                                        {postitions && postitions.length > 0 && postitions.map((item, index) => {
                                            return (
                                                <option key={index} value={item.keyMap}>{language === LANGUAGES.VI ? item.valueVi : item.valueEn}</option>
                                            )
                                        })}

                                    </select>
                                </div>
                                <div className="col-md-3">
                                    <label htmlFor="inputRoleID" className="form-label"><FormattedMessage id="manage-user.role" /></label>
                                    <select id="inputRoleID" className="form-select" value={role}
                                        onChange={(event) => { this.onChangeInput(event, 'role') }}>
                                        {roles && roles.length > 0 && roles.map((item, index) => {
                                            return (
                                                <option key={index} value={item.keyMap}>{language === LANGUAGES.VI ? item.valueVi : item.valueEn}</option>
                                            )
                                        })}

                                    </select>
                                </div>
                                <div className="col-md-3">
                                    <label htmlFor="inputImage" className="form-label"><FormattedMessage id="manage-user.image" /></label>
                                    <div className='preview-img-container'>
                                        <input id='previewImg' type="file" hidden
                                            onChange={(event) => this.handleOnchangeImage(event)}
                                        />
                                        <label className='label-upload' htmlFor='previewImg'>Tải ảnh <i className='fas fa-upload'></i></label>
                                        <div className='preview-image' style={{ backgroundImage: `url(${this.state.previewImgUrl})` }}
                                            onClick={() => this.openPreviewImage()}
                                        >

                                        </div>
                                    </div>


                                </div>


                                <div className="col-12 mt-3">
                                    <button type="submit" className={this.state.action === CRUD_ACTIONS.EDIT ? "btn btn-warning" : "btn btn-primary"}
                                        onClick={this.handleSaveUser}>
                                        {this.state.action === CRUD_ACTIONS.EDIT ?
                                            <FormattedMessage id="manage-user.edit" /> :
                                            <FormattedMessage id="manage-user.save" />}
                                    </button>
                                </div>
                                <div className='col-12'>
                                    <TableManageUser
                                        handleEditUserFromParentKey={this.handleEditUserFromParent}
                                        action={this.state.action}
                                    />
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                {this.state.isOpen === true && <Lightbox
                    mainSrc={this.state.previewImgUrl}
                    onCloseRequest={() => this.setState({ isOpen: false })}
                />}

            </div>

        )
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
