"use client";

import { z } from 'zod';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { carObjectSchema } from '@/lib/zodSchemas';
import MapsAutoComplete from './maps-auto-complete.component';
import { CustomDropDown } from './custom-drop-down.component';
import { sendUserSelection } from '@/lib/actions';
import { useState } from 'react';
import { FaSpinner } from "react-icons/fa";

type FormValues = z.infer<typeof carObjectSchema>;

interface MixItem
{
	Coal: number;
	NaturalGas: number;
	sum: number;
}

interface EmissionsData
{
	least_co2_emissions: number;
	least_co2_range: [ number, number ]; // Tuple for the range
	mix: MixItem[]; // Array of MixItem objects
	state: string;
	car_name: string;
}

interface ParentProps
{

	setParentState: React.Dispatch<React.SetStateAction<EmissionsData | null>>;

}

export function FormComponent ( { setParentState }: ParentProps )
{
	// const [ location, setLocation ] = useState<{ latitude: number | null; longitude: number | null; }>( { latitude: null, longitude: null } );
	const [ loading, setLoading ] = useState( false );

	const { control, setValue, handleSubmit, formState: { errors } } = useForm<FormValues>(
		{
			resolver: zodResolver( carObjectSchema ),
		} );



	const onSubmit: SubmitHandler<FormValues> = async ( data ) =>
	{
		setLoading( true );
		const result = await sendUserSelection( data );
		setParentState( result?.result );
		setLoading( false );

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
			<form onSubmit={ handleSubmit( onSubmit ) } className="flex flex-col w-3/4 justify-between py-5 ">
				<div className='flex flex-row gap-2'>
					<div className='w-full py-5'>

						<Controller
							name="carModel"
							control={ control }
							defaultValue=""
							render={ ( { field } ) => (
								<CustomDropDown value={ field.value } onChange={ field.onChange } />
							) }
						/>

					</div>

					<div className='w-full py-5'>

						<div className="mt-1 block w-full border rounded-md p-2 focus:outline-none">
							<MapsAutoComplete onLocationChange={ handleLocationChange } />
						</div>

					</div>
					{/* Battery Capacity */ }

					<div className='py-5 w-full flex flex-col items-start justify-center'>
						<button type="submit" className='bg-green-500 text-white p-2 rounded mt-1'>{ loading ? <FaSpinner className='animate-spin h-full' /> : <p>Submit</p> }</button>
					</div>
				</div>
				{ errors.carModel && <p className="text-red-600 text-sm">{ errors.carModel.message }</p> }
				{ errors.latitude && <p className="text-red-600 text-sm">Error Finding your Location (try again)</p> }
				{ errors.longitude && <p className="text-red-600 text-sm">Error Finding your Location (try again)</p> }
			</form>
		</>
	);
}
