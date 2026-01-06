import React from 'react'
import profile from '../images/avatar.png'

import './speaker.css'

function Speaker({speaker}) {
  return (
    <div className='container'>
        <div className='profile-card'>
            <img src={profile} alt="" />
            <h1>Dr ahmed . B</h1>
            <h3>Prof univresitaire</h3>
            <h4>Speciality: Bioinformatics</h4>
            <p className='speaker-def-pr'>this is a paragraph that explains the experience of thes perosn an it's like youtube description paragrph but for perosn </p>
        </div>

        
        <div className='innovations-section'>
        <h1>Innovations list</h1>
          <div className='innovations-cards'>
                <div className='innovation'>
                  <h1>Innovation 1 :</h1>
                  <h2>Evnet title : some data</h2>
                  <h2>Orginiser : some data</h2>
                  <h2>Date : some data</h2>
                  <h2>Location: some data</h2>
                  <button>accept</button>
                  <button>refuse</button>
              </div>


              <div className='innovation'>
                  <h1>Innovation 2 :</h1>
                  <h2>Evnet title : some data</h2>
                  <h2>Orginiser : some data</h2>
                  <h2>Date : some data</h2>
                  <h2>Location: some data</h2>
                  <button>accept</button>
                  <button>refuse</button>
              </div>
          </div>


          

        </div>


    </div>
  )
}

export default Speaker
