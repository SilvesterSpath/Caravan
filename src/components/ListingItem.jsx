import {Link} from 'react-router-dom';
import {ReactComponent as DeleteIcon} from '../assets/svg/deleteIcon.svg'
import {ReactComponent as EditIcon} from '../assets/svg/editIcon.svg'
import bedIcon from '../assets/svg/bedIcon1.svg'
import bathIcon from '../assets/svg/bathIcon1.svg'

function ListingItem({listing, id, onEdit, onDelete}) {
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
        <div className="categoryListingInfoDiv">
          <img src={bedIcon} alt="bed" />
          <p className="categoryListingInfoText">
            {listing.bed > 1 ? `${listing.bed} Bed`: '1 Bed'}
          </p>
          <img src={bathIcon} alt="bath" />
          <p className="categoryListingInfoText">
          {listing.bath > 1 ? `${listing.bath} Baths`: '1 Bath'}
          </p>
        </div>
      </div>
    </Link>
    
    {onDelete && (
      <DeleteIcon className='removeIcon' fill='rgb(231, 76, 60)' onClick={()=> onDelete(listing.id, listing.name)} />
    )}
    {onEdit && (
      <EditIcon className='editIcon' onClick={()=>onEdit(id)}/>
    )}
  </li>;
}

export default ListingItem;
