import { Schema, model } from "mongoose";

const watchlistSchema = new Schema(
    {
        image: {
            type: String
        },
        coindId: {
            type: String,
            required: true
        }
    }
)

export const Watchlist = new model("Watchlist", watchlistSchema);