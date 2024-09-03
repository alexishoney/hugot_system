"use client";
import React from 'react';
import axios from 'axios';
import { useState, useEffect,useRef  } from 'react';
import { Form, Button, Modal, Card, Row, Col, Dropdown } from 'react-bootstrap';
import { formatDistanceToNow } from 'date-fns';
import Styles from './page.module.css';
import * as Icon from 'react-bootstrap-icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaStar } from "react-icons/fa"; // Import star icons
const Profile_page = () => {
  const [showModal, setShowModal] = useState(false);
  const [type, setType] = useState('');
  const [content, setContent] = useState('');
  const [fetch_selfpost, setFetch_selfpost] = useState([]);
  const [modalComments, setModalComments] = useState(false);
  const [fullname, setFullname] = useState('');
  const [commentPost, setCommentPost] = useState({});
  const [comments, setComments] = useState({});
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [commentList, setCommentList] = useState([]);
  const [showEditmodal,setShowEditmodal]= useState(false)
  const [isPhotoRemoved, setIsPhotoRemoved] = useState(false);
  const [Profile_photos,setProfile_Photo]=useState({ dataUrl: '', file: null });
  const [cover_photos,setCover_photos]=useState({ dataUrl: '', file: null });
const[Profile_name,setProfile_Name]= useState('');
const[address,setAddress]= useState('');
const[gender,setGender]= useState('');
const[birth_date,setbirth_date]= useState('');
  // const [rating, setRating] = useState({});
  const [hoverRating, setHoverRating] = useState({});
  const[editId,setEditId]=useState('');
  const[Edit_data,setEditData]= useState({
    content:'',
    type:''
  })
  const [savedPosts, setSavedPosts] = useState(new Set()); // Track saved posts
  const [photo, setPhoto] = useState({ dataUrl: '', file: null });
  const [Editphoto, setEditphoto] = useState({ dataUrl: '', file: null });
  const [replyIndex, setReplyIndex] = useState(null);
  const [replytext,setReplyText]= useState('');
  const [replylist,setReplyList]= useState([]);
  const [selectedCommentId, setSelectedCommentId] = useState('');
  const [filterdata,setFilderData]=useState('');  
  const [isOpen, setIsOpen] = useState(false);
  const fileInputRef = useRef(null);
  const fileInputRef2 = useRef(null);
  const handleReplyClick = (index,comment_id) => {
    fetch_reply(comment_id);
    setReplyIndex(replyIndex === index ? null : index);
  
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
    formdata.append("photo", photo.file); 
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
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto({
          dataUrl:reader.result,
          file:file
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setPhoto('');
  };

  const fetch_post = async () => {
    const url = 'http://localhost/hugot/api/profile.php';
    const json = {
      user_id: sessionStorage.getItem("user_id"),
      filter_data:filterdata
    };
    const formdata = new FormData();
    formdata.append("json", JSON.stringify(json));
    formdata.append("operation", "fetch_selfpost");
    const response = await axios.post(url, formdata);
    console.log(response.data);
    setFetch_selfpost(response.data);
  };
  const fetch_usersdata = async()=>{
    const url = "http://localhost/hugot/api/profile.php";
    const json={
      user_id:sessionStorage.getItem("user_id"),
   }
    const formdata= new FormData();
    formdata.append("json",JSON.stringify(json)); 
    formdata.append("operation","fetch_basic_data");
    const response= await axios.post(url,formdata);
    console.log(response.data);
    if (response.data && response.data.length > 0) {
      setProfile_Photo(response.data[0].PROFILE_PICTURE);
      setAddress(response.data[0].address);
      setProfile_Name(response.data[0].fullname);
      setGender(response.data[0].gender);
      setCover_photos(response.data[0].cover_photo)
     setbirth_date(response.data[0].birth_date);
  } else {
      console.error("No data found or data is undefined.");
    
  }
  
  
}

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
      comment: comments[hugot_id] || ''
    };
    const formdata = new FormData();
    formdata.append("json", JSON.stringify(json));
    formdata.append("operation", "comment");
    const response = await axios.post(url, formdata);
    console.log(response.data);
    fetch_post();
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
      fetch_post();
    } else {
      console.log("Failed to record like");
    }
  };

 
