"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { carObjectSchema } from "./zodSchemas";

type FormValues = z.infer<typeof carObjectSchema>;

export async function sendUserSelection ( carData: FormValues )
{
    const sendUserSelectionResult = carObjectSchema.safeParse( carData );

    if ( sendUserSelectionResult.success )
    {
        try
        {
            // Construct query parameters from carData
            console.log( sendUserSelectionResult.data.latitude );
            console.log( sendUserSelectionResult.data.longitude );
            const carNameWithoutSpace = sendUserSelectionResult.data.carModel.replace( /\s+/g, "" );
            // /get_hourly_rates?lat=34.052235&lon=-118.243683
            console.log( `https://flask.prathamvadhulas.com/get_hourly_rates?lat=${ sendUserSelectionResult.data.latitude }&lon=${ sendUserSelectionResult.data.longitude }&car_name=${ carNameWithoutSpace }` );
            // // Make a GET request with query parameters
            // const response = await fetch( `https://flask.prathamvadhulas.com/get_hourly_rates?${ queryParams }`, {
            //     method: 'GET',
            // } );

            // if ( !response.ok )
            // {
            //     throw new Error( `HTTP error! Status: ${ response.status }` );
            // }

            // const data = await response.json(); // Parse the JSON response

            // console.log( 'Response from Flask server:', data );

            // Optionally, revalidate a path or perform other operations
            revalidatePath( '/' );
        } catch ( error )
        {
            console.error( 'Error while sending data to Flask server:', error );
        }
    } else
    {
        console.error( 'Validation failed:', sendUserSelectionResult.error );
    }


}