import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import BottomTabNavigation from '../navigation/BottomTabNavigation'
import SignupType from './Signup/SignType'
import SignupOrganisation from './Signup/SignupOrganisation'
import Signup from './Signup/Signup'
import EditProfile from './Profile/EditProfile'
import Settings from './Profile/Settings'
import LoginScreen from './Login/LoginScreen'
import ChangePassword from './Profile/ChangePassword'
import ChangeAddress from './Profile/ChangeAddress'
import Chat from './Chat/Chat'
import ChatDetail from './Chat/ChatDetail'
import DetailPost from './Post/Activity/DetailPost'
import ViewDetailImage from './Post/ViewDetailImage'
import ProfileUser from './Profile/ProfileUser'
import FeaturedArticle from './Feed/FeaturedArticle'
import NotificationScreen from './Feed/NotificationScreen'
import Attendance from './Attendance/Attendance'
import ShowQr from './Attendance/ShowQr'
import ScanQR from './Attendance/ScanQR'
import Statistical from './Post/Statistical'
import MapScreen from './Map/MapScreen'
import ProductiveActivities from './Feed/ProductiveActivities'
import VerifyOrgRoute from './Profile/ProfileComponent/VerifyOrgRoute'
import InfoRoute from './Profile/ProfileComponent/InfoRoute'
import DetailDonation from './Post/Donation/DetailDonation'
import ConfirmDonation from './Post/Donation/ConfirmDonation'
import DetailNormal from './Post/DetailNormal'

const Stack = createNativeStackNavigator()
export default function StackNavigator() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="BottomTabNavigation"
                component={BottomTabNavigation}
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="SignupType"
                component={SignupType}
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="Signup"
                component={Signup}
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="SignupOrganisation"
                component={SignupOrganisation}
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="EditProfile"
                component={EditProfile}
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="Settings"
                component={Settings}
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="LoginScreen"
                component={LoginScreen}
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="ChangePassword"
                component={ChangePassword}
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="Chat"
                component={Chat}
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="ChatDetail"
                component={ChatDetail}
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="DetailPost"
                component={DetailPost}
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="DetailDonation"
                component={DetailDonation}
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="DetailNormal"
                component={DetailNormal}
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="ViewDetailImage"
                component={ViewDetailImage}
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="ProfileUser"
                component={ProfileUser}
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="FeaturedArticle"
                component={FeaturedArticle}
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="Statistical"
                component={Statistical}
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="NotificationScreen"
                component={NotificationScreen}
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="Attendance"
                component={Attendance}
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="ShowQr"
                component={ShowQr}
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="ScanQR"
                component={ScanQR}
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="MapScreen"
                component={MapScreen}
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="ProductiveActivities"
                component={ProductiveActivities}
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="ChangeAddress"
                component={ChangeAddress}
                options={{
                    headerShown: false,
                    presentation: 'modal',
                    animationTypeForReplace: 'push',
                    animation: 'slide_from_bottom',
                }}
            />
            <Stack.Screen
                name="VerifyOrgRoute"
                component={VerifyOrgRoute}
                options={{
                    headerShown: false,
                    presentation: 'modal',
                    animationTypeForReplace: 'push',
                    animation: 'slide_from_bottom',
                }}
            />
            <Stack.Screen
                name="InfoRoute"
                component={InfoRoute}
                options={{
                    headerShown: false,
                    presentation: 'modal',
                    animationTypeForReplace: 'push',
                    animation: 'slide_from_bottom',
                }}
            />
            <Stack.Screen
                name="ConfirmDonation"
                component={ConfirmDonation}
                options={{
                    headerShown: false,
                    presentation: 'modal',
                    animationTypeForReplace: 'push',
                    animation: 'slide_from_bottom',
                }}
            />
        </Stack.Navigator>
    )
}