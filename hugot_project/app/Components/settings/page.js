import React from 'react';
import Styles from './page.module.css';
import * as Icon from 'react-bootstrap-icons';
import { useRouter } from 'next/navigation';
const Page = () => {

const router = useRouter();

const Account_profile =()=>{
    router.push('../Components/settings/Account_profile');
}
const Activitylogs =()=>{
    router.push('../Components/settings/activitylogs');
}

const  security_password=()=>{
    router.push('../Components/settings/password');
}
  return (
    <> 
      <div className={Styles.container} >
        <div className={Styles.card} onClick={Account_profile}>
          <div className={Styles.icon}>
          <Icon.PersonVcardFill size={100}/>
          </div>
          <div className={Styles.title}>Profile</div>
          <div className={Styles.description}>
          
          </div>
        </div>

        <div className={Styles.card} onClick={Activitylogs}>
          <div className={Styles.icon}>
          <Icon.ListCheck size={100}/>
          </div>
          <div className={Styles.title}>Activity log</div>
          <div className={Styles.description}>
      
          </div>
        </div>

        <div className={Styles.card} onClick={security_password}>
          <div className={Styles.icon}>
          <Icon.ShieldLock size={70}/>
          </div>
          <div className={Styles.title}>Change Username and Password</div>
          <div className={Styles.description}>
      
          </div>
        </div>
      </div>
    </>
  )
}

export default Page;
