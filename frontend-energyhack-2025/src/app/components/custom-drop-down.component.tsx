
"use client";
import { carObject } from "@/lib/cars";
import Image from "next/image";
import { useState } from "react";
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { FaCarSide } from "react-icons/fa6";
export function CustomDropDown ( {
	value,
	onChange,
}: {
	value: string | null;
	onChange: ( value: string ) => void;
} )
{
	const [ isOpen, setIsOpen ] = useState( false );

	const toggleDropdown = () => setIsOpen( ( prev ) => !prev );


	return (
		<>
			<div className="relative  mt-1">
				{/* Dropdown Trigger */ }
				<button
					type="button"
					onClick={ toggleDropdown }
					className="w-full flex justify-between items-center border rounded-md p-2 bg-white shadow-sm text-gray-700"
				>
					<div className="flex flex-row gap-2 items-center font-bold"><FaCarSide />{ value || <p className="font-normal">Select an EV</p> }</div>
					{ isOpen ? <FiChevronUp className="ml-2" /> : <FiChevronDown className="ml-2" /> }
				</button>

				{/* Dropdown Menu */ }
				{ isOpen && (
					<div className="absolute mt-2 w-full border bg-white shadow-md rounded-md z-10 max-h-[400px] overflow-y-auto">
						{ carObject.map( ( car, index ) =>
						{

							return (
								<div
									key={ index }
									onClick={ () =>
									{
										onChange( car.carName );
										setIsOpen( false );
									} }
									className="p-2 cursor-pointer hover:bg-gray-100 flex flex-row items-center justify-between h-20"
								>
									<Image src={ car.imageurl } alt="car image" width={ 400 } height={ 400 } className="w-1/4 h-auto" />
									<p>{ car.carName }</p>
								</div>
							);
						} ) }
					</div>
				) }
			</div>
		</>
	);
}
