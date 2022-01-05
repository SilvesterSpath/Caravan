import {getAuth} from 'firebase/auth'
import {useEffect, useState} from 'react'
import {useNavigate, Link} from 'react-router-dom'


function Profile() {
  const navigate = useNavigate()
  const auth = getAuth()
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email
  })

  const {name, email} = formData
  
  const onLogout = ()=>{
    auth.signOut()
    navigate('/')
  }
  



  return (        
      <div className="profile">
        <header className="profileHeader">
          <p className="pageHeader">My Profile</p>
          <button type='button' onClick={onLogout} className="logOut">Logout</button>
        </header>
      </div>    
  )
}

export default Profile
