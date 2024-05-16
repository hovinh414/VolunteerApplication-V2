import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Dimensions,
    Alert,
} from 'react-native'
import React, { useState, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { COLORS, FONTS } from '../../constants/theme'
import { MaterialIcons } from '@expo/vector-icons'
import AsyncStoraged from '../../services/AsyncStoraged'
const { width, height } = Dimensions.get('screen')
const Settings = ({ navigation }) => {
    const removeData = async () => {
        await AsyncStoraged.removeData()
    }
    const removeToken = async () => {
        await AsyncStoraged.removeToken()
    }

    // const renderQrCodeModal = () => (
    //     <Modal
    //         isVisible={isModalVisible}
    //         onBackdropPress={toggleModal}
    //         animationIn="fadeIn"
    //         animationOut="fadeOut"
    //     >
    //         <TouchableOpacity
    //             style={{ flex: 1 }}
    //             activeOpacity={1}
    //             onPressOut={() => setModalVisible(false)}
    //         >
    //             <View
    //                 style={{
    //                     flex: 1,
    //                     justifyContent: 'center',
    //                     alignItems: 'center',
    //                 }}
    //             >
    //                 <QRCode
    //                     value="https://www.facebook.com/zinhhh.1003"
    //                     size={250}
    //                 />
    //             </View>
    //         </TouchableOpacity>
    //     </Modal>
    // )
    // const renderScanQrCodeModal = () => (
    //     <Modal
    //         isVisible={isScanner}
    //         onBackdropPress={toggleScan}
    //         animationIn="fadeIn"
    //         animationOut="fadeOut"
    //     >
    //         <TouchableOpacity
    //             style={{
    //                 flex: 1,
    //                 justifyContent: 'center',
    //                 alignItems: 'center',
    //             }}
    //             activeOpacity={1}
    //             onPressOut={() => setIsScanner(false)}
    //         >
    //             <View
    //                 style={{
    //                     flex: 1,
    //                     justifyContent: 'center',
    //                     alignItems: 'center',
    //                 }}
    //             >
    //                 <View
    //                     style={{
    //                         justifyContent: 'center',
    //                         alignItems: 'center',
    //                         marginBottom: 25,
    //                     }}
    //                 >
    //                     <Text
    //                         style={{
    //                             color: '#fff',
    //                             fontWeight: 'bold',
    //                             fontSize: 18,
    //                         }}
    //                     >
    //                         Scan QR để điểm danh
    //                     </Text>
    //                 </View>
    //                 <BarCodeScanner
    //                     onBarCodeScanned={scanned}
    //                     style={{
    //                         position: 'absolute',
    //                         width: 300,
    //                         height: 300,
    //                     }}
    //                 />
    //                 <Image
    //                     source={require('../../assets/qrcode.png')}
    //                     style={{ width: 350, height: 350 }}
    //                 />
    //                 <View
    //                     style={{
    //                         justifyContent: 'center',
    //                         alignItems: 'center',
    //                         marginTop: 25,
    //                     }}
    //                 >
    //                     <Text
    //                         style={{
    //                             color: '#fff',
    //                             fontWeight: '500',
    //                             fontSize: 15.5,
    //                         }}
    //                     >
    //                         Cảm ơn bạn đã tham gia tình nguyện cùng Việc Tử Tế,
    //                         Hãy quét mã QR của người tổ chức để điểm danh!
    //                     </Text>
    //                 </View>
    //             </View>
    //         </TouchableOpacity>
    //     </Modal>
    // )
   
    const navigateToEditProfile = () => {
        navigation.navigate('EditProfile')
    }
    const navigateToAttendance = () => {
        navigation.navigate('Attendance')
    }
    const navigateToSecurity = () => {
        console.log('Security function')
        toggleModal() // Show the QR code modal
    }
    const navigateToNotifications = () => {
        console.log('Notifications function')
    }

    const navigateToPrivacy = () => {
        navigation.navigate('ChangePassword')
    }

    const navigateToSubscription = () => {
        console.log('Subscription function')
    }

    const navigateToSupport = () => {
        console.log('Support function')
    }

    const navigateToTermsAndPolicies = () => {
        console.log('Terms and Policies function')
    }

    const navigateToFreeSpace = () => {
        console.log('Free Space function')
    }

    const navigateToDateSaver = () => {
        console.log('Date saver')
    }

    const navigateToReportProblem = () => {
        console.log('Report a problem')
    }

    const addAccount = () => {
        console.log('Aadd account ')
    }

    const logout = () => {
        Alert.alert('Thông báo', 'Bạn có muốn đăng xuất', [
            {
                text: 'Hủy',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
            },
            {
                text: 'Đồng ý',
                onPress: () => {
                    removeData()
                    removeToken()
                    navigation.reset({
                        index: 0,
                        routes: [
                            {
                                name: 'BottomTabNavigation',
                                params: { screen: 'Feed' },
                            },
                        ],
                    })
                },
            },
        ])
    }

    const accountItems = [
        {
            icon: 'person-outline',
            text: 'Chỉnh sửa thông tin',
            action: navigateToEditProfile,
        },
        {
            icon: 'qr-code-scanner',
            text: 'Điểm danh',
            action: navigateToAttendance,
        },
        {
            icon: 'notifications-none',
            text: 'Thông báo',
            action: navigateToNotifications,
        },
        {
            icon: 'lock-outline',
            text: 'Đổi mật khẩu',
            action: navigateToPrivacy,
        },
    ]

    // Render accountItems
    accountItems.map((item, index) => (
        <TouchableOpacity key={index} onPress={item.action}>
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginBottom: 10,
                }}
            >
                <MaterialIcons
                    name={item.icon}
                    size={24}
                    color={COLORS.primary}
                />
                <Text style={{ marginLeft: 15, fontSize: 16 }}>
                    {item.text}
                </Text>
            </View>
        </TouchableOpacity>
    ))

    const supportItems = [
        {
            icon: 'credit-card',
            text: 'Điều khoản sử dụng',
            action: navigateToSubscription,
        },
        { icon: 'help-outline', text: 'Hỗ trợ', action: navigateToSupport },
        {
            icon: 'info-outline',
            text: 'Giới thiệu',
            action: navigateToTermsAndPolicies,
        },
    ]

    const actionsItems = [
        {
            icon: 'outlined-flag',
            text: 'Báo cáo',
            action: navigateToReportProblem,
        },
        // { icon: "people-outline", text: "Thêm taid", action: addAccount },
        { icon: 'logout', text: 'Đăng xuất', action: logout },
    ]

    const renderSettingsItem = ({ icon, text, action }) => (
        <TouchableOpacity
            onPress={action}
            style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 8,
                paddingLeft: 12,
                backgroundColor: COLORS.gray,
            }}
        >
            <MaterialIcons name={icon} size={26} color="black" />
            <Text
                style={{
                    marginLeft: 36,
                    ...FONTS.semiBold,
                    fontWeight: 600,
                    fontSize: 16,
                }}
            >
                {text}{' '}
            </Text>
        </TouchableOpacity>
    )

    return (
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor: '#fff',
            }}
        >
            {/* {renderQrCodeModal()}
            {renderScanQrCodeModal()} */}
            <View
                style={{
                    marginHorizontal: 12,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    paddingTop: 22,
                }}
            >
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={{
                        paddingTop: 18,
                        position: 'absolute',
                        left: 0,
                    }}
                >
                    <MaterialIcons
                        name="keyboard-arrow-left"
                        size={24}
                        color={COLORS.black}
                    />
                </TouchableOpacity>

                <Text style={{ ...FONTS.h3 }}>Cài đặt</Text>
            </View>

            <ScrollView style={{ marginHorizontal: 12 }}>
                {/* Account Settings */}
                <View style={{ marginBottom: 12 }}>
                    <Text style={{ ...FONTS.h4, marginVertical: 10 }}>
                        Tài khoản
                    </Text>
                    <View
                        style={{
                            borderRadius: 12,
                            backgrounColor: COLORS.gray,
                        }}
                    >
                        {accountItems.map((item, index) => (
                            <React.Fragment key={index}>
                                {renderSettingsItem(item)}
                            </React.Fragment>
                        ))}
                    </View>
                </View>

                {/* Support and About settings */}

                <View style={{ marginBottom: 12 }}>
                    <Text style={{ ...FONTS.h4, marginVertical: 10 }}>
                        Hỗ trợ{' '}
                    </Text>
                    <View
                        style={{
                            borderRadius: 12,
                            backgrounColor: COLORS.gray,
                        }}
                    >
                        {supportItems.map((item, index) => (
                            <React.Fragment key={index}>
                                {renderSettingsItem(item)}
                            </React.Fragment>
                        ))}
                    </View>
                </View>

                {/* Actions Settings */}

                <View style={{ marginBottom: 12 }}>
                    <Text style={{ ...FONTS.h4, marginVertical: 10 }}>
                        Thao tác
                    </Text>
                    <View
                        style={{
                            borderRadius: 12,
                            backgrounColor: COLORS.gray,
                        }}
                    >
                        {actionsItems.map((item, index) => (
                            <React.Fragment key={index}>
                                {renderSettingsItem(item)}
                            </React.Fragment>
                        ))}
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default Settings
