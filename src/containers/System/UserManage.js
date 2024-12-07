import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { getAllUser, createNewUserService, deleteUserService, editUserService } from '../../services/userService';
import ModalUser from './ModalUser';
import ModalEditUser from './ModalEditUser';
import { emitter } from "../../utils/emitter";
import './UserManage.scss';

class UserManage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            arrUsers: [],
            isOpenModalUser: false,
            isOpenModalEditUser: false,
            userEdit: {},
            searchTerm: ''
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

    handleSearchChange = (e) => {
        this.setState({ searchTerm: e.target.value });
    }

    render() {
        const { arrUsers, isOpenModalUser, isOpenModalEditUser, userEdit, searchTerm } = this.state;
        const filteredUsers = arrUsers.filter(user => 
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.lastName.toLowerCase().includes(searchTerm.toLowerCase())
        );

        return (
            <div className="user-management-container">
                <ModalUser
                    isOpen={isOpenModalUser}
                    toggleFromParent={this.toggleUserModal}
                    createNewUser={this.createNewUser}
                />
                {isOpenModalEditUser && (
                    <ModalEditUser
                        isOpen={isOpenModalEditUser}
                        toggleFromParent={this.toggleUserEditModal}
                        currentUser={userEdit}
                        editUser={this.doEditUser}
                    />
                )}

                <div className='page-header'>
                    <h2 className='page-title'>
                        <i className="fas fa-users-cog"></i>
                        <FormattedMessage id="manage-user.header"/>
                    </h2>
                </div>

                <div className='control-panel'>
                    <div className='search-box'>
                        <i className="fas fa-search"></i>
                        <input 
                            type="text"
                            placeholder="Search users..."
                            value={searchTerm}
                            onChange={this.handleSearchChange}
                        />
                    </div>

                    <button 
                        className='add-user-btn' 
                        onClick={this.handleAddNewUser}
                    >
                        <i className='fas fa-user-plus'></i>
                        Add New User
                    </button>
                </div>

                <div className='users-table-container'>
                    <table className="users-table">
                        <thead>
                            <tr>
                                <th>
                                    <i className="fas fa-envelope"></i>
                                    Email
                                </th>
                                <th>
                                    <i className="fas fa-user"></i>
                                    First Name
                                </th>
                                <th>
                                    <i className="fas fa-user"></i>
                                    Last Name
                                </th>
                                <th>
                                    <i className="fas fa-map-marker-alt"></i>
                                    Address
                                </th>
                                <th>
                                    <i className="fas fa-cogs"></i>
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.email}</td>
                                    <td>{item.firstName}</td>
                                    <td>{item.lastName}</td>
                                    <td>{item.address}</td>
                                    <td className="actions">
                                        <button 
                                            className='edit-btn'
                                            onClick={() => this.handleEditUser(item)}
                                        >
                                            <i className='fas fa-edit'></i>
                                            Edit
                                        </button>
                                        <button 
                                            className='delete-btn'
                                            onClick={() => this.handleDeleteUser(item)}
                                        >
                                            <i className='fas fa-trash-alt'></i>
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredUsers.length === 0 && (
                        <div className="no-results">
                            <i className="fas fa-search"></i>
                            <p>No users found</p>
                        </div>
                    )}
                </div>
            </div>
        );
    }
}

export default connect()(UserManage);
