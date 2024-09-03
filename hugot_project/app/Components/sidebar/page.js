"use client";
import React, { useState, useEffect } from 'react';
import styles from './Sidebar.module.css'; 
import axios from 'axios';
import * as Icon from 'react-bootstrap-icons';
import { useRouter } from 'next/navigation';
const Sidebar = ({ onLinkClick }) => {
    const [isSidebarVisible, setIsSidebarVisible] = useState(false);
    const [fullname, setFullname] = useState('');
    const [profileImage, setProfileImage] = useState('');
    const router =useRouter();
    const fetch_name = async () => {
        const url = 'http://localhost/hugot/api/user.php';
        const json = { user_id: sessionStorage.getItem("user_id") };
        const formdata = new FormData();
        formdata.append("json", JSON.stringify(json));
        formdata.append("operation", "fetch_fullname");
        const response = await axios.post(url, formdata);
        setFullname(response.data[0].fullname);
        setProfileImage(response.data[0].photo);
    };

    useEffect(() => {
        fetch_name();
    }, []);

    const handleToggleClick = () => {
        setIsSidebarVisible(!isSidebarVisible);
    };

    const handleLinkClick = (content) => {
        onLinkClick(content);
    };

    const home=()=>{
        handleLinkClick('home');
        setIsSidebarVisible(false);
    }
    const savepost=()=>{
        handleLinkClick('savepost');
        setIsSidebarVisible(false);
    }

    const settings=()=>{
        handleLinkClick('settings');
        setIsSidebarVisible(false);
    }

    return (
        <div className={styles.sidebarWrapper}>
        <button className={styles.toggleButton} onClick={handleToggleClick}>
            {isSidebarVisible ? <Icon.X size={24} /> : <Icon.List size={24} />}
        </button>
        <div className={`${styles.sidebar} ${isSidebarVisible ? styles.show : ''}`}>
            <div className={styles.sidebarHeader}>
                <div className={styles.profileContainer}>
                    {profileImage ? (
                        <img
                            src={`http://localhost/hugot/api/uploads/${profileImage}`}
                            className={styles.profileImage}
                            alt="User Profile"
                        />
                    ) : (
                        <img
                            src="/images/OIP (3).jpg"
                            className={styles.profileImage}
                            alt="Default Profile"
                        />
                    )}
                    <h6  onClick={()=>router.push('../Components/profile')} className={styles.fullname}>
                        {fullname}
                    </h6>
                </div>
            </div>
            <ul className={styles.sidebarMenu}>
                <li className={styles.sidebarItem} onClick={() => home()} >
                    <Icon.HouseDoor size={20}  />
                    <span>Home</span>
                </li>
                <li className={styles.sidebarItem} onClick={() => savepost()}>
                    <Icon.Bookmark size={20} />
                    <span>Favorites</span>
                </li>
                <li className={styles.sidebarItem} onClick={() => settings()}>
                    <Icon.GearWideConnected size={20} />
                    <span>Settings</span>
                </li>
                <li className={styles.sidebarItem}>
                    <a href='../' className={styles.logoutLink}>
                        <Icon.DoorOpen size={20} />
                        <span>Logout</span>
                    </a>
                </li>
            </ul>
        </div>
        {isSidebarVisible && <div className={styles.overlay} onClick={handleToggleClick}></div>}
    </div>
    );
};

export default Sidebar;
