"use client";
import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import axios from 'axios';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useRouter } from 'next/navigation';
import * as Icon from 'react-bootstrap-icons';

const page = () => {
    const [data, setData] = useState({
        email: '',
        password: ''
    });
    const router = useRouter();

    const login = async () => {
        try {
            const url = 'http://localhost/hugot/api/user.php';
            const formdata = new FormData();
            formdata.append("json", JSON.stringify(data));
            formdata.append("operation", "login");
            const response = await axios.post(url, formdata);
            console.log(response.data);
            if (Object.keys(response.data).length > 0) {
                alert("Login successful");
                sessionStorage.setItem("user_id", response.data[0].user_id);
                console.log('Cashier ID stored in sessionStorage:', sessionStorage.getItem("user_id"));
                router.push('./Components/Main/');
            } else {
                alert("Invalid username or password");
            }
        } catch (error) {
            console.log("Error:", error);
        }
    };

    return (
        <div style={{ 
            display: 'flex', 
            height: '100vh', 
            justifyContent: 'center', 
            alignItems: 'center', 
            backgroundImage: 'url(/images/6462-landscape-depth_of_field-grass-blurred-nature-trees-colorful-simple_background.jpg)', 
            backgroundSize: 'cover', 
            backgroundPosition: 'center' 
        }}>
            <div className="container" style={{ 
                maxWidth: '900px', 
                background: 'transparent', 
                borderRadius: '10px', 
                boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.1)', 
                overflow: 'hidden' 
            }}>
                <Row>
                    <Col md={6} style={{ padding: '40px', backgroundColor: 'transparent', color: '#fff',  boxShadow:'0px 10px 20px rgba(0, 0, 0, 0.1)'}}>
                        <center><Icon.Wechat size={190} /></center> {/* Adjusted size */}
                    </Col>
                    <Col md={6} style={{ padding: '20px' }}> {/* Adjusted padding */}
                        <h3 style={{color:'white'}}>Login</h3>
                        <p style={{color:'white'}}>Welcome! Log in to post, view, and react to the most wonderful hugot lines. Join the conversation and let the feels flow!</p>
                        <Form>
                            <Form.Group controlId="formBasicUsername">
                                <Form.Label style={{color:'white'}}>User Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter Email"
                                    value={data.email}
                                    onChange={(e) => setData({ ...data, email: e.target.value })}
                                />
                            </Form.Group>

                            <Form.Group controlId="formBasicPassword" style={{ marginTop: '10px' }}> {/* Reduced margin */}
                                <Form.Label style={{color:'white'}}>Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Enter password"
                                    value={data.password}
                                    onChange={(e) => setData({ ...data, password: e.target.value })}
                                />
                            </Form.Group>

                            <Button variant="primary" type="button" onClick={login} style={{ width: '100%', marginTop: '15px' }}> {/* Reduced margin */}
                                LOGIN
                            </Button>
                        </Form>

                        <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'space-between' }}> {/* Reduced margin */}
                            <a href="./Components/register" style={{color:'white'}}>New User? <span style={{ color: 'white' }}>Signup</span></a>
                        </div>
                    </Col>
                </Row>
            </div>
        </div>
    );
}

export default page;
