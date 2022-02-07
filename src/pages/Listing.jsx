import {useState, useEffect} from 'react';
import {Link, useNavigate, useParams} from 'react-router-dom'
import {doc, getDoc} from 'firebase/firestore'
import {getAuth} from 'firebase/auth'
import {db} from '../firebase.config'
import Spinner from '../components/Spinner';
import shareIcon from '../assets/svg/shareIcon.svg'
import trailerIcon from '../assets/svg/trailerIcon.svg'



function Listing() {
  const [listing, setListing] = useState(null)
  const [loading, setLoading] = useState(true)
  const [shareLinkCopied, setShareLinkCopied] = useState(false)

  const navigate = useNavigate()
  const params = useParams()
  const auth = getAuth()

  useEffect(()=>{
    const fetchListing = async ()=>{
      const docRef = doc(db, 'listings', params.listingId)
      const docSnap = await getDoc(docRef)

      if(docSnap.exists()){
        
        setListing(docSnap.data())
        setLoading(false)
      }
    }
    fetchListing()
  }, [navigate, params.listingId])

  if(loading){
    return <Spinner/>
  }


  return <main>
    {/* Slider */}
    <div className="shareIconDiv" onClick={()=>{
      navigator.clipboard.writeText(window.location.href)      
      setShareLinkCopied(true)      
      setTimeout(()=>{
        setShareLinkCopied(false)
      }, 2000)
    }}>
      <img src={shareIcon} alt="share" />
    </div>
    {shareLinkCopied && <p className="linkCopied">Link copied!</p> }
    <div className="listingDetails">
      <p className="listingName">
        {listing.name} - ${listing.offer ? listing.discountPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : listing.regularPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
      </p>
      <p className="listingLocation">{listing.location}</p>
      <p className="listingType">For {listing.type === 'rent' ? 'Rent' : 'Sale'}</p>

      {listing.offer && (
        <p className="discountPrice">${listing.regularPrice - listing.discountPrice} discount</p>
      )}
      <ul className="listingDetailsList">
        <li>
          {listing.bed > 1 ? `${listing.bed} Beds` : '1 Bed'}
        </li>
        <li>
          {listing.bath > 1 ? `${listing.bath} Baths` : '1 Bath'}
        </li>
        <li>
          {listing.trailer && (  <pre><p>Version:  <img className='trailerIcon' src={trailerIcon} alt="trailer" /></p></pre>) }
        </li>
        <li>
          {listing.furnished && 'Furnished'}
        </li>
      </ul>
      <p className="listingLocationTitle">Location</p>

      {/* Map */}

      {auth.currentUser?.uid !== listing.userRef && (
        <Link to={`/contact/${listing.userRef}?listingName=${listing.name}`} className='primaryButton'>Contact Owner</Link>
      )}
    </div>
  </main>;
}

export default Listing;

