"use client";
import React, { useState, useEffect } from 'react';
import { Card, Dropdown } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import axios from 'axios';
import Styles from './page.module.css';
import * as Icon from 'react-bootstrap-icons';
const Page = () => {
    const [savedList, setSavedList] = useState([]);
    const [filterdata,setFilderData]=useState('');  
    const [isOpen, setIsOpen] = useState(false);
    const fetchSavedPost = async () => {
        const url = 'http://localhost/hugot/api/social.php';
        const json = {
            user_id: sessionStorage.getItem("user_id"),
            filter_data:filterdata
        };
        const formData = new FormData();
        formData.append("json", JSON.stringify(json));
        formData.append("operation", "fetch_savedpost");
        const response = await axios.post(url, formData);
        console.log(response.data);
        setSavedList(response.data);
    };

    const unsave = async (hugot_id) => {
        const url = 'http://localhost/hugot/api/social.php';
        const json = {
            hugot_id: hugot_id
        };
        const formData = new FormData();
        formData.append("json", JSON.stringify(json));
        formData.append("operation", "unsaved");
        const response = await axios.post(url, formData);
        console.log(response.data);
        fetchSavedPost();
    };

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
      };

    useEffect(() => {
        fetchSavedPost();
    }, [filterdata]);

    return (
     <>
      <div className={Styles.container}>
      <h5 style={{marginTop:'50px'}}>All</h5>
      <button onClick={toggleDropdown} className={Styles.filtersButton} >
        <Icon.Sliders/>
        </button>

      {isOpen && (
        <div className={Styles.dropdown}>
          {/* Add your dropdown content here */}
         <label> Filter What type of hugot</label><br/>
          <select value={filterdata} onChange={(e)=>setFilderData(e.target.value)} className={Styles.filterSelect}>
          <option value={""}>All</option>
          <option value={"love"}>Love</option>
          <option value={"work"}>Work</option>
          <option value={"life"}>Life</option>
          </select>
        </div>
      )}
        {savedList.map((saved, index) => (
       
                <Card key={index} className={Styles.card}>
                    <Card.Body>
                        <div className={Styles.header}>
                            <div>
                            <div className={Styles.profileContainer}>
                                {
                                    saved.Profile_photo ?(
                                        <img
                                        src={`http://localhost/hugot/api/uploads/${saved.Profile_photo}`}
                                        className={Styles.profileImage}
                                        alt="Profile Photo"
                                    />
                                    ):(
                                        <img 
                                        src="/images/OIP (3).jpg" 
                                        className={Styles.profileImage} 
                                        alt="Default Profile" 
                                      />
                                    )
                                }
                                <span className={Styles.fullname}>{saved.fullname}</span>
                            </div>
                                <small className={Styles.timestamp}>{saved.type}</small>
                            </div>
                            <Dropdown >
                                <Dropdown.Toggle variant="link" bsPrefix="p-0" id="dropdown-basic" style={{marginBottom:'35px'}}>
                               
                                <Icon.ThreeDotsVertical/>
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item onClick={() => unsave(saved.hugot_id)}>Unsave</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                   
                        {saved.photo && <img src={`http://localhost/hugot/api/uploads/${saved.photo}`} className={Styles.previewImage} />}
                        <Card.Text className={Styles.content}>{saved.content}</Card.Text>
                    </Card.Body>
                </Card>
           
            ))}
        </div>
     </>
    );
};

export default Page;
