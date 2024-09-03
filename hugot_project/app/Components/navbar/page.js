"use client";
import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.css";
import axios from "axios";
import { Dropdown } from "react-bootstrap";
import styles from "./Navbar.module.css";
import Image from "next/image";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { formatDistanceToNow } from 'date-fns';
import { useRouter } from "next/navigation";

const Page = ({ onLinkClick }) => {
  const handleLinkClick = (content) => {
    onLinkClick(content);
  };

  const [showDropdown, setShowDropdown] = useState(false);
  const [notif, setNotif] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const router = useRouter();

  const toggleDropdown = (isOpen) => {
    if (isOpen) {
      setUnreadCount(0);
      sessionStorage.setItem("lastViewedNotifTime", new Date().toISOString());
    }
    setShowDropdown(isOpen);
  };

  const fetch_notif = async () => {
    const url = "http://localhost/hugot/api/social.php";
    const json = {
      user_id: sessionStorage.getItem("user_id"),
    };

    const formdata = new FormData();
    formdata.append("json", JSON.stringify(json));
    formdata.append("operation", "notif");
    const response = await axios.post(url, formdata);

    const lastViewedNotifTime = sessionStorage.getItem("lastViewedNotifTime");
    
    const newNotif = response.data.filter((notif) => 
      new Date(notif.created_at) > new Date(lastViewedNotifTime)
    );

    setNotif(response.data);
    setUnreadCount(newNotif.length); // Count only new notifications
  };

  useEffect(() => {
    fetch_notif();
  }, []);


  return (
    <div className={styles.navbar}>
         <div className={styles.leftSection}>
        
      </div>
      <div className={styles.centerSection}>
        {/* Your existing navbar icons can go here */}
      </div>
      <div className={styles.rightSection}>
        <Dropdown show={showDropdown} onToggle={toggleDropdown}>
          <Dropdown.Toggle
            as="div"
            onClick={() => toggleDropdown(!showDropdown)}
            className={styles.navIcon}
          >
            <i className="fas fa-bell"></i>
            {unreadCount > 0 && (
              <span className={styles.notificationBadge}>{unreadCount}</span>
            )}
          </Dropdown.Toggle>

          <Dropdown.Menu align="end" className={styles.dropdownMenu}>
            <div className={styles.dropdownHeader}>
              <h6>Notifications</h6>
              <a href="#" className={styles.seeAll}>
                See all
              </a>
            </div>
            {notif.length > 0 ? (
              notif.map((notif) => (
                <React.Fragment key={notif.like_id || notif.comment_id}>
                  {notif.liker_fullname && (
                    <Dropdown.Item className={styles.dropdownItem}>
                      {notif.liker_photo ? (
                        <img
                          src={`http://localhost/hugot/api/uploads/${notif.liker_photo}`}
                          className={styles.profileImage}
                          alt="Profile Photo"
                        />
                      ) : (
                        <img 
                          src="/images/OIP (3).jpg" 
                          className={styles.profileImage} 
                          alt="Default Profile" 
                        />
                      )}
                      <span className={styles.notificationText}>
                        <strong>{notif.liker_fullname}</strong> hearted your post.
                      </span>
                      <small>{formatDistanceToNow(new Date(notif.created_at), { addSuffix: true })}</small>
                    </Dropdown.Item>
                  )}
                  {notif.commenter_fullname &&  (
                    <Dropdown.Item className={styles.dropdownItem}>
                      {notif.profile_photo ? (
                        <img
                          src={`http://localhost/hugot/api/uploads/${notif.profile_photo}`}
                          className={styles.profileImage}
                          alt="Profile Photo"
                        />
                      ) : (
                        <img 
                          src="/images/OIP (3).jpg" 
                          className={styles.profileImage} 
                          alt="Default Profile" 
                        />
                      )}
                      <span className={styles.notificationText}>
                        <strong>{notif.commenter_fullname}</strong> commented on your post:"{notif.post_content}"
                      </span>
                      <small>{formatDistanceToNow(new Date(notif.created_at), { addSuffix: true })}</small>
                    </Dropdown.Item>
                  )}
                   {notif.rater_fullname &&  (
                    <Dropdown.Item className={styles.dropdownItem}>
                       {notif.rater_photo ? (
                        <img
                          src={`http://localhost/hugot/api/uploads/${notif.rater_photo}`}
                          className={styles.profileImage}
                          alt="Profile Photo"
                        />
                      ) : (
                        <img 
                          src="/images/OIP (3).jpg" 
                          className={styles.profileImage} 
                          alt="Default Profile" 
                        />
                      )}
                      <span className={styles.notificationText}>
                        <strong>{notif.rater_fullname}</strong> rate {notif.rating} stars on your post:"{notif.post_content}"
                      </span>
                      <small>{formatDistanceToNow(new Date(notif.created_at), { addSuffix: true })}</small>
                    </Dropdown.Item>
                  )}
                   {notif.replyer_fullname &&  (
                    <Dropdown.Item className={styles.dropdownItem}>
                       {notif.replyer_photo ? (
                        <img
                          src={`http://localhost/hugot/api/uploads/${notif.replyer_photo}`}
                          className={styles.profileImage}
                          alt="Profile Photo"
                        />
                      ) : (
                        <img 
                          src="/images/OIP (3).jpg" 
                          className={styles.profileImage} 
                          alt="Default Profile" 
                        />
                      )}
                      <span className={styles.notificationText}>
                        <strong>{notif.replyer_fullname}</strong> reply on your comment on the post of:"{notif.user_fullname}"
                      </span>
                      <small>{formatDistanceToNow(new Date(notif.created_at), { addSuffix: true })}</small>
                    </Dropdown.Item>
                  )}

                </React.Fragment>
              ))
            ) : (
              <Dropdown.Item>No notifications</Dropdown.Item>
            )}
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </div>
  );
};

export default Page;
