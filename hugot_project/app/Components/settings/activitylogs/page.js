"use client";
import React from 'react';
import styles from './page.module.css';
import { useState,useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import axios from 'axios';
import * as Icon from 'react-bootstrap-icons';
const Page = () => {

  const[showcommentmodal,setShowcommentmodal]=useState(false);
  const[showRate,setShowRate]=useState(false);
  const[activitylogscomments,setActivitylogscomments]=useState([]);
  const [showLikeModal, setShowLikeModal] = useState(false);
  const [likes, setLikes] = useState([]);
  const[rate,setRate]= useState([]);
  const Activitylogscomments = async()=>{
    const url = "http://localhost/hugot/api/social.php";
    const json={
      user_id:sessionStorage.getItem("user_id")
    }
    const formdata= new FormData();
    formdata.append("json",JSON.stringify(json));
    formdata.append("operation","activitylogs_comment");
    const response= await axios.post(url,formdata);
    console.log(response.data);
    setActivitylogscomments(response.data);

  }
  const Activitylogs_rate = async()=>{
    const url = "http://localhost/hugot/api/social.php";
    const json={
      user_id:sessionStorage.getItem("user_id")
    }
    const formdata= new FormData();
    formdata.append("json",JSON.stringify(json));
    formdata.append("operation","activitylogs_rate");
    const response= await axios.post(url,formdata);
    console.log(response.data);
    setRate(response.data);

  }
  const fetchLikes = async () => {
    const url = "http://localhost/hugot/api/social.php";
    const json = {
      user_id: sessionStorage.getItem("user_id")
    };
    const formData = new FormData();
    formData.append("json", JSON.stringify(json));
    formData.append("operation","activitylogs_like");
    const response = await axios.post(url, formData);
    console.log(response.data);
    setLikes(response.data);
  };
  useEffect(()=>{
    Activitylogscomments();
    fetchLikes();
    Activitylogs_rate();
  },[])
  
  return (
   <>
    <div className={styles.container}>
     
     {/* <div className={styles.item}>
       <span className={styles.icon}>🔍</span>
       <span className={styles.label}>Your search history</span>
       <span className={styles.arrow}>➔</span>
     </div> */}
    
     <div className={styles.item} onClick={()=>setShowcommentmodal(true)}>
       <span className={styles.icon}>💬</span>
       <span className={styles.label}>Comments</span>
       {/* <span className={styles.arrow}>➔</span> */}
     </div>

     <div className={styles.item} onClick={() => setShowLikeModal(true)}>
       <span className={styles.icon}>👍</span>
       <span className={styles.label}>Post Likes</span>
       {/* <span className={styles.arrow}>➔</span> */}
     </div>

     <div className={styles.item}  onClick={() => setShowRate(true)}>
       <span className={styles.icon}><Icon.Star/></span>
       <span className={styles.label}>Rate</span>
    
     </div>
  
   </div>

        <Modal
        show={showcommentmodal}
        onHide={() => setShowcommentmodal(false)}
        backdrop="static"
      >
        <Modal.Header closeButton className="text-black">
          <center>Comments</center>
        </Modal.Header>
        <Modal.Body>
          {activitylogscomments.map((comment, index) => (
            <div className={styles.commentContainer} key={index}>
            <div className={styles.date}>
                      {new Date(comment.created_at).toLocaleDateString()}
                    </div>
              <div className={styles.comment}>
            
                {comment.commenter_photo ? (
                  <img
                    src={`http://localhost/hugot/api/uploads/${comment.commenter_photo}`}
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
                <div className={styles.commentContent}>
                  <div className={styles.commentText}>
                    <strong>{comment.commenter_fullname}</strong> commented on {comment.user_fullname}'s post.
                  </div>
                  <div className={styles.commentDetail}>
                  <span>🕒 {new Date(comment.created_at).toLocaleTimeString()}</span>
                
                  </div>
                </div>
            
              </div>
            </div>
          ))}
        </Modal.Body>
      </Modal>

<Modal
        show={showLikeModal}
        onHide={() => setShowLikeModal(false)}
        backdrop="static"
      >
        <Modal.Header closeButton className="text-black">
          <center>Likes</center>
        </Modal.Header>
        <Modal.Body>
         {likes.map((like, index) => (
             <div className={styles.commentContainer} key={index}>
              <div className={styles.date}>
                {new Date(like.created_at).toLocaleDateString()}
              </div>
             <div className={styles.comment}>
             
               {like.liker_photo ? (
                 <img
                   src={`http://localhost/hugot/api/uploads/${like.liker_photo}`}
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
               <div className={styles.commentContent}>
                 <div className={styles.commentText}>
                   <strong>{like.liker_fullname}</strong> heart on {like.user_fullname}'s post.
                 </div>
                 <div className={styles.commentDetail}>
                 <span>🕒 {new Date(like.created_at).toLocaleTimeString()}</span>
                 
                 </div>
               </div>
             
             </div>
           </div>
          ))}
        </Modal.Body>
      </Modal>

      <Modal
        show={showRate}
        onHide={() => setShowRate(false)}
        backdrop="static"
      >
        <Modal.Header closeButton className="text-black">
          <center>Rate</center>
        </Modal.Header>
        <Modal.Body>
         {rate.map((rate, index) => (
             <div className={styles.commentContainer} key={index}>
              <div className={styles.date}>
                {new Date(rate.created_at).toLocaleDateString()}
              </div>
             <div className={styles.comment}>
             
               {rate.rater_photo ? (
                 <img
                   src={`http://localhost/hugot/api/uploads/${rate.rater_photo}`}
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
               <div className={styles.commentContent}>
                 <div className={styles.commentText}>
                   <strong>{rate.rater_fullname}</strong> Rate {rate.rating} stars on {rate.user_fullname}'s post.
                 </div>
                 <div className={styles.commentDetail}>
                 <span>🕒 {new Date(rate.created_at).toLocaleTimeString()}</span>
                 
                 </div>
               </div>
             
             </div>
           </div>
          ))}
        </Modal.Body>
      </Modal>
   </>
  );
};

export default Page;
