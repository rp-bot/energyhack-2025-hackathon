"use client";

import { z } from 'zod';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { carObjectSchema } from '@/lib/zodSchemas';
import MapsAutoComplete from './maps-auto-complete.component';
import { CustomDropDown } from './custom-drop-down.component';


type FormValues = z.infer<typeof carObjectSchema>;

export function FormComponent ()
{
	// const [ location, setLocation ] = useState<{ latitude: number | null; longitude: number | null; }>( { latitude: null, longitude: null } );
	const { control, setValue, handleSubmit, formState: { errors } } = useForm<FormValues>(
		{
			resolver: zodResolver( carObjectSchema ),
		} );



	const onSubmit: SubmitHandler<FormValues> = ( data ) =>
	{
		console.log( 'Form Data:', data );
	};

	const handleLocationChange = ( newLocation: { latitude: number | null; longitude: number | null; } ) =>
	{
		// setLocation( newLocation ); // Update the parent state whenever the child update
		if ( newLocation )
		{
			if ( newLocation.latitude !== null )
			{
				setValue( 'latitude', newLocation.latitude );
			}
			if ( newLocation.longitude !== null )
			{
				setValue( 'longitude', newLocation.longitude );
			}
		}

	};


	return (
		<>
			<form onSubmit={ handleSubmit( onSubmit ) } className="flex flex-row">
				<div >
					<label htmlFor="make" className="block text-sm font-medium text-gray-700">Make</label>
					<Controller
						name="carModel"
						control={ control }
						defaultValue=""
						render={ ( { field } ) => (
							<CustomDropDown value={ field.value } onChange={ field.onChange } />
						) }
					/>
					{ errors.carModel && <p className="text-red-600 text-sm">{ errors.carModel.message }</p> }
				</div>

				<div>
					<label htmlFor="latitude_longitude" className="block text-sm font-medium text-gray-700">Location</label>
					<div className="mt-1 block w-full border rounded-md p-2 focus:outline-none">
						<MapsAutoComplete onLocationChange={ handleLocationChange } />
					</div>
					{ errors.latitude && <p className="text-red-600 text-sm">{ errors.latitude.message }</p> }
					{ errors.longitude && <p className="text-red-600 text-sm">{ errors.longitude.message }</p> }
				</div>
				{/* Battery Capacity */ }
				

				<button type="submit" className='bg-green-500 text-white'>Submit</button>
			</form>
		</>
	);
}
