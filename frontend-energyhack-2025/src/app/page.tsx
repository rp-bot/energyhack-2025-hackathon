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
			<div className="flex flex-col items-start justify-center text-black h-full mx-20 ">
				<div className="flex flex-col gap-8">
					<h1 className="text-3xl">Something Here</h1>
					<h2 className="text-xl">Something Else hereSomething Else hereSomething Else hereSomething Else hereSomething Else hereSomething Else hereSomething Else hereSomething Else hereSomething Else hereSomething Else hereSomething Else here</h2>
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
