"use client";

import { useState } from "react";
import { FormComponent } from "./components/form-component.component";
import { DataVisualization } from "./components/data-visualization.component";
import { CarViz } from "./components/car-viz.component";

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

export default function Page ()
{
	const [ resultingData, setResultingData ] = useState<EmissionsData | null>( null );

	return (
		<>
			<div className="flex flex-col items-start justify-center text-black h-full lg:mx-20 mx-2 ">
				<div className="flex flex-col gap-8 lg:w-1/2  w-full lg:text-start text-center">
					<h1 className="text-3xl font-bold">Green Time Charge</h1>
					<h2 className="text-xl">Eco-charge minimizes upstream <span className="bg-green-500 px-1 rounded-md py-[1px] text-white font-semibold">CO₂</span> emissions associated with EV charging by using historical energy MIX data and generation trends to recommend the most sustainable times to recharge your EV at your location.</h2>
				</div>
				<FormComponent setParentState={ setResultingData } />

				<div className="w-full grid md:grid-cols-2 grid-cols-1">
					<DataVisualization resultingData={ resultingData } />

					<CarViz resultingData={ resultingData } />
				</div>


			</div>
		</>
	);
}
