import express from 'express';
import { DonationController } from '../controllers/post/donation.controller'
import { authenticateToken } from '../../../middleware/token.middleware';
const donationRoute = express.Router();
const donationControllerInstance = new DonationController();

//#region Donation
// donationRoute.put('/donation/:donationId', authenticateToken,donationControllerInstance.joinDonation)
// donationRoute.get('/donation/join', authenticateToken,donationControllerInstance.getDetailsOfJoinedActivities)
// donationRoute.get('/donation/create', authenticateToken,donationControllerInstance.getDetailsOfCreatedActivities)
// donationRoute.post('/donation/attendance/:postId', authenticateToken,donationControllerInstance.attendance)
// donationRoute.get('/donation/join/:donationid', authenticateToken,donationControllerInstance.getAllUserJoinAct)
// donationRoute.get('/donation/attendance/:donationid', authenticateToken,donationControllerInstance.getAllUserAttendanceAct)

//donation join 
donationRoute.put('/donation', authenticateToken,donationControllerInstance.joinDonation)
donationRoute.post('/donation/attendance/:postId', authenticateToken,donationControllerInstance.attendance)
donationRoute.get('/donation/join/:donationId', authenticateToken,donationControllerInstance.getAllUserAttendanceDonation)
//#endregion


export default donationRoute;
