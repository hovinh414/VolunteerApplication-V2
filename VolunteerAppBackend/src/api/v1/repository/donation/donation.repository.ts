import Donation from './donation.entity';
import User from '../user/user.entity';
import Join from '../activity/join.entity';
import Post from '../post/post.entity';
import { sendVerificationEmail } from "../../services/firebase.service";
import { ActDTO } from '../../DTO/activity.dto';
import { generateQRCode } from "../../services/qrcode.service";
import { getTotalLikesForPost, redisClient } from '../../../../redis/redisUtils';
import { NotiRepository } from '../notify/noti.repository';

export class DonationRepository {
  private readonly notiRepository!: NotiRepository;

  constructor() {
    this.notiRepository = new NotiRepository();
  }

  createNewDonation = async (_post: any) => {
    const donation: any = new Donation({
      postId: _post.postId,
      exprirationDate: _post.exprirationDate,
      numOfPeopleParticipated: 0,
      donateItem: _post.donateItem,
      ownerId: _post.ownerId,
      isEnableQr: false,
      qrCode: await generateQRCode(_post._id)
    })
    await donation.save();
    return donation;
  }

  async isValidDonationId(donationId: string): Promise<boolean> {
    try {
      const donation = await Donation.findById(donationId);
      return !!donation;
    } catch (error) {
      console.error('Error checking donationId validity:', error);
      return false;
    }
  }
  getDonationById = async (_idDonation: String) => {
    try {
      const donationFind = await Donation.findOne({
        _id: _idDonation
      });
      return donationFind;
    } catch (error) {
      console.error('Error getting donation by ID:', error);
      throw error;
    }
  }

  hasExistJoin = async (_userId: any, _donationId: any) => {
    const joinExist = await Join.findOne({
      userId: _userId,
      donationId: _donationId
    });
    if (joinExist)
      return true;
    return false;
  }

  hasEmailJoinSend = async (_userId: any, _donationId: any) => {
    const joinExist = await Join.findOne({
      userId: _userId,
      donationId: _donationId
    });
    if (joinExist?.isEmailsend)
      return true;
    return false;
  }
  //check user attend before
  hasUserJoinedDonation = async (_userId: any, _donationId: any) => {
    try {
      const donation = await Donation.findOne({ _id: _donationId });
      if (!donation) {
        return false;
      }
      const hasJoined = await this.hasExistJoin(_userId, _donationId);
      return hasJoined;
    } catch (error) {
      console.error('Error:', error);
      return false;
    }
  };

  findPostBaseActId = async (_donationId: any) => {
    try {
      const post = await Post.findOne({ donationId: _donationId });
      if (!post) {
        return ({ error: 'Post not found' })
      }
      return post;
    } catch (error) {
      console.error('Error:', error);
    }
  };

  findDonationIdBasePost = async (_postId: any) => {
    try {
      const donation = await Donation.findOne({ postId: _postId });

      if (!donation) {
        return { error: 'Donation not found' };
      }

      return donation._id;
    } catch (error) {
      console.error('Error:', error);
      return { error: error };
    }
  };


