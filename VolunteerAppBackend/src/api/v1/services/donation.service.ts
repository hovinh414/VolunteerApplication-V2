import { DonationRepository } from "../repository/donation/donation.repository";
import { PostRepository } from "../repository/post/post.repository";
import { UserRepository } from "../repository/user/user.repository";



export class DonationService {
  private readonly postRepository!: PostRepository;
  private readonly userRepository!: UserRepository;
  private readonly donationRepository!: DonationRepository;

  constructor() {
    this.postRepository = new PostRepository();
    this.userRepository = new UserRepository();
    this.donationRepository = new DonationRepository();
  }

  joinDonation = async(_userId: any, _donation: any) => {
    try{
        const joinResult: any = await this.donationRepository.joinDonation(_userId, _donation);
        return joinResult;
    }
    catch(error){
        console.log(error);
    }
  }

  getDetailsOfJoinedActivities = async (_userId: any) => {
    try {
      const detailedActivities = await this.donationRepository.getDetailsOfJoinedActivities(_userId);
      return detailedActivities;
    } catch (error) {
      console.error('Error:', error);
      throw error; // Nếu bạn muốn ném lỗi để nó được xử lý ở nơi gọi hàm
    }
  }
  getDetailsOfCreatedActivities = async (_orgId: any) => {
    try {
      const detailedActivities = await this.donationRepository.getDetailsOfActivitiesCreated(_orgId);
      return detailedActivities;
    } catch (error) {
      console.error('Error:', error);
      throw error; // Nếu bạn muốn ném lỗi để nó được xử lý ở nơi gọi hàm
    }
  }

  attendnace = async(_postId: any, _userId: any)=>{
    try {
      const joinResult = await this.postRepository.attendance(_postId, _userId);
      return joinResult;
    } catch (error) {
      return ({error: error})
    }
  }

  getAlluserJoin = async(_donationId: any)=>{
    try {
      const allUsers = await this.donationRepository.getAllUserJoinAct(_donationId);
      return allUsers;
    } catch (error) {
      return ({error: error})
    }
  }

  getAlluserAttendance = async(_donationId: any)=>{
    try {
      const allUsers = await this.donationRepository.getAllUserAttendanceAct(_donationId);
      return allUsers;
    } catch (error) {
      return ({error: error})
    }
  }

  getAllUserJoinDonation = async(_donationId: any)=>{
    try {
      const allUsers = await this.donationRepository.getAllUserJoinDonation(_donationId);
      return allUsers;
    } catch (error) {
      return ({error: error})
    }
  }
}
