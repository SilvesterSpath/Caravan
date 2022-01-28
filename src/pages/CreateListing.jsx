import {useState, useEffect, useRef} from 'react'
import {getAuth, onAuthStateChanged} from 'firebase/auth'
import {getStorage, ref, uploadBytesResumable, getDownloadURL} from 'firebase/storage'
import {db} from '../firebase.config'
import {addDoc, collection, doc, serverTimestamp} from 'firebase/firestore'
import {useNavigate} from 'react-router-dom'
import Spinner from '../components/Spinner'
import {toast} from 'react-toastify'
import {v4 as uuidv4} from 'uuid'

function CreateListing() {
  const [geolocationEnabled, setGeolocationEnabled] = useState(true)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    type: 'rent',
    name: '',
    bed: 1,
    bath: 1,
    trailer: false,
    furnished: false,
    address: '',
    offer: false,
    regularPrice: 0,
    discountPrice: 0,
    images: {},
    latitude: 0,
    longitude: 0 
  })

  const {type, name, bath, bed, trailer, furnished, address, offer, regularPrice, discountPrice, images, latitude, longitude} = formData

  const auth = getAuth()
  const navigate = useNavigate()
  const isMounted = useRef(true)

  useEffect(()=>{
    if(isMounted){
      onAuthStateChanged(auth, (user)=>{
        if(user){
          setFormData(f=>({...formData, userRef: user.uid}))
        }else{
          navigate('/sign-in')
        }
      })
    }
    return ()=>{
      isMounted.current = false
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps    
  }, [ isMounted ])

  const onSubmit = async (e)=>{
    e.preventDefault()

    setLoading(true)

    if(discountPrice >= regularPrice){
      setLoading(false)
      toast.error('Discounted price needs to be less than regular price')
      return
    }

    if(images.length > 6){
      setLoading(false)
      toast.error('Max 6 images')
      return
    }

    let geolocation = {}
    let location

    if (geolocationEnabled){
      const response = await fetch(`https://api.geoapify.com/v1/geocode/search?text=${address}&apiKey=${process.env.REACT_APP_GEOCODE_API_KEY}`)

      const data = await response.json()

      console.log(data.query.text);
      geolocation.lat = data.features[0]?.geometry.coordinates[1] ?? 0
      geolocation.lng = data.features[0]?.geometry.coordinates[0] ?? 0
      location = data.features[0]?.properties.formatted ?? ''
      console.log(geolocation.lat, geolocation.lng, location);

      if (location === ''){
        setLoading(false)
        toast.error('Please enter a corrent address')
        return
      }
  
      
    } else {
      geolocation.lat = latitude
      geolocation.lng = longitude      
    }

    // Store images in firebase
    const storeImage = async (image)=>{
      return new Promise((resolve, reject)=>{
        const storage = getStorage()
        console.log('currentUser: ', auth.currentUser);
        const fileName = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`

        const storageRef = ref(storage, 'images/' + fileName)

        const uploadTask = uploadBytesResumable(storageRef, image)

        uploadTask.on('state_changed', (snapshot) => {

    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    console.log('Upload is ' + progress + '% done');
    toast.success('Upload is ' + progress + '% done')
    switch (snapshot.state) {
      case 'paused':
        console.log('Upload is paused');
        break;
      case 'running':
        console.log('Upload is running');        
        break;
      default:
    }
  }, 
  (error) => {
    // Handle unsuccessful uploads
    reject(error)
  }, 
  () => {
    // Handle successful uploads on complete
    // For instance, get the download URL: https://firebasestorage.googleapis.com/...
    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
      resolve(downloadURL);
    });
  }
);
      })
    }

    const imageUrls = await Promise.all(
      [...images].map((i)=>storeImage(i))
    ).catch(()=>{
      setLoading(false)
      toast.error('Images not uploaded')
      return
    })

    const formDataCopy = {
      ...formData, 
      imageUrls,
      geolocation,
      timeStamp: serverTimestamp(),      
    }

    formDataCopy.location = address
    delete formDataCopy.images
    delete formDataCopy.address
    delete formDataCopy.latitude
    delete formDataCopy.longitude

    location && (formDataCopy.location = location)
    !formDataCopy.offer && delete formDataCopy.discountPrice

    const docRef = await addDoc(collection(db, 'listings'), formDataCopy)        
    setLoading(false)
    toast.success('Listings saved')
    navigate(`/category/${formDataCopy.type}/${docRef.id}`)
  }

  const onMutate = (e)=>{
    let boolean = null

    if(e.target.value === 'true'){
      boolean = true
    }
    if(e.target.value === 'false'){
      boolean = false
    }

    // Files
    if(e.target.files){
      console.log('files:', e.target.files);
      setFormData((prev)=>({
        ...prev, 
        images: e.target.files
      }))
    }
    // Text/Booleans/Numbers
    if(!e.target.files){
      setFormData((prev)=>({
        ...prev,
        [e.target.id]: boolean ?? e.target.value
      }))
    }
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
            <label className='formLabel'>Beds</label>
            <input type="number" className='formInputSmall' id='bed' value={bed} onChange={onMutate} min='1' max='50' required />            
          </div>
          <div>
          <label className='formLabel'>Baths</label>
            <input type="number" className='formInputSmall' id='bath' value={bath} onChange={onMutate} min='1' max='50' required />
          </div>
        </div>
        <label className='formLabel'>Trailer</label>
        <div className="formButtons">
          <button className={trailer ? 'formButtonActive': 'formButton'} type='button' id='trailer' value={true} onClick={onMutate} >Yes</button>
          <button className={!trailer && trailer !== null ? 'formButtonActive': 'formButton'} type='button' id='trailer' value={false} onClick={onMutate} >No</button>
        </div>
        <label className='formLabel'>Furnished</label>
        <div className="formButtons">
          <button className={furnished ? 'formButtonActive': 'formButton'} type='button' id='furnished' value={true} onClick={onMutate} >Yes</button>
          <button className={!furnished && furnished !== null ? 'formButtonActive': 'formButton'} type='button' id='furnished' value={false} onClick={onMutate} >No</button>
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

      <label className="formLabel">Offer</label>
      <div className="formButtons">
        <button className={offer ? 'formButtonActive' : 'formButton'} type='button' id='offer' value={true} onClick={onMutate}>Yes</button>
        <button className={!offer && offer !== null ? 'formButtonActive' : 'formButton'} type='button' id='offer' value={false} onClick={onMutate}>No</button>
      </div>
      <label className="formLabel">Regular Price</label>
      <div className="formPriceDiv">
        <input type="number" className='formInputSmall' id='regularPrice'  value={regularPrice} onChange={onMutate} min='50' max='75000000' required/>
        {formData.type === 'rent' && (
          <p className='formPriceText'>$ / Month</p>
        )}
      </div>
      {offer && (
        <>
          <label className="formLabel">Discounted Price</label>
          <input type="number" className="formInputSmall" id='discountPrice' value={discountPrice} onChange={onMutate} min='50' max='75000000' required/>
        </>
      )}

      <label className="formLabel">Images</label>
      <p className="imagesInfo">The first image will be the cover (max 6)</p>
      <input type="file" className="formInputFile" id='images' onChange={onMutate} max='6' accept='.jpg,.png,.jpeg'
       multiple required />
       <button className="primaryButton createListingButton" type='submit'>Create Listing</button>
      </form>
    </main>
    
  </div>;
}

export default CreateListing;
