import axios from '../axios'
const handleLoginAPI = (userEmail, userPassword) => {
    return axios.post('/api/login', { email: userEmail, password: userPassword })
}
const getAllUser = (inputid) => {
    return axios.get(`api/get-all-users?id=${inputid}`)
}
const createNewUserService = (data) => {
    return axios.post('/api/create-new-user', data)
}
const deleteUserService = (userid) => {
    return axios.delete('/api/delete-user', {
        data: {
            id: userid
        }
    })
}
const editUserService = (inputdata) => {
    return axios.put('/api/edit-user', inputdata);
}
const getAllCodeService = (inputdata) => {
    return axios.get(`/api/allcode?type=${inputdata}`)
}
const getTopDoctorHomeService = (limit) => {
    return axios.get(`/api/top-doctor-home?limit=${limit}`)
}
const getAllDoctors = () => {
    return axios.get(`/api/get-all-doctor`)
}
const saveDetailDoctorService = (data) => {
    return axios.post('/api/save-infor-doctor', data)
}
const getDEtailInforDoctor = (inputid) => {
    return axios.get(`/api/get-detail-doctor-by-id?id=${inputid}`)
}
const saveBulkScheduleDoctor = (data) => {
    return axios.post('/api/bulk-create-schedule', data)
}

const getScheduleByDate = (doctorId, date) => {
    return axios.get(`/api/get-schedule-doctor-by-date?doctorId=${doctorId}&date=${date}`)
}
const getExtraInforDoctorById = (doctorId) => {
    return axios.get(`/api/get-extra-infor-doctor-by-id?doctorId=${doctorId}`)
}
const getProfileDoctorById = (doctorId) => {
    return axios.get(`/api/get-profile-doctor-by-id?doctorId=${doctorId}`)
}
const getDoctorInfoById = (doctorId) => {
    return axios.get(`/api/get-profile-doctor-by-id?doctorId=${doctorId}`)
}
const postBookingAppointment = (data) => {
    return axios.post('/api/patient-book-appointment', data)
}
const verifyBookingAppointment = (data) => {
    return axios.post('/api/verify-booking-appointment', data)
}
export {
    handleLoginAPI, getAllUser, createNewUserService, deleteUserService, editUserService, getAllCodeService, getTopDoctorHomeService, getAllDoctors, saveDetailDoctorService,
    getDEtailInforDoctor, saveBulkScheduleDoctor, getScheduleByDate, getExtraInforDoctorById, getProfileDoctorById, getDoctorInfoById, postBookingAppointment, verifyBookingAppointment
}