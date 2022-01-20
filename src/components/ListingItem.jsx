import {Link} from 'react-router-dom';
import {ReactComponent as DeleteIcon} from '../assets/svg/deleteIcon.svg'
import bedIcon from '../assets/svg/bedIcon.svg'
import bathIcon from '../assets/svg/bathIcon.svg'

function ListingItem({listing, id}) {
  return <li className='categoryListing'>
    <Link to={`/category/${listing.type}/${id}`} className='categoryListingLink'>
      <img className='categoryListingImg' src={listing.imageUrls[0]} alt={listing.name} />
      <div className="categoryListingDetails">
        <p className="categoryListingLocation">
          {listing.location}
        </p>
        <p className="categoryListingName">{listing.name}</p>
        <p className="categoryListingPrice">{listing.offer ? `Offer: $${listing.discountPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}` : listing.regularPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}{listing.type === 'rent' && ' /Month'}</p>
        <p className="categoryListingPrice">Regular Price: ${listing.regularPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
        {listing.type === 'rent' && ' /Month'}</p>
      </div>
    </Link>
  </li>;
}

export default ListingItem;
