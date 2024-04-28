import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import './UserManage.scss'
import { getAllUser, createNewUserService, deleteUserService, editUserService } from '../../services/userService';
import ModalUser from './ModalUser';
import ModalEditUser from './ModalEditUser';
import { emitter } from "../../utils/emitter";

class UserManage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            arrUsers: [],
            isOpenModalUser: false,
            isOpenModalEditUser: false,
            userEdit: {}
        }
    }

    async componentDidMount() {
        await this.getAllUsersFromReact();

    }
    getAllUsersFromReact = async () => {
        let response = await getAllUser('ALL');
        if (response && response.errCode == 0) {
            this.setState({
                arrUsers: response.users
            })
        }
    }
    handleAddNewUser = () => {
        this.setState({
            isOpenModalUser: true,
        })
    }
    toggleUserModal = () => {
        this.setState({
            isOpenModalUser: !this.state.isOpenModalUser,
        })
    }
    toggleUserEditModal = () => {
        this.setState({
            isOpenModalEditUser: !this.state.isOpenModalEditUser,
        })
    }
    createNewUser = async (data) => {
        try {
            let response = await createNewUserService(data);
            if (response && response.errCode !== 0) {
                alert(response.errMessage)
            }
            else {
                await this.getAllUsersFromReact();
                this.setState({
                    isOpenModalUser: false
                })
                emitter.emit('EVENT_CLEAR_MODAL_DATA', { 'id': 'your id' })
            }
            console.log(response);
        } catch (error) {
            console.log(error);
        }

    }
    handleDeleteUser = async (user) => {

        try {

            let res = await deleteUserService(user.id);
            console.log(res);
            if (res && res.errCode == 0) {
                await this.getAllUsersFromReact();
            } else {
                alert(res.errMessage)
            }
        } catch (error) {
            console.log(error);
        }
    }
    handleEditUser = (user) => {

        this.setState({
            isOpenModalEditUser: true,
            userEdit: user
        })
    }
    doEditUser = async (user) => {
        try {
            let response = await editUserService(user);
            if (response && response.errCode == 0) {
                this.setState({
                    isOpenModalEditUser: false
                })
                await this.getAllUsersFromReact()
            }
            else {
                alert(response.errCode)
            }

        } catch (error) {
            console.log(error)
        }



    }


    render() {
        console.log('check render', this.state)
        let arrUsers = this.state.arrUsers;
        return (
            <div className="user-contaner" >
                <ModalUser
                    isOpen={this.state.isOpenModalUser}
                    toggleFromParent={this.toggleUserModal}
                    createNewUser={this.createNewUser}
                />
                {this.state.isOpenModalEditUser &&
                    <ModalEditUser
                        isOpen={this.state.isOpenModalEditUser}
                        toggleFromParent={this.toggleUserEditModal}
                        currentUser={this.state.userEdit}
                        editUser={this.doEditUser}
                    />
                }
                <div className='titel text-center'>Manage</div>
                <div className='mx-1'>
                    <button className='btn btn-primary px-3' onClick={() => this.handleAddNewUser()}><i className='fas fa-plus'></i>Add new users</button>
                </div>
                <div className='users-table mt-4 mx-3'>
                    <table id="customers" >
                        <tbody>
                            <tr>
                                <th>Email</th>
                                <th>First name</th>
                                <th>Last name</th>
                                <th>Address</th>
                                <th>Actions</th>
                            </tr>

                            {arrUsers && arrUsers.map((item, index) => {
                                return (
                                    <tr>
                                        <td>{item.email}</td>
                                        <td>{item.firstName}</td>
                                        <td>{item.lastName}</td>
                                        <td>{item.address}</td>
                                        <td>
                                            <button className='btn-edit' ><i className='fas fa-pencil-alt' onClick={() => { this.handleEditUser(item) }}></i></button>
                                            <button className='btn-delete'><i className='fas fa-trash' onClick={() => this.handleDeleteUser(item)}></i></button>
                                        </td>

                                    </tr>
                                )
                            })}


                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserManage);
