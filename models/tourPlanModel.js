import mongoose, { Schema } from "mongoose";
const tourSchema = new Schema(
    {
        from: {
            type: String,
            required: true,
            trim: true,
        },
        to: {
            type: String,
            required: true,
            trim: true,
        },
        byVehicle: {
            type: String,
            required: true,
            trim: true,
        },
        stops: [{
            type: String,
            required: true,
            trim: true,
            select: true,
        }],

        images: [{
            type: String,
            required: true,
        }],

        listOfPersons: [
            {
                type: String
            }
        ],

        budget: {
            type: Number,
            required: true,
        }
    },
    {
        timestamps: true,
    }
);

const tour = mongoose.model("tour", tourSchema);
export default tour;