  isJoined = async (userId: any, donationId: any) => {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }
      const donation = await Donation.findById(donationId);
      if (!donation) {
        throw new Error('Donation not found');
      }
      const isUserJoined = await this.hasExistJoin(userId, donationId);
      return isUserJoined;
    } catch (error) {
      throw error;
    }
  }

  isJoinedAct = async (userId: any, donationId: any) => {
    try {
      const user = await User.findById(userId);
      if (!user) {
        return { error: 'User not found' }
      }
      const donation = await Donation.findById(donationId);
      if (!donation) {
        return { error: 'Donation not found' }
      }
      const isUserJoined = await this.hasExistJoin(userId, donationId);
      return { success: '', join: isUserJoined };
    } catch (error) {
      throw error;
    }
  }

  isAttended = async (_userId: any, _donationId: any) => {
    try {
      const user = await User.findById(_userId);
      if (!user) {
        throw new Error('User not found');
      }
      const donation = await Donation.findById(_donationId);
      if (!donation) {
        throw new Error('Donation not found');
      }
      const joinExist = await Join.findOne({
        userId: _userId,
        donationId: _donationId
      });
      if (joinExist?.isAttended)
        return true;
      return false;
    } catch (error) {
      throw error;
    }
  }
  checkAndSendMailForUser = async (userId: any, donationId: any, detailPost: any) => {
    try {
      const isSend = await this.hasEmailJoinSend(userId, donationId)
      if (!isSend) {
        const user = await User.findById(userId);
        if (!user) {
          throw new Error('User not found');
        }
        await sendVerificationEmail(user.email, detailPost);
      }
    } catch (error) {
      throw error;
    }
  }


  async getDetailsOfJoinedActivities(userId: any) {
    try {
      const joinedActivities = await Join.find({ userId: userId });

      const detailedActivities = await Promise.all(
        joinedActivities.map(async (joinedDonation) => {
          const donationId = joinedDonation.donationId;
          const donationDetails = await Donation.findById(donationId);
          const postForGet = await Post.findOne({ donationId: donationId });
          const owner = await User.findOne({ _id: postForGet?.ownerId });
          const actDetails: ActDTO = ({
            _id: donationId,
            _postId: postForGet?._id,
            media: postForGet?.media[0],
            ownerDisplayname: owner?.fullname
          })
          return actDetails;
        })
      );

      return detailedActivities;
    } catch (error) {
      console.error('Error getting details of joined activities:', error);
    }
  }

  async getDetailsOfActivitiesCreated(_orgId: any) {
    try {
      const createdActivities = await Donation.find({ ownerId: _orgId });

      const detailedActivities = await Promise.all(
        createdActivities.map(async (createdDonation) => {
          const donationId = createdDonation.id;
          const donationDetails = await Donation.findById(donationId);
          const postForGet = await Post.findOne({ donationId: donationId });
          const owner = await User.findOne({ _id: _orgId });
          const actDetails: ActDTO = ({
            _id: donationId,
            _postId: postForGet?._id,
            media: postForGet?.media[0],
            ownerDisplayname: owner?.fullname
          })
          return actDetails;
        })
      );

      return detailedActivities;
    } catch (error) {
      console.error('Error getting details of joined activities:', error);
    }
  }

  getAllUserJoinAct = async (_donationId: any) => {
    try {
      const allJoins = Join.find({ donationId: _donationId });
      const allUsers = await Promise.all(
        (await allJoins).map(async (join) => {
          const user = await User.findOne({ _id: join.userId });
          const userResult = ({
            _id: join.userId,
            username: user?.username,
            avatar: user?.avatar
          })
          return userResult;
        })
      );
      return { success: 'Get success', users: allUsers }
    } catch (error) {
      return { error: error }
    }
  }

  getAllUserAttendanceAct = async (_donationId: any) => {
    try {
      const allJoins = Join.find({ donationId: _donationId, isAttended: true });
      const allUsers = await Promise.all(
        (await allJoins).map(async (join) => {
          const user = await User.findOne({ _id: join.userId });
          const userResult = ({
            _id: join.userId,
            username: user?.username,
            avatar: user?.avatar
          })
          return userResult;
        })
      );
      return { success: 'Get success', users: allUsers }
    } catch (error) {
      return { error: error }
    }
  }

  getAllUserJoinDonation = async (_donationId: any) => {
    try {
      const allJoins = Join.find({ donationId: _donationId });
      const allUsers = await Promise.all(
        (await allJoins).map(async (join) => {
          const user = await User.findOne({ _id: join.userId });
          const userResult = ({
            userId: join.userId,
            username: user?.username,
            avatar: user?.avatar,
            join
          })
          return userResult;
        })
      );
      return { success: 'Get success', users: allUsers }
    } catch (error) {
      return { error: error }
    }
  }

  blockUserNotAttend = async () => {
    try {
      const allUser = await User.find();
      const user2Times: any = [];
      const user3Times: any = [];

      await Promise.all(allUser.map(async (user) => {
        const times = await Join.countDocuments({ userId: user._id, isAttended: false });
        const userResult = {
          userId: user._id,
          time: times
        };

        if (times === 2) {
          user2Times.push(userResult);
        } else if (times === 3) {
          user3Times.push(userResult);
        }
      }));
      await Promise.all(user3Times.map(async (userForBan: any) => {
        await this.blockUser(userForBan.userId)
      }));
      await Promise.all(user2Times.map(async (userForBan: any) => {
        const notiForSend = {
          donationId: "",
          senderId: "656f0de17eb17d1767d0361b",
          receiveId: userForBan.userId,
          message: 'Bạn đã không tham gia hoạt động quá 2 lần! Tài khoản sẽ bị khoá vào lần sau!',
          createAt: new Date(),
          actionLink: '',
          messageType: "block",
          status: '',
          isSeen: false
        }
        await this.notiRepository.createNoti(notiForSend)
      }));
      return { user2Times, user3Times };
    } catch (error) {
      console.log(error);
    }
  };

  blockUser = async (userId: any) => {
    try {
      const userUpdate = await User.findOneAndUpdate({ _id: userId }, { $set: { isEnable: false } }, { new: true });

      if (userUpdate) {
        console.log(`User with ID ${userId} has been blocked successfully.`);
      } else {
        console.log(`User with ID ${userId} not found or not updated.`);
      }
    } catch (error) {
      console.error('Error blocking user:', error);
    }
  };

  joinDonation = async (userId: any, _donation: any) => {
    const user = await User.findById(userId);
    if (user?.roleId == '656c9bda38d3d6f36ecc8eb6') {
      return { error: 'Organization can not join donation' };
    }
    const donation = await Donation.findById(_donation._id);

    if (!user || !donation) {
      return { error: 'User or Donation not found' };
    }
    const checkUserJoined = await this.hasExistJoin(userId, _donation._id);
    if (checkUserJoined) {
      return { error: 'User is already participating in this donation' };
    }
    if (donation.isExprired) {
      return { error: 'This donation is expried' };
    }
    var joinNew: any = new Join({
      donationId: donation._id,
      userId: userId,
      donateItem: _donation.donateItem,
      quantity: _donation.quantity,
      timeSend: _donation.timeSend,//time send donation item for org 
    });
    joinNew.save();
    if (joinNew) {
      donation.numOfPeopleParticipated = donation.numOfPeopleParticipated as number + 1;
    }
    await donation.save();
    const notiForSend = {
      donationId: donation._id,
      senderId: userId,
      receiveId: donation.ownerId,
      message: 'và ' + donation.numOfPeopleParticipated + ' ngừoi khác đã tham gia vào bài viết quyên góp của bạn',
      createAt: new Date(),
      actionLink: '',
      messageType: "join",
      status: '',
      isSeen: false
    }
    await this.notiRepository.createNoti(notiForSend)
    // const PostInfor: any = await this.findPostBaseActId(_donation._id);
    // const postSendMail: any = ({
    //   content: PostInfor.content,
    //   address: donation.address,
    //   title: 'Nội dung chi tiết như sau:'
    // })
    // await sendVerificationEmail(user.email, postSendMail);
    const pattern = `posts_joined:page:*:userId:${userId}`;
    const keysToDelete = await redisClient.keys(pattern);

    if (keysToDelete.length > 0) {
      await redisClient.del(keysToDelete);
    }

    return { success: 'Join success', numOfPeopleParticipated: donation.numOfPeopleParticipated };
  }

}
export const { blockUserNotAttend } = new DonationRepository();