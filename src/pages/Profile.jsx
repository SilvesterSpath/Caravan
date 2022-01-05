import {getAuth} from 'firebase/auth'
import {useEffect, useState} from 'react'

function Profile() {
  const [user, setUser] = useState(null)

  const auth = getAuth()

  useEffect(()=>{
    setUser(auth.currentUser)
    console.log(auth.currentUser);
  }, [])

  return (
    <div>
      <h1>Profile</h1>
      {user ? <h3>Welcome: {user.displayName}</h3> : 'Not Logged In'}
    </div>
  )
}

export default Profile
