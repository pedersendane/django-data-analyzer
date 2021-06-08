import axios from 'axios';
import React, { useState, useEffect } from 'react'
import UploadService from "../services/upload-files.service";

function UploadForm() {
    const [formData, setFormData] = useState({file: null, progress: 0, message: "" });
    
    function selectFile(event) {
        console.log(event.target.files[0])
        
        setFormData({ file: event.target.files[0] })
    }

    function upload() {
        let currentFile = formData.file;
        setFormData({
          progress: 0,
            file: currentFile,
          
        });
        UploadService.upload(currentFile, (event) => {
          setFormData({
            progress: Math.round((100 * event.loaded) / event.total),
          });
        })
          .then((response) => {
            setFormData({
              message: response.data.message,
            });
            return UploadService.getFiles();
          })
          .then((files) => {
            console.log(files)
          })
          .catch((error) => {
            setFormData({
              progress: 0,
              message: error.message,
                file: undefined,
            });
          });
    
        setFormData({
          files: undefined,
        });
      }
    return (
        <>
        {formData.file && formData.progress > 0 && (
          <div className="progress">
            <div
              className="progress-bar progress-bar-info progress-bar-striped"
              role="progressbar"
              aria-valuenow={formData.progress}
              aria-valuemin="0"
              aria-valuemax="100"
              style={{ width: formData.progress + "%" }}
            >
              {formData.progress}%
            </div>
          </div>
        )}
        <label className="btn btn-default">
            <input type="file" name="file" required="" id="id_file" onChange={(e) => selectFile(e)} />
        </label>

        <button className="btn btn-success"
          disabled={!formData.file}
          onClick={() => upload()}
        >
          Upload File
        </button>

        <div className="alert alert-light" role="alert">
          {formData.message}
        </div>
        </>
    )
}

export default UploadForm;
