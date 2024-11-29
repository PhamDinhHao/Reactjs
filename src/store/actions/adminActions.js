import actionTypes from './actionTypes';
import { getAllCodeService, createNewUserService, getAllUser, deleteUserService, editUserService, getTopDoctorHomeService, getAllDoctors, saveDetailDoctorService, getAllSpecialty } from '../../services/userService';
import { toast } from 'react-toastify';

// export const fetchGenderStart = () => ({
//     type: actionTypes.FETCH_GENDER_START
// })
export const fetchGenderStart = () => {
    return async (dispatch, getState) => {
        try {
            dispatch({
                type: actionTypes.FETCH_GENDER_START
            })
            let res = await getAllCodeService("GENDER");
            if (res && res.errCode === 0) {
                dispatch(fetchGenderSucces(res.data))
            }
            else {
                dispatch(fetchGenderFailed())
            }

        } catch (error) {

            console.log(error);
        }
    }

}
export const fetchGenderSucces = (genderData) => ({
    type: actionTypes.FETCH_GENDER_SUCCESS,
    data: genderData
})
export const fetchGenderFailed = () => ({
    type: actionTypes.FETCH_GENDER_FAILED
})

export const fetchPositionSucces = (positionData) => ({
    type: actionTypes.FETCH_POSITION_SUCCESS,
    data: positionData
})
export const fetchPositionFailed = () => ({
    type: actionTypes.FETCH_POSITION_FAILED
})

export const fetchRoleSucces = (roleData) => ({
    type: actionTypes.FETCH_ROLE_SUCCESS,
    data: roleData
})
export const fetchRoleFailed = () => ({
    type: actionTypes.FETCH_ROLE_FAILED
})
export const fetchPositionStart = () => {
    return async (dispatch, getState) => {
        try {

            let res = await getAllCodeService("POSITION");
            if (res && res.errCode === 0) {
                dispatch(fetchPositionSucces(res.data))
            }
            else {
                dispatch(fetchPositionFailed())
            }

        } catch (error) {

            console.log(error);
        }
    }

}
export const fetchRoleStart = () => {
    return async (dispatch, getState) => {
        try {

            let res = await getAllCodeService("ROLE");
            if (res && res.errCode === 0) {
                dispatch(fetchRoleSucces(res.data))
            }
            else {
                dispatch(fetchRoleFailed())
            }

        } catch (error) {

            console.log(error);
        }
    }

}
export const createNewUser = (data) => {
    return async (dispatch, getState) => {
        try {

            let res = await createNewUserService(data);

            if (res && res.errCode === 0) {
                toast.success("Create a new user success") //thu vien toastify
                dispatch(saveUserSuccess())
                dispatch(fetchAllUsersStart())
            }
            else {
                toast.success("Create a new user arror")
                dispatch(saveUserFailed())
            }

        } catch (error) {
            toast.success("Create a new user arror")
            console.log(error);
        }
    }
}
export const saveUserSuccess = () => ({
    type: 'CREATE_USER_SUCCESS'
})
export const saveUserFailed = () => ({
    type: 'REATE_USER_FAILDED'
})
export const fetchAllUsersStart = () => {
    return async (dispatch, getState) => {
        try {

            let res = await getAllUser("ALL");
            if (res && res.errCode === 0) {
                dispatch(fetchAllUsersSucces(res.users.reverse())) ///reverse giup dao nguoc mang
            }
            else {
                toast.success("Fetch all user error")
                dispatch(fetchAllUsersFailed())
            }

        } catch (error) {
            toast.success("Fetch all user error")
            dispatch(fetchAllUsersFailed());
            console.log(error);
        }
    }

}
export const fetchAllUsersSucces = (data) => ({
    type: actionTypes.FETCH_ALL_USER_SUCCESS,
    users: data
})
export const fetchAllUsersFailed = () => ({
    type: actionTypes.FETCH_ALL_USER_FAILED

})
export const deleteUser = (userid) => {
    return async (dispatch, getState) => {
        try {

            let res = await deleteUserService(userid);

            if (res && res.errCode === 0) {
                toast.success("delete a new user success") //thu vien toastify
                dispatch(deleteUserSuccess())
                dispatch(fetchAllUsersStart())
            }
            else {
                toast.success("delete a new user error")
                dispatch(deleteUserFailed())
            }

        } catch (error) {
            toast.success("delete a new user error")
            dispatch(deleteUserFailed())
            console.log("error", error);
        }
    }
}
export const deleteUserSuccess = () => ({
    type: actionTypes.DELETE_USER_SUCCESS
})
export const deleteUserFailed = () => ({
    type: actionTypes.DELETE_USER_FAILDED
})
export const editUser = (data) => {
    return async (dispatch, getState) => {
        try {

            let res = await editUserService(data);

            if (res && res.errCode === 0) {
                toast.success("update user success") //thu vien toastify
                dispatch(editUserSuccess())
                dispatch(fetchAllUsersStart())
            }
            else {
                toast.success("Edit  user error")
                dispatch(editUserFailed())
            }

        } catch (error) {
            toast.success("Edituser error")
            dispatch(editUserFailed())
            console.log("error", error);
        }
    }
}
export const editUserSuccess = () => ({
    type: actionTypes.EDIT_USER_SUCCESS
})
export const editUserFailed = () => ({
    type: actionTypes.EDIT_USER_FAILDED
})
export const fetchTopDoctor = () => {
    return async (dispatch, getState) => {
        try {

            let res = await getTopDoctorHomeService('10');

            if (res && res.errCode === 0) {
                dispatch({
                    type: actionTypes.FETCH_TOP_DOCTORS_SUCCESS,
                    dataDoctor: res.data
                })
            }
            else {

                dispatch({
                    type: actionTypes.FETCH_TOP_DOCTORS_FAILED,

                })
            }



        } catch (error) {
            console.log('FETCH_TOP_DOCTORS_FAILED', error)
        }
    }
}
export const fetchAllDoctor = () => {
    return async (dispatch, getState) => {
        try {

            let res = await getAllDoctors();

            if (res && res.errCode === 0) {
                dispatch({
                    type: actionTypes.FETCH_ALL_DOCTORS_SUCCESS,
                    dataDoctors: res.data
                })
            }
            else {

                dispatch({
                    type: actionTypes.FETCH_ALL_DOCTORS_FAILED,

                })
            }



        } catch (error) {
            console.log('FETCH_TOP_DOCTORS_FAILED', error)
        }
    }
}
export const saveDetailDoctor = (data) => {
    return async (dispatch, getState) => {
        try {

            let res = await saveDetailDoctorService(data);

            if (res && res.errCode === 0) {
                toast.success("Save infor detail doctor succeed")
                dispatch({
                    type: actionTypes.SAVE_DETAIL_DOCTOR_SUCCESS,

                })
            }
            else {
                toast.error("Save infor detail doctor failed")
                dispatch({
                    type: actionTypes.SAVE_DETAIL_DOCTOR_FAILED,

                })
            }



        } catch (error) {
            toast.error("Save infor detail doctor failed")
            console.log('FETCH_TOP_DOCTORS_FAILED', error)
        }
    }
}
export const fetchAllScheduleTime = () => {
    return async (dispatch, getState) => {
        try {

            let res = await getAllCodeService('TIME');

            if (res && res.errCode === 0) {
                dispatch({
                    type: actionTypes.FETCH_ALLCODE_SCHEDULE_TIME_SUCCESS,
                    dataTime: res.data
                })
            }
            else {

                dispatch({
                    type: actionTypes.FETCH_ALLCODE_SCHEDULE_TIME_FAILED,

                })
            }



        } catch (error) {
            console.log('FETCH_TOP_DOCTORS_FAILED', error)
        }
    }
}

