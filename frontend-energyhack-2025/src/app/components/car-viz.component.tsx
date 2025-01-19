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
	const now = new Date();
	if ( !resultingData )
	{
		return <h1 className="font-semibold text-center">Your EV</h1>;
	}

	const { car_name, state, least_co2_emissions, least_co2_range } = resultingData;
	const car = carObject.find( ( car: { carNameID: string; } ) => car.carNameID === car_name );
	// Calculate start and end times
	const startTime = new Date( now.getTime() + least_co2_range[ 0 ] * 60 * 60 * 1000 ); // Add least_co2_range[0] hours
	const endTime = new Date( startTime.getTime() + 10 * 60 * 60 * 1000 ); // Add 10 hours to startTime

	// Format the times as a readable string
	const formatTime = ( date: Date ) => date.toLocaleTimeString( [], { hour: '2-digit', minute: '2-digit' } );

	return (
		<>
			<div>


				{ car && (
					<div className="flex flex-row items-center justify-between bg-zinc-50 px-4 rounded-md">
						<div className="flex flex-col justify-center items-start w-full gap-2" >
							<h2 className="text-2xl font-semibold font-mono">{ car.carName }</h2>
							<h2 className="text-xl font-mono ">{ car.batteryCapacity[ 0 ] } </h2>
							<div className="flex flex-row items-start justify-center gap-2">

								<h2 className="text-sm font-mono ">{ car.range.base } </h2>

								<h2 className="text-sm font-mono ">{ car.power.base } </h2>
							</div>

						</div>

						<div className=" w-1/2  text-center ">
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
				<div className="grid grid-cols-2 bg-zinc-100 p-4">
					<p className="text-lg  self-center justify-self-start ">
						Today: <strong className="text-green-600 text-2xl font-mono">{ least_co2_emissions.toExponential( 2 ) } <span className="font-semibold text-lg">MMT Of CO2</span></strong>
					</p>
					<p className="text-lg  self-center justify-self-end">
						<strong className="text-blue-600 text-2xl">{ state }</strong>
					</p>
					<p className="text-lg">
						<strong className="">
							{ `Start Time: ${ formatTime( startTime ) }, End Time: ${ formatTime( endTime ) }` }
						</strong>
					</p>
				</div>

			</div>
		</>
	);
}
