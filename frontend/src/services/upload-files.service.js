import React from 'react'
import axios from 'axios';
import PitchParser from '../components/PitchParser'

function getCookie() {
    axios.get('http://localhost:8000/upload-file')
        .then(response => {
            console.log(response.data)
            return response.data
        })
        .catch(error => {
        console.log(error)
    })
}
class UploadFilesService {
    upload(file, onUploadProgress) {
        console.log("UFS");
        console.log(file);
        let title = file.name.replace(' ','').replace('(','').replace(')','')
        let formData = new FormData();
        formData.append('title', title);
        formData.append('file', file);
        formData.append('csrfmiddlewaretoken', getCookie());
  
        return axios.post('http://127.0.0.1:8000/upload-file/', formData, {
            headers: {
            'Content-Type': 'multipart/form-data',
            },
            onUploadProgress,
        });
    }
  
    async getFiles(file) {
        let title = file.name.replace(' ', '').replace('(', '').replace(')', '');
        let res = await axios.get("http://127.0.0.1:8000/parse/" + title);
        if (res.status === 200) {
            return <PitchParser data={res}/>
        } else {
            return <h2>Error {res.status}</h2>
        }
    }
  }
  
  export default new UploadFilesService();