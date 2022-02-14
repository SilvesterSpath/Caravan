import {getAuth, updateProfile} from 'firebase/auth'
import {updateDoc, doc, collection, getDocs, query, where, orderBy, deleteDoc} from 'firebase/firestore'
import {useState, useEffect} from 'react'
import {db} from '../firebase.config'
import {useNavigate, Link} from 'react-router-dom'
import {toast} from 'react-toastify'
import arrowRight from '../assets/svg/keyboardArrowRightIcon.svg'
import homeIcon from '../assets/svg/homeIcon.svg'
import Spinner from '../components/Spinner'
import ListingItem from '../components/ListingItem'


function Profile() {
  const [loading, setLoading] = useState(true)
  const [listings, setListings] = useState(null)
  const navigate = useNavigate()
  const auth = getAuth()
  const [changeDetails, setChangeDetails] = useState(false)
  
  
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email
  })

  const {name, email} = formData

  useEffect(()=>{
    const fetchUserListings = async ()=>{
      const listingsRef = collection(db, 'listings')
      const q = query(listingsRef, where('userRef', '==', auth.currentUser.uid), orderBy('timestamp', 'desc'))

      const querySnap = await getDocs(q)
      const listings = []

      querySnap.forEach((i)=>{
        return listings.push({
          id: i.id,
          data: i.data()
        })
      })

      console.log(listings);
     
      setListings(listings)
      setLoading(false)
    }

    fetchUserListings()

  },[auth.currentUser.uid])
  
  const onLogout = ()=>{
    auth.signOut()
    navigate('/')
  }
  
  const onSubmit = async ()=>{
    try {
      if(auth.currentUser.displayName !== name){
        // Update display name in firebase
        await updateProfile(auth.currentUser, {
          displayName: name
        })

        // Update in firestore
        const userRef = doc(db, 'users', auth.currentUser.uid)
        await updateDoc(userRef, {
          name: name
        })

      }
    } catch (error) {
      toast.error('Could not update profile details')
    }
  }

  const onChange = (e)=>{
    setFormData((prev)=>({ ...prev, [e.target.id] : e.target.value     
      
    }))

  }

  if (loading){
    return <Spinner/>
  }

  return (        
      <div className="profile">
        <header className="profileHeader">
          <p className="pageHeader">My Profile</p>
          <button type='button' onClick={onLogout} className="logOut">Logout</button>
        </header>
        <main>
          <div className="profileDetailsHeader">
            <p className="profileDetailsText">Personal Details</p>
            <p className="changePersonalDetails" onClick={()=>{
              changeDetails && onSubmit()
              setChangeDetails((prev)=> !prev)
            }}>
              {changeDetails ? 'done' : 'change'}
            </p>
          </div>
          <div className="profileCard">
            <form >
              <input type="text" id="name" className={!changeDetails ? 'profileName' : 'profileNameActive'} disabled={!changeDetails ? true : false} value={name} onChange={onChange}/>
              <input type="text" id="email" className={!changeDetails ? 'profileEmail' : 'profileEmailActive'} disabled={!changeDetails ? true : false} value={email} onChange={onChange}/>
            </form>
          </div>
            <Link to='/create-listing' className='createListing'>
              <img src={homeIcon} alt="home" />
              <p>Sell or Rent your Camper</p>
              <img src={arrowRight} alt="arrow right" />
            </Link>

            {!loading && listings?.length > 0 && (
              <>
                <p className="listingText">Your Listings</p>
                <ul className='listingsList'>
                  {listings.map((i, idx)=>(
                    <listingItem/>
                  ))}
                </ul>
              </>
            )}
        </main>
      </div>    
  )
}

export default Profile
