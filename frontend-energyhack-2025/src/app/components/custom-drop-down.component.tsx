
"use client";
import { carObject } from "@/lib/cars";
import { useState } from "react";
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

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
			<div className="relative w-64">
				{/* Dropdown Trigger */ }
				<button
					type="button"
					onClick={ toggleDropdown }
					className="w-full flex justify-between items-center border rounded-md p-2 bg-white shadow-sm text-gray-700"
				>
					{ value || "Select a car" }
					{ isOpen ? <FiChevronUp className="ml-2" /> : <FiChevronDown className="ml-2" /> }
				</button>

				{/* Dropdown Menu */ }
				{ isOpen && (
					<ul className="absolute mt-2 w-full border bg-white shadow-md rounded-md z-10 max-h-60 overflow-y-auto">
						{ carObject.map( ( car, index ) =>
						{
							const combinedItem = `${ car.carName }`;
							return (
								<li
									key={ index }
									onClick={ () =>
									{
										onChange( combinedItem );
										setIsOpen( false );
									} }
									className="p-2 cursor-pointer hover:bg-gray-100"
								>
									{ combinedItem }
								</li>
							);
						} ) }
					</ul>
				) }
			</div>
		</>
	);
}
