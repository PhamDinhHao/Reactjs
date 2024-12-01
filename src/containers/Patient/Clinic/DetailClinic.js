import React, { Component } from 'react';
import { connect } from "react-redux";
import HomeHeader from '../../HomePage/HomeHeader';
import './DetailClinic.scss'
import { getAllDetailClinicById } from '../../../services/userService'
import { LANGUAGES } from '../../../utils';
import DoctorSchedule from '../Doctor/DoctorSchedule';
import DoctorExtraInfor from '../Doctor/DoctorExtraInfor';
import ProfileDoctor from '../Doctor/ProfileDoctor';
import _ from 'lodash';

class DetailClinic extends Component {
    constructor(props) {
        super(props)
        this.state = {
            arrDoctorId: [],
            dataDetailClinic: {},
        }
    }

    async componentDidMount() {
        if (this.props.match && this.props.match.params && this.props.match.params.id) {
            let id = this.props.match.params.id;

            let res = await getAllDetailClinicById({ id: id });

            if (res && res.errCode === 0) {
                let data = res.data;
                let arrDoctorId = [];
                if (data && !_.isEmpty(data.doctorClinic)) {
                    let arr = data.doctorClinic;
                    arr.forEach(element => {
                        arrDoctorId.push(element.doctorId);
                    });
                }
                this.setState({
                    dataDetailClinic: res.data,
                    arrDoctorId: arrDoctorId
                })
            }


        }
    }
    componentDidUpdate(prevProps, prevState, snapshot) {

    }
    render() {

        let { dataDetailClinic, arrDoctorId } = this.state;
        let { language } = this.props;

        return (
            <>
                <div className='detail-specialty-container'>
                <HomeHeader />
                <div className='detail-specialty-body'>
                        <div className='description-specialty'>
                            {
                                dataDetailClinic && !_.isEmpty(dataDetailClinic) && <>
                                    <div >{dataDetailClinic.name}</div>
                                    <div dangerouslySetInnerHTML={{ __html: dataDetailClinic.descriptionHTML }} />
                                </>
                            }
                        </div>
                        {arrDoctorId && arrDoctorId.length > 0 && arrDoctorId.map((item, index) => {
                            return (
                                <div className='each-doctor' key={index}>
                                    <div className='dt-content-left'>
                                        <div className='profile-doctor'>
                                            <ProfileDoctor doctorId={item}
                                                isShowDescriptionDoctor={false}
                                                isShowLinkDetail={false}
                                                isShowPrice={false}
                                            />
                                        </div>
                                        <div className='doctor-schedule'>
                                            <DoctorSchedule doctorIdFromParent={item} />
                                        </div>
                                        <div className='doctor-extra-infor'>
                                            <DoctorExtraInfor doctorIdFromParent={item} />
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </>



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

export default connect(mapStateToProps, mapDispatchToProps)(DetailClinic);
