'use client';

import { useState } from 'react';
import { LoadScript, Autocomplete } from '@react-google-maps/api';
import { IoLocationSharp } from "react-icons/io5";
interface Location
{
	latitude: number | null;
	longitude: number | null;
}


interface AutocompleteProps
{
	onLocationChange: ( location: Location ) => void;
}

export default function MapsAutoComplete ( { onLocationChange }: AutocompleteProps )
{

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
				const newLocation = { latitude: lat, longitude: lng };

				onLocationChange( newLocation ); // Notify the parent of the new location
			} else
			{
				alert( 'No location found for this place.' );
			}
		}
	};


	return (
		<div className="">
			<LoadScript googleMapsApiKey={ process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '' } libraries={ [ 'places' ] }>
				<div className="flex flex-row items-center gap-2 font-bold text-gray-600">
					<IoLocationSharp />
					<Autocomplete onLoad={ onLoad } onPlaceChanged={ onPlaceChanged }>

						<input
							type="text"
							placeholder="Search for a location"
							className="focus:outline-none text-xl placeholder:text-xl "
						/>
					</Autocomplete>
				</div>


			</LoadScript>
		</div>
	);
}
