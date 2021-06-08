import React from 'react'
import axios from 'axios';

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
        
        let formData = new FormData();
        formData.append('title', file.name);
        formData.append('file', file);
        formData.append('csrfmiddlewaretoken', getCookie());
  
        return axios.post('http://127.0.0.1:8000/upload-file/', formData, {
            headers: {
            'Content-Type': 'multipart/form-data',
            },
            onUploadProgress,
        });
    }
  
    getFiles() {
      return axios.get("/files");
    }
  }
  
  export default new UploadFilesService();