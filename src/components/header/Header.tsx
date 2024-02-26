import React from 'react'
import { AiFillMessage } from "react-icons/ai";
import { IoMdNotifications } from "react-icons/io";
import { FaUserCircle } from "react-icons/fa";
import { IoIosSearch } from "react-icons/io";



export const Header = () => {
  return (
    <div className='header'>
        <div className='logo'></div>
        <p className='greeting'>Good morning Jane!</p>
        <div className='search-area'>
          <i className='icon icon1'><IoIosSearch /></i>
          <input type="text" name="" id="" placeholder='Search' className='search-bar'/>
        </div>
        <i className='icon icon15'><AiFillMessage /></i>
        <i className='icon icon15'><IoMdNotifications /></i>
        <i className='icon icon15'><FaUserCircle /></i>

    </div>
  )
}
