"use client";
import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import axios from 'axios';
import { Form, Button, Modal, Card, Row, Col,Dropdown } from 'react-bootstrap';
import Styles from './page.module.css';
import { formatDistanceToNow } from 'date-fns';
import * as Icon from 'react-bootstrap-icons';
import { useRouter } from 'next/navigation';
import { FaStar } from "react-icons/fa"; // Import star icons
const Page = ({onLinkClick}) => {
  const [showModal, setShowModal] = useState(false);
  const [type, setType] = useState('');
  const [content, setContent] = useState('');
  const [contentList, setContentList] = useState([]);
  const [commentList, setCommentList] = useState([]);
  const [fullname, setFullname] = useState('');
  const [modalComments, setModalComments] = useState(false);
  const [commentPost, setCommentPost] = useState({});
  const [comments, setComments] = useState({}); 
  const [likedPosts, setLikedPosts] = useState(new Set()); // State to manage liked posts
  const [savedPosts, setSavedPosts] = useState(new Set()); // Track saved posts
  const [photo, setPhoto] = useState({ dataUrl: '', file: null });
  // const [rating, setRating] = useState({});
  const [hoverRating, setHoverRating] = useState({});
  const [replyIndex, setReplyIndex] = useState(null);
  const [replytext,setReplyText]= useState('');
  const [replylist,setReplyList]= useState([]);
  const [selectedCommentId, setSelectedCommentId] = useState('');
  const [filterdata,setFilderData]=useState('');  
  const [isOpen, setIsOpen] = useState(false);
  const router =useRouter();

  const handleLinkClick = (content) => {
    onLinkClick(content);
  
  };
  const handleReplyClick = (index,comment_id) => {
    fetch_reply(comment_id);
    setReplyIndex(replyIndex === index ? null : index);
  
  };
  const fetch_name = async () => {
    const url = 'http://localhost/hugot/api/user.php';
    const json = {
      user_id: sessionStorage.getItem("user_id")
    };
    const formdata = new FormData();
    formdata.append("json", JSON.stringify(json));
    formdata.append("operation", "fetch_fullname");
    const response = await axios.post(url, formdata);
    console.log(response.data);
    setFullname(response.data[0].fullname);
  };

  const post = async () => {
    if (!content || !type) {
      return alert("You need to fill and select the input field before posting");
    }
  
    const url = 'http://localhost/hugot/api/social.php';
    const json = {
      user_id: sessionStorage.getItem("user_id"),
      content: content,
      type: type,
    };
  
    const formdata = new FormData();
    formdata.append("json", JSON.stringify(json));
    formdata.append("photo", photo.file); // Append the photo file
    formdata.append("operation", "post");
  
    const response = await axios.post(url, formdata);
    console.log(response.data);
  
    if (response.data === 1) {
      alert("Post successfully created");
      fetch_post();
      setShowModal(false);
      setContent('');
      setPhoto('');
      setType('');
    } else {
      alert("Post not created");
    }
  };
  
  // Handle file input change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {

        setPhoto(reader.result);
        setPhoto({
          dataUrl: reader.result,
          file: file // Store the file object if needed for further processing
        });
      };
      reader.readAsDataURL(file);
      
    }
  };

  const handleRemovePhoto = () => {
    setPhoto('');
  };
  const fetch_post = async () => {
    const url = 'http://localhost/hugot/api/social.php';
    const json={
      user_id:sessionStorage.getItem("user_id"),
      filter_data:filterdata
    }
    console.log(filterdata)
    const formdata = new FormData();
    formdata.append("json",JSON.stringify(json));
    formdata.append("operation", "fetch_post");
    const response = await axios.post(url, formdata);
    console.log(response.data);
    setContentList(response.data);
  };

  const comments_modal = (hugot_id) => {
    setModalComments(true);
    fetchpost_byID(hugot_id);
    fetch_comments(hugot_id);
  };

  const fetchpost_byID = async (hugot_id) => {
    const url = 'http://localhost/hugot/api/social.php';
    const json = {
      hugot_id: hugot_id
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
      comment: comments[hugot_id] || '' // Use the specific comment for the post
    };
    const formdata = new FormData();
    formdata.append("json", JSON.stringify(json));
    formdata.append("operation", "comment");
    const response = await axios.post(url, formdata);
    console.log(response.data);
    fetch_post();
    setComments(prev => ({ ...prev, [hugot_id]: '' })); // Clear the comment for the post
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
    setLikedPosts(new Set(response.data.map(post => post.hugot_id))); // Update to use correct response structure
  };

  const handleLike = async (hugot_id) => {
    const isLiked = likedPosts.has(hugot_id);
    const url = 'http://localhost/hugot/api/social.php';
    const json = {
      hugot_id: hugot_id,
      user_id: sessionStorage.getItem("user_id"),
      like: !isLiked // Toggle like status
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
      fetch_post();
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
  
  const navigate_userprofile =(Profile_id)=>{
   sessionStorage.setItem("Profile_id",Profile_id);

   if(sessionStorage.getItem("user_id") == Profile_id){
   handleLinkClick('profile');
   }else{
    router.push('../Components/user_profilepage');
   }

  }
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
      fetch_post(); 
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
    fetch_comments(hugot_id);
   
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

 
  useEffect(() => {
    fetch_name();
    fetch_liked_posts();
    fetch_saved_posts();
}, []);

  useEffect(()=>{
    fetch_post();
  },[filterdata])
  return (
    <>
    
      <div style={styles.container}>
      <div className={Styles.inputContainer}>
        <input
          type="text"
          value={content}
          placeholder="What's on your mind?"
          className={Styles.input}
          readOnly
          onClick={() => setShowModal(true)}
        />
        <button onClick={toggleDropdown} className={Styles.filtersButton}>
          <Icon.Sliders />
        </button>
      </div>

      {isOpen && (
        <div className={Styles.dropdown}>
          <label>Filter What type of hugot</label>
          <select value={filterdata} onChange={(e) => setFilderData(e.target.value)} className={Styles.filterSelect}>
            <option value={""}>All</option>
            <option value={"love"}>Love</option>
            <option value={"work"}>Work</option>
            <option value={"life"}>Life</option>
          </select>
        </div>
      )}

      <div className={Styles.cardContainer}>
        {contentList.map((content, index) => (
          <Card key={index} className={Styles.card}>
            <Card.Body>
             
              <div className={Styles.header}>
              <Row>
                <Col>
                <div className={Styles.profileContainer} onClick={() => navigate_userprofile(content.Profile_id)}>
                  {content.Profile_photo ? (
                    <img
                      src={`http://localhost/hugot/api/uploads/${content.Profile_photo}`}
                      className={Styles.profileImage}
                      alt="Profile Photo"
                    />
                  ) : (
                    <img 
                      src="/images/OIP (3).jpg" 
                      className={Styles.profileImage} 
                      alt="Default Profile" 
                    />
                  )}
                  <span className={Styles.fullname} onClick={() => navigate_userprofile(content.Profile_id)}>{content.fullname}</span>
               <small className={Styles.responsive_time}>
                {formatDistanceToNow(new Date(content.created_at), new Date())}
              </small>
                </div>
                </Col>
                <div className={Styles.postInfo}>
                  <small className={Styles.timestamp}>{content.type}</small>
             
                </div>
              </Row>
        
               
                <Dropdown align="end" className={Styles.menuDropdown}>
                  <Dropdown.Toggle variant="link" id="dropdown-custom-components">
                    <Icon.ThreeDotsVertical />
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    {savedPosts.has(content.hugot_id) ? (
                      <Dropdown.Item onClick={() => unsave_post(content.hugot_id)}>Unsave post</Dropdown.Item>
                    ) : (
                      <Dropdown.Item onClick={() => saved_post(content.hugot_id)}>Save post</Dropdown.Item>
                    )}
                  </Dropdown.Menu>
                </Dropdown>
              </div>

              {content.photo && <img src={`http://localhost/hugot/api/uploads/${content.photo}`} className={Styles.contentImage} />}
              <Card.Text className={Styles.content}>{content.content}</Card.Text>
              
              <div className={Styles.actionButtons}>
                <button
                  className={Styles.actionButton}
                  onClick={() => handleLike(content.hugot_id)}
                >
                  <span>{content.COUNT_LIKES}</span> {likedPosts.has(content.hugot_id) ? '❤️' : '🤍'} Heart
                </button>
                <button
                  className={Styles.actionButton}
                  onClick={() => comments_modal(content.hugot_id)}
                >
                  <span>{content.COUNT_COMMENTS}</span>💬 Comments
                </button>

                <div className={Styles.starRating}>
                <span>{content.RATING_PERCENTAGE}%</span>
                {[...Array(5)].map((star, i) => {
                  const ratingValue = i + 1;
                  return (
                    <FaStar
                      key={i}
                      className={Styles.star}
                      size={20}
                      color={ratingValue <= (hoverRating[content.hugot_id] || content.rating) ? "#ffc107" : "#e4e5e9"}
                      onClick={() => handleRating(content.hugot_id, ratingValue)}
                      onMouseEnter={() => setHoverRating((prev) => ({ ...prev, [content.hugot_id]: ratingValue }))}
                      onMouseLeave={() => setHoverRating((prev) => ({ ...prev, [content.hugot_id]: null }))}
                    />
                  );
                })}
              </div>
              </div>

             

              <div className={Styles.commentInputContainer}>
                <input
                  type="text"
                  value={comments[content.hugot_id] || ''}
                  onChange={(e) => setComments(prev => ({ ...prev, [content.hugot_id]: e.target.value }))}
                  placeholder={`Comment as ${fullname}`}
                  className={Styles.commentInput}
                />
                <button className={Styles.sendButton} onClick={() => comment(content.hugot_id)}>
                  <Icon.Send />
                </button>
              </div>
            </Card.Body>
          </Card>
        ))}
      </div>
</div>

      {/* Create post modal */}
      <Modal
      show={showModal}
      onHide={() => setShowModal(false)}
      backdrop="static"
    >
      <Modal.Header closeButton className="text-black">
        <center>Create Hugot Post</center>
      </Modal.Header>
      <Modal.Body>
        Type
        <Form.Select value={type} onChange={(e) => setType(e.target.value)}  className={Styles.modalSelect}>
          <option value={""}>Select What type of hugot</option>
          <option value={"love"}>Love</option>
          <option value={"work"}>Work</option>
          <option value={"life"}>Life</option>
        </Form.Select>
        <textarea
          type="text"
          value={content}
          placeholder="What’s on your mind?"
          rows="4"
          cols="50"
          onChange={(e) => setContent(e.target.value)}
          className={Styles.modalTextarea }
        />
        <div className={Styles.fileInputContainer}>
        {!photo.file ? (
        <>
          <input
            type="file"
            id="file"
            accept="image/*" 
            onChange={handleFileChange}
            className={Styles.hiddenFileInput}
          />
         
        </>
      ) : (
        <div className={Styles.previewContainer}>
          <img
            src={photo.dataUrl}
            alt="Selected"
            className={Styles.previewImage}
          />
          <div className={Styles.previewActions}>
            <Button variant="secondary" onClick={handleRemovePhoto}>
              Remove
            </Button>
          </div>
        </div>
      )}
        </div>
        <Button type="submit" className={Styles.submitButton} onClick={post}>
          Post
        </Button>
      </Modal.Body>
    </Modal>

      {/* Modal for comments */}
      <Modal
        show={modalComments}
        onHide={() => {
          setModalComments(false);
          setReplyIndex(null); // Reset reply index to hide the input field
          setReplyText(''); // Optionally reset the reply text
        }}
        backdrop='static' 
         className={Styles.modal}
        
      >
        <Modal.Header closeButton className='text-black'>
          <center>Post of: {commentPost.fullname}</center>
        </Modal.Header>
        <Modal.Body className={Styles.modalBody}>
          <div className={Styles.cardContainer}>
            <Card className={Styles.card}>
              <Card.Body>
                <div className={Styles.header}>
                  <div>
                  <div className={Styles.profileContainer}>
                    {
                      commentPost.Profile_photo ?(
                        <img
                        src={`http://localhost/hugot/api/uploads/${commentPost.Profile_photo}`}
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
                
                    <span className={Styles.fullname} onClick={()=>navigate_userprofile(commentPost.Profile_id)} >{commentPost.fullname}</span>
                  </div>
                    <small className={Styles.timestamp}>{commentPost.type}</small>
                  </div>
                </div>
                {commentPost.photo && <img src={`http://localhost/hugot/api/uploads/${commentPost.photo}`} className={Styles.contentImage} />}
                <Card.Text className={Styles.content}>{commentPost.content}</Card.Text>
              </Card.Body>
              <div className={Styles.actionButtons}>
                {/* Add action buttons for comment modal if needed */}
              </div>
            </Card>
          </div>
          <h5 style={{ marginTop: '30px' }}><strong>Comments:</strong></h5>
          {commentList.map((comment, index) => (
        <div className={Styles.commentContainer} key={index}>
          <div className={Styles.profileContainer}>
            {comment.photo ? (
              <img
                src={`http://localhost/hugot/api/uploads/${comment.photo}`}
                className={Styles.profileImage}
                alt="Profile Photo"
              />
            ) : (
              <img 
                src="/images/OIP (3).jpg" 
                className={Styles.profileImage} 
                alt="Default Profile" 
              />
            )}
            <span className={Styles.fullname} onClick={()=>navigate_userprofile(comment.Profile_id)}>{comment.fullname}</span>
          </div>
          <p className={Styles.commentText}>{comment.comment}</p>
          <div >
           
            <small className={Styles.timeAgo}>
              {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
            </small>
            <small className={Styles.reply} onClick={() => handleReplyClick(index,comment.comment_id)}>
              reply
            </small>
            <small style={{marginLeft:'10px'}}>({comment.reply_count})</small>
          </div>
         
          {replyIndex === index && (
            <div className={Styles.replyInputContainer}>
              <input 
                type="text" 
                value={replytext}
                onChange={(e)=>setReplyText(e.target.value)}
                placeholder="Write a reply..." 
                className={Styles.replyInput}
              />
               <button  className={Styles.sendButtons} onClick={()=>sendreply(comment.hugot_id,comment.comment_id)}>
                <Icon.SendX  size={20}/> {/* Send icon */}
              </button>
            </div>
          )}
          {
            replyIndex === index && (

              selectedCommentId === comment.comment_id && (
                <div >
                  {replylist.map((reply, replyIndex) => (
                    <div className={Styles.replyContainer} key={replyIndex}>
                      <div className={Styles.profileContainer}>
                        {reply.replier_photo ? (
                          <img
                            src={`http://localhost/hugot/api/uploads/${reply.replier_photo}`}
                            className={Styles.profileImage}
                            alt="Profile Photo"
                          />
                        ) : (
                          <img 
                            src="/images/OIP (3).jpg" 
                            className={Styles.profileImage} 
                            alt="Default Profile" 
                          />
                        )}
                        <span className={Styles.fullname}>{reply.replier_name}</span>
                      </div>
                      <p className={Styles.commentText}>{reply.reply_content}</p>
                      <div className={Styles.commentFooter}>
                        <small className={Styles.timeAgo}>
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
const styles = {
  container: {
    padding: '20px',
    backgroundColor: '#f0f2f5',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '600px',
    margin: 'auto',
    marginTop: '60px',
    marginLeft: 'auto', // Center horizontally
    marginRight: 'auto', // Center horizontally

    // Responsive adjustments
    '@media (max-width: 768px)': {
      marginTop: '40px',
    },
    '@media (max-width: 480px)': {
      padding: '15px',
      marginTop: '20px',
    },
  },
  inputContainer: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '20px',
  },
  input: {
    flex: 1,
    padding: '10px',
    borderRadius: '20px',
    border: '1px solid #ccc',
    outline: 'none',
    width: '100%', // Make input take full width

    // Responsive adjustments
    '@media (max-width: 768px)': {
      padding: '8px',
    },
    '@media (max-width: 880px)': {
      padding: '6px',
    },
  },
};


export default Page;
