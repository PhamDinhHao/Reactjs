import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import * as actions from "../../../store/actions";
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import './TableManageUser.scss';

const mdParser = new MarkdownIt();
function handleEditorChange({ html, text }) {
    console.log('handleEditorChange', html, text);
}
class TableManageUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userRedux: [],
            searchTerm: '',
            sortConfig: {
                key: null,
                direction: 'ascending'
            }
        };
    }

    componentDidMount() {
        this.props.fetchUserRedux();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.listUsers !== this.props.listUsers) {
            this.setState({ userRedux: this.props.listUsers });
        }
    }
    handleDeleteUser = (e, user) => {
        e.preventDefault();
        if (window.confirm('Are you sure you want to delete this user?')) {
            this.props.deleteUserRedux(user.id);
        }
    }

    handleEditUser = (e, user) => {
        e.preventDefault();
        this.props.handleEditUserFromParentKey(user);
    }

    handleSearch = (e) => {
        this.setState({ searchTerm: e.target.value });
    }

    requestSort = (key) => {
        let direction = 'ascending';
        if (this.state.sortConfig.key === key && this.state.sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        this.setState({ sortConfig: { key, direction } });
    }

    render() {
        const { userRedux, searchTerm, sortConfig } = this.state;
        
        let sortedUsers = [...userRedux];
        if (sortConfig.key) {
            sortedUsers.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }

        const filteredUsers = sortedUsers.filter(user =>
            Object.values(user).some(value =>
                value.toString().toLowerCase().includes(searchTerm.toLowerCase())
            )
        );

        return (
            <div className="table-manage-container">
                <div className="table-controls">
                    <div className="search-box">
                        <i className="fas fa-search"></i>
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={searchTerm}
                            onChange={this.handleSearch}
                        />
                    </div>
                    <div className="table-info">
                        <span>{filteredUsers.length} users found</span>
                    </div>
                </div>

                <div className="table-wrapper">
                    <table className="users-table">
                        <thead>
                            <tr>
                                {['email', 'firstName', 'lastName', 'address'].map(key => (
                                    <th 
                                        key={key}
                                        onClick={() => this.requestSort(key)}
                                        className={sortConfig.key === key ? sortConfig.direction : ''}
                                    >
                                        <div className="th-content">
                                            <span>{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                                            <i className="fas fa-sort"></i>
                                        </div>
                                    </th>
                                ))}
                                <th>Actions</th>
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
                                            className="edit-btn"
                                            onClick={(e) => this.handleEditUser(e, item)}
                                            title="Edit user"
                                        >
                                            <i className="fas fa-edit"></i>
                                        </button>
                                        <button 
                                            className="delete-btn"
                                            onClick={(e) => this.handleDeleteUser(e, item)}
                                            title="Delete user"
                                        >
                                            <i className="fas fa-trash-alt"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="editor-section">
                    <h3>Markdown Editor</h3>
                    <MdEditor 
                        style={{ height: '500px' }} 
                        renderHTML={text => mdParser.render(text)} 
                        onChange={handleEditorChange}
                    />
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    listUsers: state.admin.users
});

const mapDispatchToProps = dispatch => ({
    fetchUserRedux: () => dispatch(actions.fetchAllUsersStart()),
    deleteUserRedux: (id) => dispatch(actions.deleteUser(id))
});

export default connect(mapStateToProps, mapDispatchToProps)(TableManageUser);
