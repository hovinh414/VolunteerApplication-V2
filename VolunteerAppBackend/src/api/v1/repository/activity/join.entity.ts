import mongoose, { Document, ObjectId, Schema } from 'mongoose';

export interface IJoin {
    activityId: String,
    userId: String,
    isAttended:Boolean,
    timeAttended: Date,
    isEmailsend: Boolean,
    donationId: String,
    donateItem: String,
    quantity: String,
    timeSend: Date
}

export interface IJoinModel extends IJoin, Document { }

const IJoinSchema: Schema = new Schema(
    {
        activityId: {type: String, required: false},
        donationId: {type: String, required: false},
        userId: {type: String, required: true},
        donateItem: {type: String, required: false},
        quantity: {type: Number, required: false},
        timeAttended: {type: Date, require: false},
        timeSend: {type: Date, require: false},
        isAttended: {type: Boolean, require: true, default: false},
        isEmailsend: {type: Boolean, require: false},
    },
    {
        versionKey: false
    }
);

export default mongoose.model<IJoinModel>('Join', IJoinSchema);
