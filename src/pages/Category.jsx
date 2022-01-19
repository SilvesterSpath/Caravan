import {useEffect, useState} from 'react'
import {useParams} from 'react-router-dom'
import {collection, getDocs, query, where, orderBy, limit, startAfter} from 'firebase/firestore'
import {db} from '../firebase.config'
import {toast} from 'react-toastify'
import Spinner from '../components/Spinner'

function Category() {
  const [listings, setListings] = useState(null)
  const [loading, setLoading] = useState(true)

  const params = useParams()
    
  useEffect(()=>{
    const fetchListings = async ()=>{
      try {
        // Get reference
        const listingsRef = collection(db, 'listings')
        console.log('listingsRef', listingsRef);
        
        // Create a query
        const q = query(listingsRef, where('tpye', '==', params.categoryName), orderBy('timestamp', 'desc'), limit(10))
        console.log('q', q);

        // Execute query
        const querySnap = await getDocs(q)
        console.log('querySnap:', querySnap);


        let listings = []

        querySnap.forEach((i)=>{
          console.log(i);

        })
      } catch (error) {
        
      }
    }

    fetchListings()

  })


  return (
    <div>
      Category
    </div>
  )
}

export default Category
