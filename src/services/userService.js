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
export {
    handleLoginAPI, getAllUser, createNewUserService, deleteUserService, editUserService, getAllCodeService, getTopDoctorHomeService, getAllDoctors, saveDetailDoctorService,
    getDEtailInforDoctor,
}