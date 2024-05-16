import mongoose, { Document, ObjectId, Schema } from 'mongoose';

export interface IDonation {
    postId: String,
    address: String,
    numOfPeopleParticipated: Number,
    isExprired: Boolean,
    exprirationDate: Date,
    dateActivity: Date,
    ownerId: String,
    isEnableQr: boolean;
    qrCode: String,
    reasonLock: String,
    isLock: Boolean
}

export interface IDonationModel extends IDonation, Document { }

const IDonationSchema: Schema = new Schema(
    {
        postId: {type: String, required: true},
        numOfPeopleParticipated: {type: Number, require: false},
        exprirationDate: {type: Date, require: true},
        isExprired: {type: Boolean, require: true, default: false},
        donateItem: {type: String, require: true},
        ownerId: {type: String, required: true},
        isEnableQr: {type: Boolean, require: true, default: false},
        qrCode: {type: String, required: true},
        reasonLock: {type: String, require: false},
        isLock: {type: Boolean, require: false},
    },
    {
        versionKey: false
    }
);

export default mongoose.model<IDonationModel>('Donation', IDonationSchema);
