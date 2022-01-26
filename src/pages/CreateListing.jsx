import {useState, useEffect, useRef} from 'react'
import {getAuth, onAuthStateChanged} from 'firebase/auth'
import {useNavigate} from 'react-router-dom'
import Spinner from '../components/Spinner'

function CreateListing() {
  const [geolocationEnabled, setGeolocationEnabled] = useState(false)
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

  const {type, name, bathrooms, bedrooms, trailer, furnished, address, offer, regularPrice, discountPrice, images, latitude, longitude} = formData

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

    // eslint-disable-next-line react-hooks/exhaustive-deps    
  }, [ isMounted ])

  const onSubmit = (e)=>{
    e.preventDefault()

  }

  const onMutate = (e)=>{

  }

  if(loading){
    return <Spinner/>
  }

  return <div className='profile'>
    <header>
      <p className="pageHeader">Create a listing</p>
    </header>
    <main>
      <form onSubmit={onSubmit}>
        <label className='formLabel'>Sell / Rent</label>
        <div className="formButtons">
          <button type='button' className={type === 'sale' ? 'formButtonActive': 'formButton'}
          id='type'
          value='sale'
          onClick={onMutate}
          >
            Sell
          </button>
          <button type='button' className={type === 'rent' ? 'formButtonActive': 'formButton'}
          id='type'
          value='rent'
          onClick={onMutate}
          >
            Rent
          </button>
        </div>
        <label className='formLabel'>Name</label>
        <input className='formInputName' type="text" id='name' value={name} onChange={onMutate} maxLength='32' minLength='10' required/>

        <div className="formRooms flex">
          <div>
            <label className='formLabel'>Bedrooms</label>
            <input type="number" className='formInputSmall' id='bedrooms' value={bedrooms} onChange={onMutate} min='1' max='50' required />            
          </div>
          <div>
          <label className='formLabel'>Bathrooms</label>
            <input type="number" className='formInputSmall' id='bathrooms' value={bathrooms} onChange={onMutate} min='1' max='50' required />
          </div>
        </div>
        <label className='formLabel'>Trailer</label>
        <div className="formButtons">
          <button className={trailer ? 'formButtonActive': 'formButton'} type='button' id='trailer' value={trailer} onClick={onMutate} >Yes</button>
          <button className={!trailer ? 'formButtonActive': 'formButton'} type='button' id='trailer' value={trailer} onClick={onMutate} >No</button>
        </div>
        <label className='formLabel'>Furnished</label>
        <div className="formButtons">
          <button className={furnished ? 'formButtonActive': 'formButton'} type='button' id='furnished' value={furnished} onClick={onMutate} >Yes</button>
          <button className={!furnished ? 'formButtonActive': 'formButton'} type='button' id='furnished' value={furnished} onClick={onMutate} >No</button>
        </div>

        <label className='formLabel'>Address</label>
        <textarea className="formInputAddress" type='text' id="address" value={address} onChange={onMutate} required />

        {!geolocationEnabled && (
          <div className="formLatLng flex">
            <div>
              <label className='formLabel'>Latitude</label>
              <input type="number" className='formInputSmall' id='latitude' value={latitude} onChange={onMutate} required />
            </div>
            <div>
              <label className='formLabel'>Longitude</label>
              <input type="number" className='formInputSmall' id='longitude' value={longitude} onChange={onMutate} required />
            </div>
          </div>
        )}

        
        
      </form>
    </main>
    
  </div>;
}

export default CreateListing;
