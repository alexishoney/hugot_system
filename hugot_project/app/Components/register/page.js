"use client";
import React, { useState } from 'react';
import styles from './RegisterForm.module.css';
import axios from 'axios';
import { setDate } from 'date-fns';

const Page = () => {
  const [data, setData] = useState({
    fullname: '',
    gender: '',
    address: '',
    birth_date: '',
    email: '',
    password: ''
  });
  const [retypepassword, setRetypepassword] = useState('');
  const [age, setAge] = useState('');

  // Function to calculate age from birthdate
  const calculateAge = (birthDate) => {
    const today = new Date();
    const birthDateObj = new Date(birthDate);
    let age = today.getFullYear() - birthDateObj.getFullYear();
    const monthDiff = today.getMonth() - birthDateObj.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDateObj.getDate())) {
      age--;
    }

    return age;
  };

  const handleDateChange = (e) => {
    const birthDate = e.target.value;
    setData({ ...data, birth_date: birthDate });
    const calculatedAge = calculateAge(birthDate);
    if (calculatedAge > 5) {
      setAge(calculatedAge);
    } else {
      alert("bawal less than  or equal 5 years old ");
      setData({ ...data, birth_date: '' });
      setAge('');
    }
  };

  const register = async () => {
    try {
      if (!data.fullname || !data.email || !data.password || !retypepassword || !data.birth_date) {
        return alert("You need to fill all the input fields");
      }
      if (data.password !== retypepassword) {
        return alert("Password and retype password do not match");
      }
      if (age === '') {
        return alert("Age must be greater than 5 years");
      }

      const url = 'http://localhost/hugot/api/user.php';
      const formdata = new FormData();
      formdata.append("json", JSON.stringify({ ...data, age: age }));
      formdata.append("operation", "register");
      const response = await axios.post(url, formdata);
      console.log(response.data);

      if (response.data === 1) {
        alert("You are successfully registered");
        setData({
          fullname: '',
          gender: '',
          address: '',
          birth_date: '',
          email: '',
          password: ''
        });
        setRetypepassword('');
        setAge('');
      } else {
        alert("There's something wrong with registering");
      }
    } catch (error) {
      console.log("error:", error);
    }
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.formWrapper}>
          <h2 className={styles.title}>CREATE ACCOUNT</h2>
          <form>
            <div className={styles.inputGroup}>
              <input
                type="text"
                placeholder="Full Name"
                value={data.fullname}
                onChange={(e) => setData({ ...data, fullname: e.target.value })}
                className={styles.inputField}
              />
            </div>
            <div className={styles.inputGroup}>
              <select
                value={data.gender}
                onChange={(e) => setData({ ...data, gender: e.target.value })}
                className={styles.inputField}
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <div className={styles.inputGroup}>
              <input
                type="text"
                placeholder="Address"
                value={data.address}
                onChange={(e) => setData({ ...data, address: e.target.value })}
                className={styles.inputField}
              />
            </div>
            <label>Birthdate</label>
            <div className={styles.inputGroup}>
              <input
                type="date"
                value={data.birth_date}
                onChange={handleDateChange}
                className={styles.inputField}
              />
              {age > 5 && <p className={styles.ageDisplay}>Age: {age}</p>}
            </div>
            <div className={styles.inputGroup}>
              <input
                type="email"
                placeholder="Your Email"
                value={data.email}
                onChange={(e) => setData({ ...data, email: e.target.value })}
                className={styles.inputField}
              />
            </div>
            <div className={styles.inputGroup}>
              <input
                type="password"
                placeholder="Password"
                value={data.password}
                onChange={(e) => setData({ ...data, password: e.target.value })}
                className={styles.inputField}
              />
            </div>
            <div className={styles.inputGroup}>
              <input
                type="password"
                placeholder="Repeat your password"
                value={retypepassword}
                onChange={(e) => setRetypepassword(e.target.value)}
                className={styles.inputField}
              />
            </div>
            <button type="button" className={styles.submitButton} onClick={register}>SIGN UP</button>
          </form>
          <p className={styles.loginText}>
            Have already an account? <a href="../" className={styles.loginLink}>Login here</a>
          </p>
        </div>
      </div>
    </>
  );
};

export default Page;
