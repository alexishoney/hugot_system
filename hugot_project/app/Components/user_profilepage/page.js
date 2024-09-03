"use client";
import React from 'react';
import { useEffect,useState } from 'react';
import { Form, Button, Modal, Card, Row, Col, Dropdown } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import axios from 'axios';
import styles from './page.module.css';
import { formatDistanceToNow } from 'date-fns';
import * as Icon from 'react-bootstrap-icons';
import { FaStar } from "react-icons/fa"; // Import star icons
const ProfilePage = () => {
const [photo,setPhoto]=useState(null);
const[name,setName]= useState('');
const[address,setAddress]= useState('');
const[gender,setGender]= useState('');
const [user_postdata,setUser_postdata]=useState([]);
const [savedPosts, setSavedPosts] = useState(new Set()); // Track saved posts
const [commentPost, setCommentPost] = useState({});
const [comments, setComments] = useState({});
const [likedPosts, setLikedPosts] = useState(new Set());
const [commentList, setCommentList] = useState([]);
const [modalComments, setModalComments] = useState(false);
// const [rating, setRating] = useState({});
const [hoverRating, setHoverRating] = useState({});
const [replyIndex, setReplyIndex] = useState(null);
const [replytext,setReplyText]= useState('');
const [replylist,setReplyList]= useState([]);
const [selectedCommentId, setSelectedCommentId] = useState('');
const [filterdata,setFilderData]=useState('');  
const [isOpen, setIsOpen] = useState(false);
const [Cover_photo,setCoverphoto]=useState(null);
const handleReplyClick = (index,comment_id) => {
  fetch_reply(comment_id);
  setReplyIndex(replyIndex === index ? null : index);

};
const fetch_usersdata = async()=>{
    const url = "http://localhost/hugot/api/social.php";
    const json={
      user_id:sessionStorage.getItem("Profile_id"),
      filter_data:filterdata
    }
    const formdata= new FormData();
    formdata.append("json",JSON.stringify(json)); 
    formdata.append("operation","fetch_userdata");
    const response= await axios.post(url,formdata);
    console.log(response.data);
    if (response.data && response.data.length > 0) {
      setPhoto(response.data[0].Profile_photo);
      setName(response.data[0].fullname);
      setAddress(response.data[0].address);
      setGender(response.data[0].gender);
      setCoverphoto(response.data[0].Cover_photo);
      setUser_postdata(response.data);
  } else {
      console.error("No data found or data is undefined.");
    
  }
  
  
}

const comments_modal = (hugot_id) => {
    setModalComments(true);
    fetchpost_byID(hugot_id);
    fetch_comments(hugot_id);
  };

  const fetchpost_byID = async (hugot_id) => {
    const url = 'http://localhost/hugot/api/social.php';
    const json = {
      hugot_id: hugot_id,
   
    };
    const formdata = new FormData();
    formdata.append("json", JSON.stringify(json));
    formdata.append("operation", "fetchpost_byid");
    const response = await axios.post(url, formdata);
    console.log(response.data);
    setCommentPost(response.data[0]);
  };

  const comment = async (hugot_id) => {
    if (!comments[hugot_id] || '') {
      return alert("Please fill the comment field before sending");
    }
    const url = 'http://localhost/hugot/api/social.php';
    const json = {
      hugot_id: hugot_id,
      user_id: sessionStorage.getItem("user_id"),
      comment: comments[hugot_id] || ''
    };
    const formdata = new FormData();
    formdata.append("json", JSON.stringify(json));
    formdata.append("operation", "comment");
    const response = await axios.post(url, formdata);
    console.log(response.data);
    fetch_usersdata();
    setComments(prev => ({ ...prev, [hugot_id]: '' }));
  };

  const fetch_comments = async (hugot_id) => {
    const url = 'http://localhost/hugot/api/social.php';
    const json = {
      hugot_id: hugot_id
    };
    const formdata = new FormData();
    formdata.append("json", JSON.stringify(json));
    formdata.append("operation", "fetch_comment");
    const response = await axios.post(url, formdata);
    console.log(response.data);
    setCommentList(response.data);
  };

  const fetch_liked_posts = async () => {
    const url = 'http://localhost/hugot/api/social.php';
    const json = {
      user_id: sessionStorage.getItem("user_id")
    };
    const formdata = new FormData();
    formdata.append("json", JSON.stringify(json));
    formdata.append("operation", "fetch_like");
    const response = await axios.post(url, formdata);
    console.log(response.data);
    setLikedPosts(new Set(response.data.map(post => post.hugot_id)));
  };

  const handleLike = async (hugot_id) => {
    const isLiked = likedPosts.has(hugot_id);
    const url = 'http://localhost/hugot/api/social.php';
    const json = {
      hugot_id: hugot_id,
      user_id: sessionStorage.getItem("user_id"),
      like: !isLiked
    };
    const formdata = new FormData();
    formdata.append("json", JSON.stringify(json));
    formdata.append("operation", "like");
    const response = await axios.post(url, formdata);
    console.log(response.data);

    if (response.data === 1) {
      setLikedPosts(prevLikedPosts => {
        const newLikedPosts = new Set(prevLikedPosts);
        if (isLiked) {
          newLikedPosts.delete(hugot_id);
        } else {
          newLikedPosts.add(hugot_id);
        }
        return newLikedPosts;
      });
      fetch_usersdata();
    } else {
      console.log("Failed to record like");
    }
  };
  const fetch_saved_posts = async () => {
    const url = 'http://localhost/hugot/api/social.php';
    const json = { user_id: sessionStorage.getItem("user_id") };
    const formdata = new FormData();
    formdata.append("json", JSON.stringify(json));
    formdata.append("operation", "fetch_savedpost");
    const response = await axios.post(url, formdata);
    setSavedPosts(new Set(response.data.map(post => post.hugot_id)));
  };

  const saved_post = async (hugot_id) => {
    if (savedPosts.has(hugot_id)) {
      alert("This post is already saved.");
      return;
    }

    const url = 'http://localhost/hugot/api/social.php';
    const json = {
      hugot_id: hugot_id,
      user_id: sessionStorage.getItem("user_id"),
    };
    const formdata = new FormData();
    formdata.append("json", JSON.stringify(json));
    formdata.append("operation", "save_post");
    const response = await axios.post(url, formdata);
    if (response.data == 1) {
      setSavedPosts(prev => new Set(prev.add(hugot_id)));
      alert("Post saved successfully");
    } else {
      alert("Post not saved");
    }
  };
  const unsave_post = async (hugot_id) => {
    const url = 'http://localhost/hugot/api/social.php';
    const json = {
      hugot_id: hugot_id,
    
    };
    const formdata = new FormData();
    formdata.append("json", JSON.stringify(json));
    formdata.append("operation", "unsaved");
    const response = await axios.post(url, formdata);
  
    if (response.data === 1) {
      setSavedPosts(prev => {
        const newSavedPosts = new Set(prev);
        newSavedPosts.delete(hugot_id);
        return newSavedPosts;
      });
      alert("Post unsaved successfully");
    } else {
      alert("Post not unsaved");
    }
  };
  const handleRating = async (hugot_id, value) => {
    const url = "http://localhost/hugot/api/social.php";
    const json = {
      hugot_id: hugot_id,
      user_id: sessionStorage.getItem("user_id"), 
      rating: value,
    };
    const formdata = new FormData();
    formdata.append("json", JSON.stringify(json));
    formdata.append("operation", "rate_post");
    const response = await axios.post(url, formdata);
    if (response.data === 1) {
      fetch_post(); // Refresh posts to show updated ratings
    } else {
      console.log("Failed to rate post");
    }
  };

  const sendreply= async(hugot_id,comment_id)=>{
    if (!replytext) {
      return alert("Please enter your reply before posting");
    }

    
    const url = "http://localhost/hugot/api/social.php";
    const json = {
      comment_id:comment_id,
      hugot_id: hugot_id,
      user_id: sessionStorage.getItem("user_id"), 
      reply:replytext
    };

    const formdata= new FormData();
    formdata.append("json",JSON.stringify(json));
    formdata.append("operation","send_reply");
    const response = await axios.post(url,formdata);
    console.log(response.data);
    setReplyText('');
    fetch_reply(comment_id);
  }

  const fetch_reply = async (comment_id) => {
    const url = 'http://localhost/hugot/api/social.php';
    const json = {
      comment_id:comment_id,
      
    };
    const formdata = new FormData();
    formdata.append("json",JSON.stringify(json));
    formdata.append("operation", "fetch_reply");
    const response = await axios.post(url, formdata);
    console.log(response.data);
    setReplyList(response.data);
    setSelectedCommentId(comment_id);
    
   
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };


useEffect(()=>{
fetch_usersdata();
fetch_liked_posts();
fetch_saved_posts();
},[filterdata])
  return (
    <>
 <div className={styles.profilePage}>
      <div className={styles.header}>
      {Cover_photo ? (
      
      <img
        src={`http://localhost/hugot/api/uploads/${Cover_photo}`}
      
        alt="Background" 
        className={styles.backgroundImage}
      />
       
  
    ) : (
   
         <img src="/images/6462-landscape-depth_of_field-grass-blurred-nature-trees-colorful-simple_background.jpg" alt="Background" className={styles.backgroundImage} />
  
   
      
    )}
        <div className={styles.profileInfo}>
         {
            photo ?(
                <img   src={`http://localhost/hugot/api/uploads/${photo}`} alt="Profile" className={styles.profileImages} />
            ):(
                <img 
                src="/images/OIP (3).jpg" 
                className={styles.profileImages} 
                alt="Default Profile" 
              />
            )
         }
           <h1 className={styles.name}>{name}</h1>
          
        </div>
      </div>
   
      <div className={styles.mainContent}>
        
          <div className={styles.contactInfo}>
            <h4>Credentials</h4>
            <p style={{fontSize:'40',marginTop:'20px'}}><Icon.GeoAltFill size={25}/> {address}</p>
            <p style={{fontSize:'40'}}><Icon.GenderAmbiguous size={25}/> {gender} </p>
           
          </div>
      <div className={styles.container}>

      <button onClick={toggleDropdown} className={styles.filtersButton} >
        <Icon.Sliders/>
        </button>

      {isOpen && (
        <div className={styles.dropdown}>
          {/* Add your dropdown content here */}
         <label> Filter What type of hugot</label><br/>
          <select value={filterdata} onChange={(e)=>setFilderData(e.target.value)} className={styles.filterSelect}>
          <option value={""}>All</option>
          <option value={"love"}>Love</option>
          <option value={"work"}>Work</option>
          <option value={"life"}>Life</option>
          </select>
        </div>
      )}
      <div className={styles.cardContainer}>
     
            ` {user_postdata.map((content, index) => (
                <Card key={index} className={styles.card}>
                <Card.Body>
                    <div className={styles.header}>
                    <Row>
                        <Col>
                        <div>
                        <div className={styles.profileContainer}>
                            
                            {
                                content.Profile_photo ?(
                                <img
                                src={`http://localhost/hugot/api/uploads/${content.Profile_photo}`}
                                className={styles.profileImage}
                                alt="Profile Photo"
                                />
                                ):(
                                <img 
                                src="/images/OIP (3).jpg" 
                                className={styles.profileImage} 
                                alt="Default Profile" 
                                />
                                )
                            }
                        
                            <span className={styles.fullname}>{content.fullname}</span>
                            </div>

                            <small className={styles.timestamp}>{content.type}</small>
                        </div>
                        </Col>
                        <Col className='text-end' style={{fontSize: '0.8em', marginLeft: '150px'}}>
                        <Row>
                            <Col>
                            <small>{formatDistanceToNow(new Date(content.created_at), { addSuffix: true })}</small>
                            </Col>
                            <Col>
                            {savedPosts.has(content.hugot_id) ? (
                                        <Dropdown align="end">
                                        <Dropdown.Toggle variant="link" id="dropdown-custom-components">
                                            <i className="bi bi-three-dots-vertical"></i>
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu>
                                        
                                            <Dropdown.Item onClick={() => unsave_post(content.hugot_id)}>Unsave post</Dropdown.Item>
                                        </Dropdown.Menu>
                                        </Dropdown>
                                    ) : (
                                        <Dropdown align="end">
                                        <Dropdown.Toggle variant="link" id="dropdown-custom-components">
                                            <i className="bi bi-three-dots-vertical"></i>
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu>
                                        
                                            <Dropdown.Item onClick={() => saved_post(content.hugot_id)}>Save post</Dropdown.Item>
                                        </Dropdown.Menu>
                                        </Dropdown>
                                    )}
                                    
                            </Col>
                        </Row>
                        </Col>
                    </Row>
                    </div>

                    {/* Displaying the main content image */}
                    {content.photo && <img src={`http://localhost/hugot/api/uploads/${content.photo}`} className={styles.contentImage} />}

                    <Card.Text className={styles.content}>{content.content}</Card.Text>
                    
                    <div className={styles.actionButtons}>
                    <button
                        className={styles.actionButton}
                        onClick={() => handleLike(content.hugot_id)}
                    >
                        <span>{content.COUNT_LIKES}</span> {likedPosts.has(content.hugot_id) ? '❤️' : '🤍'} Heart
                    </button>

                    <button
                        className={styles.actionButton}
                        type='submit'
                        onClick={() => comments_modal(content.hugot_id)}
                    >
                        <span>{content.COUNT_COMMENTS}</span>💬 See Comments
                    </button>
                    <div className={styles.starRating}>
                    <span style={{marginTop:'5px'}}>
                    {content.RATING_PERCENTAGE}%
                    </span>
                {[...Array(5)].map((star, i) => {
                  const ratingValue = i + 1;
                  return (
                    <FaStar
                      key={i}
                      className={styles.star}
                      size={20}
                      color={
                        ratingValue <= (hoverRating[content.hugot_id] || content.rating)
                          ? "#ffc107"
                          : "#e4e5e9"
                      }
                      onClick={() => handleRating(content.hugot_id, ratingValue)}
                      onMouseEnter={() => setHoverRating((prev) => ({ ...prev, [content.hugot_id]: ratingValue }))}
                      onMouseLeave={() => setHoverRating((prev) => ({ ...prev, [content.hugot_id]: null }))}
                      style={{marginBottom:'5px',cursor:'pointer'}}
                    />
                  );
                })}
              
              </div>
                    </div>

                    <div className={styles.commentInputContainer}>
                    <input
                        type="text"
                        value={comments[content.hugot_id] || ''}
                        onChange={(e) => setComments(prev => ({ ...prev, [content.hugot_id]: e.target.value }))}
                        placeholder={`Comment as ${name}`}
                        className={styles.commentInput}
                    />
                    <button className={styles.sendButton} onClick={() => comment(content.hugot_id)}>Send</button>
                    </div>
                </Card.Body>
                </Card>
            ))}
            </div>`
      </div>
    </div>
    </div>


          {/* Modal for comments */}
          <Modal
        show={modalComments}
        onHide={() => {
          setModalComments(false);
          setReplyIndex(null); // Reset reply index to hide the input field
          setReplyText(''); // Optionally reset the reply text
        }}
        backdrop='static'
     
      >
        <Modal.Header closeButton className='text-black'>
          <center>Post of: {commentPost.fullname}</center>
        </Modal.Header>
        <Modal.Body>
          <div className={styles.cardContainer}>
            <Card className={styles.card}>
              <Card.Body>
                <div className={styles.header}>
                  <div>
                  <div className={styles.profileContainer}>
                   {
                    commentPost.Profile_photo ?(
                      <img
                      src={`http://localhost/hugot/api/uploads/${commentPost.Profile_photo}`}
                      className={styles.profileImage}
                      alt="Profile Photo"
                    />
                    ):(
                      <img 
                      src="/images/OIP (3).jpg" 
                      className={styles.profileImage} 
                      alt="Default Profile" 
                    />
                    )
                   }
                
                    <span className={styles.fullname}>{commentPost.fullname}</span>
                    
                  </div>
                    <small className={styles.timestamp}>{commentPost.type}</small>
                  </div>
                </div>
                {commentPost.photo && <img src={`http://localhost/hugot/api/uploads/${commentPost.photo}`} className={styles.previewImage} />}
                <Card.Text className={styles.content}>{commentPost.content}</Card.Text>
              </Card.Body>
              <div className={styles.actionButtons}>
                {/* Add action buttons for comment modal if needed */}
              </div>
            </Card>
          </div>
          <h5 style={{ marginTop: '30px' }}><strong>Comments:</strong></h5>
                    {commentList.map((comment, index) => (
            <div className={styles.commentContainer} key={index}>
              <div className={styles.profileContainer}>
                {comment.photo ? (
                  <img
                    src={`http://localhost/hugot/api/uploads/${comment.photo}`}
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
                <span className={styles.fullname}>{comment.fullname}</span>
              </div>
              <p className={styles.commentText}>{comment.comment}</p>
              <div className={styles.commentFooter}>
           
           <small className={styles.timeAgo}>
             {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
           </small>
           <small className={styles.reply} onClick={() => handleReplyClick(index,comment.comment_id)}>
             reply
           </small>
           <small style={{marginLeft:'10px'}}>({comment.reply_count})</small>
         </div>
        
         {replyIndex === index && (
           <div className={styles.replyInputContainer}>
             <input 
               type="text" 
               value={replytext}
               onChange={(e)=>setReplyText(e.target.value)}
               placeholder="Write a reply..." 
               className={styles.replyInput}
             />
              <button  className={styles.sendButtons} onClick={()=>sendreply(comment.hugot_id,comment.comment_id)}>
               <Icon.SendX  size={20}/> {/* Send icon */}
             </button>
           </div>
         )}
         {
           replyIndex === index && (

             selectedCommentId === comment.comment_id && (
               <div className={styles.replyList}>
                 {replylist.map((reply, replyIndex) => (
                   <div className={styles.replyContainer} key={replyIndex}>
                     <div className={styles.profileContainer}>
                       {reply.replier_photo ? (
                         <img
                           src={`http://localhost/hugot/api/uploads/${reply.replier_photo}`}
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
                       <span className={styles.fullname}>{reply.replier_name}</span>
                     </div>
                     <p className={styles.commentText}>{reply.reply_content}</p>
                     <div className={styles.commentFooter}>
                       <small className={styles.timeAgo}>
                         {formatDistanceToNow(new Date(reply.created_at), { addSuffix: true })}
                       </small>
                     </div>
                   </div>
                 ))}
               </div>
             )
           )
         }
            </div>
          ))}

        </Modal.Body>
      </Modal>
    </>
  );
};

export default ProfilePage;
