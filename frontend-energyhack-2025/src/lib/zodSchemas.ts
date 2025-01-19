import { z } from "zod";

export const carObjectSchema = z.object( {
    latitude: z.number().refine( ( val ) => !isNaN( val ), {
        message: 'Latitude must be a valid number',
    } ),
    longitude: z.number().refine( ( val ) => !isNaN( val ), {
        message: 'Longitude must be a valid number',
    } ),
    carModel: z.string().min(1, 'Please select a car model'),
} );