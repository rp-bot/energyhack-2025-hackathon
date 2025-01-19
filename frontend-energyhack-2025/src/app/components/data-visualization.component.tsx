"use client";
import
{
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	AreaChart,
	Area,
	Legend,
} from "recharts";
import { useState, useEffect } from "react";

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
}

interface ParentProps
{
	resultingData: EmissionsData | null;
}

export function DataVisualization ( { resultingData }: ParentProps )
{
	const [ chartWidth, setChartWidth ] = useState( 500 ); // Default width

	useEffect( () =>
	{
		// Function to update the chart width based on window size
		const updateWidth = () =>
		{
			const width = window.innerWidth;
			if ( width < 768 )
			{
				setChartWidth( width * 0.9 ); // Full width for small screens
			} else
			{
				setChartWidth( width * 0.4 ); // Half width for larger screens
			}
		};

		updateWidth(); // Set initial width
		window.addEventListener( "resize", updateWidth ); // Listen for resize events

		return () =>
		{
			window.removeEventListener( "resize", updateWidth ); // Clean up event listener
		};
	}, [] );

	if ( resultingData )
	{
		const formattedData = resultingData.mix.map( ( item, index ) => ( {
			index, // Use the index as a key
			sum: item.sum, // Extract the sum value
		} ) );
		const maxSum = Math.max( ...formattedData.map( ( data ) => data.sum ) );
		const minSum = Math.min( ...formattedData.map( ( data ) => data.sum ) );

		console.log( formattedData );
		const dynamicKey = JSON.stringify( resultingData.mix );
		return (
			<>
				<div className="">
					<AreaChart
						key={ `AreaChart-${ dynamicKey }` }
						width={ chartWidth }
						height={ 400 }
						data={ formattedData }
						className="bg-white bg-opacity-50 rounded-md"
						margin={ {
							top: 10,
							right: 30,
							left: 30,
							bottom: 20,
						} }
					>
						<CartesianGrid
							key={ `CartesianGrid-${ dynamicKey }` }
							strokeDasharray="3 3"
						/>
						<XAxis
							key={ `XAxis-${ dynamicKey }` }
							dataKey="index"
							label={ {
								value: "Time from Now (Hours)",
								position: "insideBottom",
								offset: -10,
							} }
						/>
						<YAxis
							key={ `YAxis-${ dynamicKey }` }
							domain={ [ minSum, maxSum ] }
							tickFormatter={ ( value ) => Number( value ).toExponential( 1 ) }
							label={ {
								value: "CO2 Emissions (Million Metric Tons)",
								angle: -90,
								position: "insideLeft",
								dy: 120,
								dx: -10,
							} }
						/>
						<Tooltip
							key={ `Tooltip-${ dynamicKey }` }
							formatter={ ( value ) => Number( value ).toExponential( 2 ) }
						/>
						<Legend key={ `Legend-${ dynamicKey }` } verticalAlign="top" height={ 36 } />
						<Area
							key={ `Area-${ dynamicKey }` }
							type="monotone"
							dataKey="sum"
							name="CO2 Emissions"
							stroke="#8884d8"
							fill="#8884d8"
						/>
					</AreaChart>
				</div>
			</>
		);
	} else
	{
		return (
			<div className="md:text-center lg:text-start">
				Currently Only Supports the Southern Company Services, Inc. (SOCO) region
			</div>
		);
	}
}
