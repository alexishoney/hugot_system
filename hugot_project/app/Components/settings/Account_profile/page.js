"use client";
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import styles from './page.module.css';
import * as Icon from 'react-bootstrap-icons';

function ProfilePage() {
  const [data, setData] = useState({
    fullname: '',
    gender: '',
    address: '',
    birth_date:'',
    email: ''
  });
  
  // const [profilePhoto, setProfilePhoto] = useState(null);
  // const fileInputRef = useRef(null); // Ref to access the file input

  const fetchUserData = async () => {
    try {
      const url = 'http://localhost/hugot/api/user.php';
      const json = {
        user_id: sessionStorage.getItem("user_id")
      };
      const formData = new FormData();
      formData.append("json", JSON.stringify(json));
      formData.append("operation", "fetch_data");

      const response = await axios.post(url, formData);
      console.log(response.data);
      setData(response.data[0]);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  // const handleFileChange = (e) => {
  //   const file = e.target.files[0];
  //   setProfilePhoto(file);
  // };

  // const handleRemovePhoto = () => {
  //   setProfilePhoto(null);
  //   if (fileInputRef.current) {
  //     fileInputRef.current.value = ''; // Clear the file input value
  //   }
  // };

  const Update = async()=>{
    const url = 'http://localhost/hugot/api/user.php';
    const json={
      user_id:sessionStorage.getItem("user_id"),
      data:data
    };
    const formdata= new FormData();
    formdata.append("json",JSON.stringify(json));
 
    formdata.append("operation","update_profile");
    const response= await axios.post(url,formdata);
    console.log(response.data);

    if(response.data == 1){
      alert("profile updated successfully")
    }else{
      alert("profile not updated");
    }
  }

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
  <>
 
    <div className={styles.container}>
      <div className={styles.profilePage}>
        <h2 className={styles.title}>Update Profile</h2>
        <div className={styles.tabs}>
          <button className={styles.activeTab}>User info</button>
        </div>
        <form className={styles.profileForm} >
          <div className={styles.formGroup}>
            <label>Full Name</label>
            <input
              type="text"
              placeholder="Full Name"
              value={data.fullname}
              onChange={(e) => setData({ ...data, fullname: e.target.value })}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Gender</label>
            <select
              className={styles.inputField}
              value={data.gender}
              onChange={(e) => setData({ ...data, gender: e.target.value })}
            >
               <option >Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
          <div className={styles.formGroup}>
            <label>Address</label>
            <input
              type="text"
              placeholder="Address"
              value={data.address}
              onChange={(e) => setData({ ...data, address: e.target.value })}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Birthdate</label>
            <input
              type="date"
      
              value={data.birth_date}
              onChange={(e) => setData({ ...data, birth_date: e.target.value })}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter email"
              value={data.email}
              onChange={(e) => setData({ ...data, email: e.target.value })}
            />
          </div>
         <button className={styles.updateButton} type="submit" onClick={Update}>Update info</button>
        </form>
      </div>
    </div>
  </>
  );
}

export default ProfilePage;
