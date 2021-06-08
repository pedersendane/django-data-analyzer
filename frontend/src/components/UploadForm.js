import axios from 'axios';
import React, {
  useState,
  useEffect
} from 'react'
import UploadService from "../services/upload-files.service";
import PitchParser from './PitchParser';

function UploadForm() {
  const [formData, setFormData] = useState({
    file: null,
    progress: 0,
    message: "",
    loading: false,
    response: [],
  });

  function selectFile(event) {
    console.log(event.target.files[0])

    setFormData({
      file: event.target.files[0]
    })
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
          message: "Loading...",
          loading: true
        });
      })
      .then((res) => {
        console.log(res)
        setFormData({
          progress: 100,
          message: "Upload Complete",
          file: currentFile,
          loading: false,
          response: res,
        })
      })
      .catch(() => {
        setFormData({
          progress: 0,
          message: "Unable to post your file.",
          file: undefined,
          loading: false
        });
      });
  }
  return ( <>
    {formData.file && formData.progress > 0 && (
      <div className = "progress" >
        <div className = "progress-bar progress-bar-info progress-bar-striped"
        role = "progressbar"
        aria-valuenow = {formData.progress}
        aria-valuemin = "0"
        aria-valuemax = "100"
        style = {{width: formData.progress + "%"}} >
        {formData.progress} %
        </div>
      </div>
      )
    } <label className = "btn btn-default" >
    <input type = "file"
    name = "file"
    required = ""
    id = "id_file"
    onChange = {
      (e) => selectFile(e)
    }/> </label>

    <button className = "btn btn-success"
    disabled = {
      !formData.file
    }
    onClick = {
      () => upload()
    } >Upload File</button>

    <div className = "alert alert-light"
    role = "alert" > {
      formData.message
      } </div>
    {formData.response ? (<><PitchParser data={formData.response}/></>) : <div></div>}
    </>
  )
}

export default UploadForm;