export const getAllRequiredDoctorInfor = () => {
    return async (dispatch, getState) => {
        try {
            dispatch({ type: actionTypes.FETCH_REQUIRED_DOCTOR_INFOR_START })

            let resPrice = await getAllCodeService("PRICE")
            let resPayment = await getAllCodeService("PAYMENT")
            let resProvince = await getAllCodeService("PROVINCE")
            let resSpecialty = await getAllSpecialty();

            if (resPrice && resPrice.errCode === 0 && resPayment && resPayment.errCode === 0 && resProvince && resProvince.errCode === 0 && resSpecialty && resSpecialty.errCode === 0) {
                let data = {
                    resPrice: resPrice.data,
                    resPayment: resPayment.data,
                    resProvince: resProvince.data,
                    resSpecialty: resSpecialty.data
                }
                dispatch(fetchRequiredDoctorInforSuccess(data))
            } else {
                dispatch(fetchRequiredDoctorInforFailed())
            }
        }
        catch (e) {
            dispatch(fetchRequiredDoctorInforFailed())

        }
    }
}

export const fetchRequiredDoctorInforSuccess = (allRequiredData) => ({
    type: actionTypes.FETCH_REQUIRED_DOCTOR_INFOR_SUCCESS,
    data: allRequiredData
})

export const fetchRequiredDoctorInforFailed = () => ({
    type: actionTypes.FETCH_REQUIRED_DOCTOR_INFOR_FAILED
})