import {useState, useEffect, useRef} from 'react'
import {getAuth, onAuthStateChanged} from 'firebase/auth'
import {useNavigate} from 'react-router-dom'
import Spinner from '../components/Spinner'

function CreateListing() {
  const [geolocationEnabled, setGeolocationEnabled] = useState(true)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    type: 'rent',
    name: '',
    bedrooms: 1,
    bathrooms: 1,
    trailer: false,
    furnished: false,
    address: '',
    offer: false,
    regularPrice: 0,
    discountPrice: 0,
    images: [],
    latitude: 0,
    longitude: 0 
  })

  const auth = getAuth()
  const navigate = useNavigate()
  const isMounted = useRef(true)

  useEffect(()=>{
    if(isMounted){
      onAuthStateChanged(auth, (user)=>{
        if(user){
          setFormData(f=>({...formData, userRef: user.uid}))
        }else{
          navigate('sign-in')
        }
      })
    }
    return ()=>{
      isMounted.current = false
    }
    
  }, [isMounted, auth, navigate, formData])

  if(loading){
    return <Spinner/>
  }

  return <div>
    Create
  </div>;
}

export default CreateListing;