import mongoose, { Document, ObjectId, Schema } from 'mongoose';

export interface IPost {
    type: String,
    ownerId: String,
    createdAt: Date,
    updatedAt: Date,
    modifiedBy: String,
    scope: String,
    content: String,
    media: Array<String>,
    numOfComment: Number,
    commentUrl: String,
    activityId: String,
    fundId: String,
    donationId: String,
}

export interface IPostModel extends IPost, Document { }

const IPostSchema: Schema = new Schema(
    {
        type: {type: String, require: true},
        ownerId: {type: String, required: true},
        createdAt: {type: Date, required: false},
        updatedAt: {type: Date, require: false},
        scope: {type: String, require: true},
        content: {type: String, require: true},
        media: {type: Array<String>, require: false},
        numOfComment: {type: Number, require: false},
        commentUrl: {type: String, require: false},
        activityId: {type: String, require: false},
        fundId: {type: String, require: false},
        donationId: {type: String, require: false},
        modifiedBy: {type: String, require: false},
    },
    {
        versionKey: false
    }
);

export default mongoose.model<IPostModel>('Post', IPostSchema);