const editpost = (hugot_id) => {
    setShowEditmodal(true);
    fetchpostdata_byId(hugot_id);
  };
  const fetchpostdata_byId =async(hugot_id)=>{

    const url = 'http://localhost/hugot/api/profile.php';
    const json={
        hugot_id:hugot_id
    };
    const formdata= new FormData();
    formdata.append("json",JSON.stringify(json));
    formdata.append("operation","FetchPostdata_byId");
    const response= await axios.post(url,formdata);
    console.log(response.data);
    setEditData(response.data[0]);
    setEditId(response.data[0].hugot_id);
    setEditphoto({
      dataUrl: response.data[0].photo ? `http://localhost/hugot/api/uploads/${response.data[0].photo}` : '',
      file: null 
    });
    
  }
  const edit = async () => {
   const url = 'http://localhost/hugot/api/profile.php';
    const json = {
      hugot_id: editId,
      content: Edit_data.content,
      type: Edit_data.type
    };
  
    const formdata = new FormData();
    formdata.append("json", JSON.stringify(json));
     if (Editphoto.file) {
      formdata.append("photo", Editphoto.file);
    }
    formdata.append("operation", "edit");
  
    try {
      const response = await axios.post(url, formdata);
      if (response.data === 1) {
   
        if (isPhotoRemoved) {
          const json={
            hugot_id:editId
          }
          formdata.append("json",JSON.stringify(json));
          formdata.append("operation", "remove_photo");
          const removePhotoResponse = await axios.post(url,formdata);
  
          if (removePhotoResponse.data !== 1) {
            console.error("Failed to remove photo");
          }
        }
  
        fetch_post();
        setShowEditmodal(false);
        setIsPhotoRemoved(false);
      } else {
        console.error("Post not updated");
      }
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };
  const handleEditFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditphoto({
          dataUrl: reader.result,
          file: file
        });
      };
      reader.readAsDataURL(file);
    } else {
     
      setEditphoto({ dataUrl: '', file: null });
    }
  };
  const handleEditRemovePhoto = () => {
    setIsPhotoRemoved(true);
    setEditphoto({ dataUrl: '', file: null });
  };

  const handleDeletePost =async(hugot_id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this post?");
    if (!confirmDelete) {
      return;
    }
    const url = 'http://localhost/hugot/api/profile.php';
    const json={
        hugot_id:hugot_id
    };
    const formdata= new FormData();
    formdata.append("json",JSON.stringify(json));
    formdata.append("operation","delete");
    const response= await axios.post(url,formdata);
    console.log(response.data);
    if(response.data == 1){
        alert("post successfully deleted");
        fetch_post();
    }else{
        alert("post not deleted");
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
 

  const handleCameraClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Programmatically click the hidden file input
    }
  };

  const handleCameraClick2 = () => {
    if (fileInputRef2.current) {
      fileInputRef2.current.click(); // Programmatically click the hidden file input
    }
  };

  const handleFileChanges_profile = async(event) => {
    const file = event.target.files[0];
    if (file) {
        const url = 'http://localhost/hugot/api/profile.php';

        const json={
            user_id:sessionStorage.getItem("user_id")
        }
        const formdata= new FormData();
        formdata.append("json",JSON.stringify(json));
        formdata.append("photo",file);
        formdata.append("operation","change_profile");
        const response= await axios.post(url,formdata);
        console.log("change_status",response.data);
        if(response.data ==1){
            alert("profile change successfully");
            fetch_usersdata();
        }else{
            alert("profile change failed");
        }
        
    }
  };
  const handleFileChanges_cover = async(event) => {
    const file = event.target.files[0];
    if (file) {
        const url = 'http://localhost/hugot/api/profile.php';

        const json={
            user_id:sessionStorage.getItem("user_id")
        }
        const formdata= new FormData();
        formdata.append("json",JSON.stringify(json));
        formdata.append("photo",file);
        formdata.append("operation","change_cover");
        const response= await axios.post(url,formdata);
        console.log("change_status_cover",response.data);
        if(response.data ==1){
            alert("cover photo change successfully");
            fetch_usersdata();
        }else{
            alert("cover photo  change failed");
        }
        
    }
  };


  useEffect(() => {
    fetch_post();
    fetch_name();
    fetch_liked_posts();
    fetch_saved_posts();
    fetch_usersdata();
  }, [filterdata]);

  return (
    <>
  <div className={Styles.profilePage}>
      <div className={Styles.header}>
     
        {cover_photos ? (
      
        <img
          src={`http://localhost/hugot/api/uploads/${cover_photos}`}
        
          alt="Background" 
          className={Styles.backgroundImage}
        />
         
    
      ) : (
     
           <img src="/images/6462-landscape-depth_of_field-grass-blurred-nature-trees-colorful-simple_background.jpg" alt="Background" className={Styles.backgroundImage} />
    
     
        
      )}
        <div className={Styles.profileInfo}>
        {Profile_photos ? (
        <>
        <img
          src={`http://localhost/hugot/api/uploads/${Profile_photos}`}
          alt="Profile"
          className={Styles.profileImages}
        />
           <Icon.Camera  onClick={handleCameraClick} size={30} className={Styles.bi_camera_fill} style={{position:'absolute'}} />
        </>
      ) : (
      <>
        <img
          src="/images/OIP (3).jpg"
          className={Styles.profileImages}
          alt="Default Profile"
        />
         <Icon.Camera  onClick={handleCameraClick} size={30} className={Styles.bi_camera_fill} style={{marginTop:'30px',position:'absolute'}}/>
      </>
        
      )}

      {/* Camera Icon for uploading profile photo */}
   

      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }} // Hide the input element
        onChange={handleFileChanges_profile} // Handle file input change
        accept="image/*" // Restrict file type to images
      />

      <h1 className={Styles.name}>{Profile_name}</h1>
      
          
      <Col
      lg={{ span: 6 }}  // Set width and adjust for large screens
      md={{ span: 8 }}  // Set width and adjust for medium screens
   
      className={Styles.responsive_col}  // Custom class for additional styling
    >
      <button className={Styles.camera_cover}  onClick={handleCameraClick2}><Icon.Camera size={25} style={{marginBottom:'5px'}}/></button>
      <input
        type="file"
        ref={fileInputRef2}
        style={{ display: 'none' }} // Hide the input element
        onChange={handleFileChanges_cover} // Handle file input change
        accept="image/*" // Restrict file type to images
      />
    </Col>
    </div>
      </div>
   
      <div className={Styles.mainContent}>
        
          <div className={Styles.contactInfo}>
            <h4>Credentials</h4>
            <p style={{fontSize:'40',marginTop:'20px'}}><Icon.GeoAltFill size={25}/> {address}</p>
            <p style={{fontSize:'40'}}><Icon.GenderAmbiguous size={25}/> {gender} </p>
            <p style={{fontSize:'40'}}><Icon.Cake size={25}/> {birth_date} </p>
           
          </div>
      <div className={Styles.container}>

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
      <div className={Styles.cardContainer}>
     
      <div className={Styles.cardContainer}>
  {fetch_selfpost.map((content, index) => (
    <Card key={index} className={Styles.card}>
      <Card.Body>
        <div className={Styles.header}>
          <Row>
            <Col>
              <div>
              <div className={Styles.profileContainer}>
                
                   {
                    content.Profile_photo ?(
                      <img
                      src={`http://localhost/hugot/api/uploads/${content.Profile_photo}`}
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
              
                  <span className={Styles.fullname}>{content.fullname}</span>
                </div>

                <small className={Styles.timestamp}>{content.type}</small>
              </div>
            </Col>
            <Col className='text-end' style={{fontSize: '0.8em', marginLeft: '250px'}}>
              <Row>
                <Col>
                <small>{formatDistanceToNow(new Date(content.created_at), new Date())}</small>
                </Col>
                <Col >
                {savedPosts.has(content.hugot_id) ? (
                            <Dropdown align="end" >
                              <Dropdown.Toggle variant="link" id="dropdown-custom-components">
                                <i className="bi bi-three-dots-vertical"></i>
                              </Dropdown.Toggle>
                              <Dropdown.Menu>
                              <Dropdown.Item onClick={() => editpost(content.hugot_id)}>Edit Post</Dropdown.Item>
                              <Dropdown.Item onClick={() => handleDeletePost(content.hugot_id)}>Delete Post</Dropdown.Item>
                                <Dropdown.Item onClick={() => unsave_post(content.hugot_id)}>Unsave post</Dropdown.Item>
                              </Dropdown.Menu>
                            </Dropdown>
                          ) : (
                            <Dropdown align="end">
                              <Dropdown.Toggle variant="link" id="dropdown-custom-components">
                                <i className="bi bi-three-dots-vertical"></i>
                              </Dropdown.Toggle>
                              <Dropdown.Menu>
                              <Dropdown.Item onClick={() => editpost(content.hugot_id)}>Edit Post</Dropdown.Item>
                              <Dropdown.Item onClick={() => handleDeletePost(content.hugot_id)}>Delete Post</Dropdown.Item>
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
            type='submit'
            onClick={() => comments_modal(content.hugot_id)}
          >
            <span>{content.COUNT_COMMENTS}</span>💬 See Comments
          </button>
          <div className={Styles.starRating}>
                <span  style={{marginTop:'5px'}}>
                  {content.RATING_PERCENTAGE}%
                </span>
                {[...Array(5)].map((star, i) => {
                  const ratingValue = i + 1;
                  return (
                    <FaStar
                      key={i}
                      className={Styles.star}
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

        <div className={Styles.commentInputContainer}>
          <input
            type="text"
            value={comments[content.hugot_id] || ''}
            onChange={(e) => setComments(prev => ({ ...prev, [content.hugot_id]: e.target.value }))}
            placeholder={`Comment as ${fullname}`}
            className={Styles.commentInput}
          />
          <button className={Styles.sendButton} onClick={() => comment(content.hugot_id)}>Send</button>
        </div>
      </Card.Body>
    </Card>
  ))}
</div>

      </div>`
      </div>
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
        <Form.Select value={type} onChange={(e) => setType(e.target.value)}>
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
        />
        <div className={Styles.fileInputContainer}>
          {!photo.file ? (
           <>
             <input
               type="file"
               id="file"
               accept='image/*'
               onChange={handleFileChange}
               className={Styles.hiddenFileInput}
             />
             <label htmlFor="file" className={Styles.fileLabel}>
               <Icon.Camera className={Styles.photoIcon} /> Upload photo
             </label>
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



    <Modal
  show={showEditmodal}
  onHide={() => setShowEditmodal(false)}
  backdrop="static"
>
  <Modal.Header closeButton className="text-black">
    <center>Edit Hugot Post</center>
  </Modal.Header>
  <Modal.Body>
    <Form.Group>
      <Form.Label>Type</Form.Label>
      <Form.Select
        value={Edit_data.type}
        onChange={(e) => setEditData({ ...Edit_data, type: e.target.value })}
      >
        <option value="">Select What type of hugot</option>
        <option value="love">Love</option>
        <option value="work">Work</option>
        <option value="life">Life</option>
      </Form.Select>
    </Form.Group>

    <Form.Group>
      <Form.Label>What's on your mind?</Form.Label>
      <Form.Control
        as="textarea"
        value={Edit_data.content}
        placeholder="What’s on your mind?"
        rows={4}
        onChange={(e) => setEditData({ ...Edit_data, content: e.target.value })}
      />
    </Form.Group>

    <div className={Styles.fileInputContainer}>
      <Form.Group>
       
        <label htmlFor="file-upload" className={Styles.fileUploadLabel}>
          {Editphoto.dataUrl ? (
            <img src={Editphoto.dataUrl} alt="Preview" style={{ width: '50%', height: 'auto' }} />
          ) : (
            <Icon.FileImageFill size={40} /> 
          )}
        </label>
        <input
          id="file-upload"
          type="file"
          accept="image/*" 
          style={{ display: 'none' }}
          onChange={handleEditFileChange}
        />
        {Editphoto.dataUrl && (
          <Button onClick={handleEditRemovePhoto}>Remove</Button>
        )}
      </Form.Group>
    </div>

    <Button type="submit" className={Styles.submitButton} onClick={edit}>
      Save
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
     
      >
        <Modal.Header closeButton className='text-black'>
          <center>Post of: {commentPost.fullname}</center>
        </Modal.Header>
        <Modal.Body>
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
                
                    <span className={Styles.fullname}>{commentPost.fullname}</span>
                  </div>
                    <small className={Styles.timestamp}>{commentPost.type}</small>
                  </div>
                </div>
                {commentPost.photo && <img src={`http://localhost/hugot/api/uploads/${commentPost.photo}`} className={Styles.previewImage} />}
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
      <span className={Styles.fullname}>{comment.fullname}</span>
    </div>
    <p className={Styles.commentText}>{comment.comment}</p>
    <div className={Styles.commentFooter}>
           
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
                <div className={Styles.replyList}>
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
  )
}


export default Profile_page;
