import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { host_static_website } from "../Redux/Actions/HostStaticSite";
import { setup_folder } from "../Redux/Actions/setupFolder";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate } from "react-router-dom";
import { set_crspgif } from "../Redux/Actions/SetCrsrpgif.js";
import Notification from "./Notification.jsx";
import "../css/DomainInput.css";


export default function SiteForm() {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState([]); // Store multiple files
  const [websiteName, setWebsiteName] = useState("");
  const [domainName, setDomainName] = useState("");
  const dispatch = useDispatch();
  const store_data = useSelector((state) => state.Data);
  const nevigate = useNavigate();
  const [open, setOpen] = useState(false); //for loading 

  useEffect(() => {
    setOpen(store_data.ComponentData.show_file_loader);
  }, [store_data.ComponentData.show_file_loader]);

  useEffect(() => {
    if (store_data.ComponentData.nvgt_to_site === true) {
      console.log("nevigating.. to site page.");
      nevigate("/servicePage");
    }
  }, [store_data.ComponentData.nvgt_to_site])

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files); // Convert FileList to array
    if (selectedFiles.length > 0) {
      setFiles(selectedFiles);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files); // Convert FileList to array
    if (droppedFiles.length > 0) {
      setFiles(droppedFiles);
    }
  };

  const handleSubmit = () => {
    if (files.length === 0 || !websiteName) {

      dispatch({
        type: 'SET_ERROR',
        payload: {
          msg: "Please fill all fields and upload at least one file.",
          show: true
        }
      })

      return;
    }
    if (domainName.includes('.')) {
      dispatch({ type: 'SET_ERROR', payload: { msg: "Please enter vaild domain !", show: true } })
      return;
    }
    dispatch(host_static_website({ files, websiteName, domainName }));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };
  useEffect(() => {
    dispatch(setup_folder());
  }, []);
  useEffect(() => {
    console.log("check the state while setup error ", store_data);
  }, [store_data.ComponentData.show_error, store_data.ComponentData.error_message])



  return (
    <div className="h-screen   flex items-center justify-center min-h-screen">
      {store_data.ComponentData.show_error === true ? <Notification
        onConfirm={() => setShowAlert(false)}
        notify={true}
        message={store_data.ComponentData.error_message}
        confirmText="Got it"
        title="Error"
      /> : <></>}

      <Backdrop
        sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
        open={open}

      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <div className="h-full w-[80vw] rounded-lg  p-8 max-w-2xl relative overflow-hidden">
        {/* Spotlight effect */}
        <div className="absolute inset-0  opacity-20 blur-3xl"></div>

        {/* Form Container */}
        <div className="relative z-10">
          <h1 className="text-3xl font-bold text-white mb-6 text-center">
            Host Your Website
          </h1>

          {/* Website Name Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Website Name
            </label>
            <input
              type="text"
              placeholder="Enter your website name"
              value={websiteName}
              onChange={(e) => setWebsiteName(e.target.value)}
              className="w-full px-4 py-3 bg-black text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-transparent placeholder-gray-400"
            />
          </div>

          {/* Domain Name Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Domain Name
            </label>



            <div className="container">
              <span className="prefix">https://</span>
              <input
                type="text"
                value={domainName}
                onChange={(e) => setDomainName(e.target.value)}
                className="myinput-link"
              />
              <span class="link-icon">
                🔗
                <span className="tooltip">COPY</span>
              </span>
            </div>

          </div>

          {/* File Upload */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Upload Files
            </label>
            <div
              className={`flex items-center justify-center w-full bg-black rounded-lg border-2 border-dashed p-6 ${isDragging ? "border-purple-500 bg-gray-900" : "border-gray-700"
                }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input
                type="file"
                className="hidden"
                id="file-upload"
                multiple // Allow multiple files
                onChange={handleFileChange}
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer text-gray-400 hover:text-white text-center"
              >
                {files.length > 0 ? (
                  <p className="text-sm">{files.length} file(s) selected</p>
                ) : (
                  <>
                    <p className="text-sm">
                      Drag & drop files or{" "}
                      <span className="text-purple-500 font-medium">
                        browse
                      </span>
                    </p>
                  </>
                )}
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            className="w-full bg-cyan-800 text-white py-3 rounded-lg font-semibold hover:bg-gray-600 transition duration-300"
          >
            Host Website
          </button>
        </div>
      </div>
    </div>
  );
}
