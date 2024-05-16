import { NextFunction, Request, Response } from "express";
import { PostService } from "../../services/post.service";
import { ResponseBase, ResponseStatus } from "../../../../shared/response/response.payload";
import { DonationService } from "../../services/donation.service";

declare global {
    namespace Express {
        interface Request {
            files?: any
        }
    }
}
export class DonationController {
    postServiceInstance!: PostService;
    donationServiceInstance!: DonationService;

    constructor() {
        this.postServiceInstance = new PostService();
        this.donationServiceInstance = new DonationService();
    }

    joinDonation = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userJoinId = req.user.userId;
            const { donationId, donateItem, quantity, timeSend } = req.body;
            const donation = {
                _id: donationId,
                donateItem, 
                quantity,
                timeSend
            }
            const joinResult: any = await this.donationServiceInstance.joinDonation(userJoinId, donation);
            if (joinResult.success) {
                return res.status(200).json(ResponseBase(ResponseStatus.SUCCESS, 'Join success', {totalUserJoin: joinResult.numOfPeopleParticipated}));
            }
            else if(joinResult.error){
                return res.status(500).json(ResponseBase(ResponseStatus.ERROR, joinResult.error, null));
            }
        }
        catch (error: any) {
            return res.status(500).json(ResponseBase(ResponseStatus.ERROR, error, null));
        }
    }

    getDetailsOfJoinedActivities = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userForGetAct = req.user.userId;
            const joinResult: any=await this.donationServiceInstance.getDetailsOfJoinedActivities(userForGetAct);
            if (joinResult) {
                return res.status(200).json(ResponseBase(ResponseStatus.SUCCESS, 'Join success', joinResult));
            }
        }
        catch (error: any) {
            return res.status(500).json(ResponseBase(ResponseStatus.ERROR, error, null));
        }
    }

    getDetailsOfCreatedActivities = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const orgForGetAct = req.user.userId;
            const createResult: any=await this.donationServiceInstance.getDetailsOfCreatedActivities(orgForGetAct);
            if (createResult) {
                return res.status(200).json(ResponseBase(ResponseStatus.SUCCESS, 'Join success', createResult));
            }
        }
        catch (error: any) {
            return res.status(500).json(ResponseBase(ResponseStatus.ERROR, error, null));
        }
    }

    attendance = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userAttend = req.body.userId;
            const postId = req.params.postId;
            const joinResult: any=await this.donationServiceInstance.attendnace(postId, userAttend);
            if (joinResult.success) {
                return res.status(200).json(ResponseBase(ResponseStatus.SUCCESS, 'Attendace success', joinResult.join));
            }
            else{
                return res.status(500).json(ResponseBase(ResponseStatus.ERROR, joinResult.error, null));
            }
        }
        catch (error: any) {
            return res.status(500).json(ResponseBase(ResponseStatus.ERROR, error, null));
        }
    }

    


    getAllUserJoinAct =  async (req: Request, res: Response, next: NextFunction) => {
        try {
            const donationId = req.params.donationid;
            const allUsers: any=await this.donationServiceInstance.getAlluserJoin(donationId);
            if (allUsers.success) {
                return res.status(200).json(ResponseBase(ResponseStatus.SUCCESS, 'Get success', allUsers.users));
            }
            else{
                return res.status(500).json(ResponseBase(ResponseStatus.ERROR, allUsers.error, null));
            }
        }
        catch (error: any) {
            return res.status(500).json(ResponseBase(ResponseStatus.ERROR, error, null));
        }
    }

    getAllUserAttendanceAct =  async (req: Request, res: Response, next: NextFunction) => {
        try {
            const donationId = req.params.donationid;
            const allUsers: any=await this.donationServiceInstance.getAlluserAttendance(donationId);
            if (allUsers.success) {
                return res.status(200).json(ResponseBase(ResponseStatus.SUCCESS, 'Get success', allUsers.users));
            }
            else{
                return res.status(500).json(ResponseBase(ResponseStatus.ERROR, allUsers.error, null));
            }
        }
        catch (error: any) {
            return res.status(500).json(ResponseBase(ResponseStatus.ERROR, error, null));
        }
    }

    getAllUserAttendanceDonation =  async (req: Request, res: Response, next: NextFunction) => {
        try {
            const donationId = req.params.donationId;
            const allUsers: any=await this.donationServiceInstance.getAllUserJoinDonation(donationId);
            if (allUsers.success) {
                return res.status(200).json(ResponseBase(ResponseStatus.SUCCESS, 'Get success', allUsers.users));
            }
            else{
                return res.status(500).json(ResponseBase(ResponseStatus.ERROR, allUsers.error, null));
            }
        }
        catch (error: any) {
            return res.status(500).json(ResponseBase(ResponseStatus.ERROR, error, null));
        }
    }

}
