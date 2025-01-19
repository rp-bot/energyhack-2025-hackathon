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
            const carNameWithoutSpace = sendUserSelectionResult.data.carModel.replace( /\s+/g, "" );

            // Make a GET request with query parameters
            const response = await fetch( `https://flask.prathamvadhulas.com/get_least_co2_emissions?lat=${ sendUserSelectionResult.data.latitude }&lon=${ sendUserSelectionResult.data.longitude }&car_name=${ carNameWithoutSpace }`, {
                method: 'GET',
            } );

            if ( !response.ok )
            {
                throw new Error( `HTTP error! Status: ${ response.status }` );
            }

            const data = await response.json(); // Parse the JSON response



            revalidatePath( '/' );

            return { success: true, result: data };
        } catch ( error )
        {
            console.error( 'Error while sending data to Flask server:', error );
        }
    } else
    {
        console.error( 'Validation failed:', sendUserSelectionResult.error );
    }


}