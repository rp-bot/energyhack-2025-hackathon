"use client";
import { XAxis, YAxis, CartesianGrid, Tooltip, AreaChart, Area, Legend } from "recharts";

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
	if ( resultingData )
	{
		const formattedData = resultingData.mix.map( ( item, index ) => ( {
			index,          // Use the index as a key
			sum: item.sum,  // Extract the sum value
		} ) );
		const maxSum = Math.max( ...formattedData.map( ( data ) => data.sum ) );
		const minSum = Math.min( ...formattedData.map( ( data ) => data.sum ) );

		// console.log( formattedData );
		return (
			<>

				<AreaChart
					width={ 500 }
					height={ 400 }
					data={ formattedData }
					margin={ {
						top: 10,
						right: 30,
						left: 30,
						bottom: 20,
					} }
				>
					<CartesianGrid strokeDasharray="3 3" />
					<XAxis
						dataKey="index"
						label={ {
							value: "Time from Now (Hours)",
							position: "insideBottom",
							offset: -10,

						} }
					/>
					<YAxis
						domain={ [ minSum, maxSum ] }
						tickFormatter={ ( value ) => Number( value ).toExponential( 1 ) }
						label={ {
							value: "CO2 Emissions (Million Metric Tons)",
							angle: -90,
							position: "insideLeft",
							dy: 120,
							dx: -10
						} }
					/>
					<Tooltip formatter={ ( value ) => Number( value ).toExponential( 2 ) } />
					<Legend verticalAlign="top" height={ 36 } />
					<Area type="monotone" dataKey="sum" name="CO2 Emissions" stroke="#8884d8" fill="#8884d8" />
				</AreaChart>

			</>
		);
	} else
	{
		return (
			<div>
				We only Support the south east region of the united states. Please choose a lcoation in the SOCO region.
			</div>
		);
	}

}
