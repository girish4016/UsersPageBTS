import React from 'react'
import {Navbar} from './Navbar'
import {UserSection} from '../userSection/UserSection'

export const MainSection = () => {
  return (
    <div className='main-section'>
      <Navbar/>
      <div className='section-container'>
        <UserSection/>
      </div>
    </div>
  )
}
