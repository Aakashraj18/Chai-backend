import mongoose , { Schema } from "mongoose"

const subscriptionsSchema = new Schema({
    subscriber: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    channel: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }

}, { timestamps: true})

export const Subscription = mongoose.model("Subscription", subscriptionsSchema)




// CHANNEL count gives to SUBSCRIBERS
// SUBSCRIBERS count gives to CHANNEL