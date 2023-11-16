import React from 'react'
import { useHistory } from "react-router-dom";
import "./header.css"
import { Button, Image } from 'semantic-ui-react';

function Header(props) {
  const history = useHistory();
  const { menuName } = props;

  const logout = () => {
    history.push("/");
  }
  return (
    <div>
      <div className='Header'>
        <div>
          <Button className='HeaderButton'><Image src="logo.png" alt="a" /></Button>
          <span className='HeaderRouter'>Home / {menuName}</span>
        </div>
        <div>
          <Button className='HeaderButton'>MyCart</Button>
          <Button onClick={logout} className='HeaderButton'>Logout</Button>
        </div>
      </div>
    </div>
  )
}

export default Header