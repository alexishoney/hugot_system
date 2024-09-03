"use client"
import React, { useState } from 'react';
import { Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from '../navbar/page';
import Sidebar from '../sidebar/page';
import Home from '../dashboard/page';
import Profile from '../profile/page';
import Savedpost from '../savedpost/page';
import Settings from '../settings/page';
import styles from './Page.module.css'; 

const Page = () => {
  const [content, setContent] = useState('home');

  const renderContent = () => {
    switch (content) {
      case 'home':
        return <Home onLinkClick={setContent} />;
      // case 'profile':
      //   return <Profile />;
      case 'savepost':
        return <Savedpost />;
      case 'settings': // Fixed case sensitivity here
        return <Settings />;
      default:
        return <Home onLinkClick={setContent} />;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <Navbar onLinkClick={setContent} />
      <div style={{ display: 'flex', flex: 1 }}>
        <Sidebar onLinkClick={setContent} />
        <Container className={styles.content}>
          {renderContent()}
        </Container>
      </div>
    </div>
  );
};

export default Page;
