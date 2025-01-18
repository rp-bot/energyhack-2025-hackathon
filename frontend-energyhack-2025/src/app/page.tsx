'use client';

import Image from 'next/image';
import { useState } from 'react';
import { FaCaretDown } from "react-icons/fa";
import { GoogleMap, LoadScript, Marker, Autocomplete } from '@react-google-maps/api';

import model_3 from "/public/Model 3.webp";

const containerStyle = {
  width: '100%',
  height: '500px',
};

const center = {
  lat: 37.7749, // Default latitude
  lng: -122.4194, // Default longitude
};


const carObject = [
  { model: "Model 3", make: "Tesla" },
  { model: "Mustang Mach-E", make: "Ford" },
  { model: "Ioniq 5", make: "Hyundai" },
  { model: "Prologue", make: "Honda" },
  { model: "F-150 Lightning", make: "Ford" }
];

export default function CustomDropdown ()
{
  const [ isOpen, setIsOpen ] = useState( false );
  const [ selectedCar, setSelectedCar ] = useState<string | null>( null );

  const [ location, setLocation ] = useState( center );
  const [ autocomplete, setAutocomplete ] = useState<google.maps.places.Autocomplete | null>( null );

  const onLoad = ( autoC: google.maps.places.Autocomplete ) => setAutocomplete( autoC );

  const onPlaceChanged = () =>
  {
    if ( autocomplete !== null )
    {
      const place = autocomplete.getPlace();
      if ( place.geometry && place.geometry.location )
      {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        setLocation( { lat, lng } );
      } else
      {
        alert( 'No location found for this place.' );
      }
    }
  };

  // Handle marker drag end to update the location
  const onMarkerDragEnd = ( event: google.maps.MapMouseEvent ) =>
  {
    if ( event.latLng )
    {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      setLocation( { lat, lng } );
    }
  };

  const toggleDropdown = () => setIsOpen( !isOpen );

  const selectCar = ( car: { make: string; model: string; } ) =>
  {
    setSelectedCar( `${ car.make } - ${ car.model }` );
    setIsOpen( false );
  };

  return (
    <div className="relative max-w-screen-md mx-auto mt-10">
      <button
        onClick={ toggleDropdown }
        className="w-full flex justify-between items-center px-4 py-3 border border-gray-300 rounded-md shadow-sm bg-white text-black hover:bg-gray-100 focus:outline-none"
      >
        { selectedCar || "Select a Car" }
        <FaCaretDown className={ `w-5 h-5 transition-transform ${ isOpen ? 'rotate-180' : '' }` } />
      </button>

      { isOpen && (
        <ul className="absolute z-10 mt-2 w-full bg-white border border-gray-300 rounded-md shadow-lg">
          { carObject.map( ( car, index ) => (
            <div
              key={ index }
              onClick={ () => selectCar( car ) }
              className='px-4 py-2 hover:bg-gray-100 cursor-pointer flex flex-row justify-between items-center'
            >
              <Image src={ model_3 } alt={ car.model } width={ 100 } height={ 100 } className='w-1/4 h-full' />
              <div
                className=" text-black w-full flex flex-col items-end justify-evenly"
              >
                <div>
                  { car.model }
                </div>
                <div>
                  { car.make }
                </div>
              </div>
            </div>
          ) ) }
        </ul>
      ) }

      { selectedCar && (
        <div className="mt-4 p-4 flex flex-col justify-center items-center bg-white">
          <Image src={ model_3 } alt={ "model" } width={ 100 } height={ 100 } className='w-1/4 h-full' />
          <p className="text-xl text-black font-bold ">{ selectedCar }</p>
        </div>
      ) }

      <div className="w-full bg-white text-black p-4">
        { process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY && (
          <LoadScript googleMapsApiKey={ process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY } libraries={ [ 'places' ] }>
            <div className="mb-4">
              <Autocomplete onLoad={ onLoad } onPlaceChanged={ onPlaceChanged }>
                <input
                  type="text"
                  placeholder="Search for a location"
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </Autocomplete>
            </div>

            <GoogleMap mapContainerStyle={ containerStyle } center={ location } zoom={ 12 }>
              <Marker
                position={ location }
                draggable={ true }
                onDragEnd={ onMarkerDragEnd } />
            </GoogleMap>

            <div className="mt-4 text-center">
              <p>Latitude: { location.lat }</p>
              <p>Longitude: { location.lng }</p>
            </div>
          </LoadScript>
        ) }

      </div>
    </div>
  );
}
