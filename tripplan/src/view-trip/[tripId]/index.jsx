import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { db } from '../../service/firebaseConfig';
import InfoSection from "../components/InfoSection";
import Hotels from '../components/Hotels';
import PlaceToVisit from '../components/PlaceToVisit';
import './popper.css'
import QuotesSection from '../components/Quotes';
import ImageGallery from '../components/Quotimag';
function Viewtrip() {
    const { tripId } = useParams();
    const[trip,setTrip]=useState(null);
    const[loading,setLoading]=useState(true);
    useEffect(()=>{
       tripId&&GetTripData();
    },[tripId])
    const GetTripData = async () => { 
        const docRef = doc(db, 'AITrips', tripId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            console.log("Document", docSnap.data());
            setTrip(docSnap.data());
        }else{
            console.log("No such document found");
        }
    };
   return (
    <div className='background'> 
        <InfoSection trip={trip}/>
        <Hotels trip={trip}/>
        <QuotesSection/>
        <PlaceToVisit trip={trip}/>
        <ImageGallery/>
    </div>
  )
}
export default  Viewtrip
