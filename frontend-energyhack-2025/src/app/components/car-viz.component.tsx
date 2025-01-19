import Image from "next/image";
import { carObject } from "@/lib/cars";

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
	resultingData: EmissionsData | null;
}

export function CarViz ( { resultingData }: ParentProps )
{
	if ( !resultingData )
	{
		return <h1 className="text-center text-xl font-bold text-red-600">No Data Available</h1>;
	}

	const { car_name, state, least_co2_emissions, least_co2_range } = resultingData;
	const car = carObject.find( ( car: { carNameID: string; } ) => car.carNameID === car_name );

	return (
		<>
			<div>


				{ car && (
					<div className="flex flex-row items-center justify-between">
						<div><h2 className="text-2xl font-semibold mt-4">{ car.carName }</h2></div>

						<div className=" w-1/2  text-center">
							<Image
								src={ car.imageurl }
								alt={ car.carName }
								width={ 400 }
								height={ 400 }
								className="mx-auto w-full h-auto rounded-md"
							/>

						</div>
					</div>

				) }
				<p className="text-lg mb-2">
					State: <strong className="text-blue-600">{ state }</strong>
				</p>
				<p className="text-lg mb-2">
					Least CO2 Emissions: <strong className="text-green-600">{ least_co2_emissions } MMT</strong>
				</p>
				<p className="text-lg mb-4">
					Emission Range: <strong>{ least_co2_range[ 0 ] } - { least_co2_range[ 1 ] } kg</strong>
				</p>


			</div>
		</>
	);
}
