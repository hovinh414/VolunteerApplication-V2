import {
    View,
    Text,
    TouchableOpacity,
    SafeAreaView,
    Dimensions,
} from 'react-native'
import QRCode from 'react-native-qrcode-svg'
import React, { useState, useEffect } from 'react'
import { COLORS, FONTS } from '../../constants/theme'
import { MaterialIcons, AntDesign, Ionicons } from '@expo/vector-icons'
import AsyncStoraged from '../../services/AsyncStoraged'
import { Image } from 'expo-image'
import axios from 'axios'
import API_URL from '../../config/config'
import { BarCodeScanner } from 'expo-barcode-scanner'
import { Colors } from 'react-native/Libraries/NewAppScreen'
import Modal from 'react-native-modal'
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message'
import ModalLoading from '../../components/modal/ModalLoading'
import ToastAlert from '../../components/modal/ToastAlert'
import { styles } from './style/attendanceStyle'

import { da } from 'date-fns/locale'
const scan = '../../assets/scan.gif'
const scan1 = '../../assets/scan.png'
const report = '../../assets/comment.png'
const attendance = '../../assets/attendance.png'
const loading = '../../assets/loading.gif'
const Attendance = ({ navigation, route }) => {
    const screenWidth = Dimensions.get('window').width
    const [id, setId] = useState()
    const [fullname, setFullname] = useState('')
    const [avatar, setAvatar] = useState('')
    const [type, setType] = useState('')
    const [isScanner, setIsScanner] = useState(false)
    const [showLoading, setShowLoading] = useState(false)
    const [scanned, setScanned] = useState(false)
    const [token, setToken] = useState('')
    const getToken = async () => {
        const token = await AsyncStoraged.getToken()
        setToken(token)
    }

    useEffect(() => {
        getToken()
    }, [])

    const handleBarCodeScanned = ({ data }) => {
        setScanned(true)
        attendanceActivity(data)
    }
    const attendanceActivity = async (data) => {
        setShowLoading(true)
        try {
            const res = await axios({
                method: 'post',
                url: API_URL.API_URL + '/activity/attendance/' + data,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token,
                },
            })
            if (res.data.status === 'SUCCESS') {
                setShowLoading(false)
                setIsScanner(false)
                Toast.show({
                    type: 'joinToast',
                    text1: 'Thành công',
                    text2: 'Điểm danh thành công',
                    visibilityTime: 2500,
                    autoHide: true,
                    onHide: () => {
                        navigation.navigate('DetailPost', res.data.data)
                    },
                })
            }
        } catch (error) {
            if (error) {
                Toast.show({
                    type: 'error',
                    text1: 'Thất bại',
                    text2: 'Điểm danh thất bại!',
                    visibilityTime: 2500,
                })
                console.log('atendance error: ' + error)
            }
        }
    }
    const getUserStored = async () => {
        const userStored = await AsyncStoraged.getData()
        setFullname(userStored.fullname)
        setId(userStored._id)
        setAvatar(userStored.avatar)
        setType(userStored.type)
    }
    useEffect(() => {
        getUserStored()
    }, [])
    const renderScanQrCodeModal = () => (
        <Modal
            isVisible={isScanner}
            animationIn="fadeIn"
            animationOut="fadeOut"
            style={{ margin: 0 }}
        >
            <TouchableOpacity
                activeOpacity={1}
                style={{
                    flex: 1,
                    backgroundColor: '#fec4b6',
                }}
                onPressOut={() => {
                    setIsScanner(false)
                    setScanned(false)
                }}
            >
                {renderLoading()}
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.backButton}
                >
                    <MaterialIcons
                        name="keyboard-arrow-left"
                        size={30}
                        color={COLORS.black}
                    />
                    <Text style={styles.scanText}>Scan QR Code</Text>
                    <MaterialIcons
                        name={'qr-code-scanner'}
                        size={30}
                        color={COLORS.black}
                    />
                </TouchableOpacity>
                <View style={styles.container}>
                    <View style={styles.background}>
                        <View style={styles.viewText}>
                            <Text style={styles.textScan}>
                                Scan QR để điểm danh
                            </Text>
                        </View>
                        <BarCodeScanner
                            style={{
                                position: 'absolute',
                                width: 300,
                                height: 300,
                            }}
                            onBarCodeScanned={
                                scanned ? undefined : handleBarCodeScanned
                            }
                        />
                        <Image
                            source={require('../../assets/khung.png')}
                            style={styles.khungImg}
                        />
                        <View style={styles.viewTextThank}>
                            <Text
                                style={styles.textThank}
                            >
                                Cảm ơn bạn đã tham gia tình nguyện cùng Việc Tử
                                Tế!
                            </Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        </Modal>
    )
    const renderLoading = () => (
        <Modal
            isVisible={showLoading}
            animationIn="fadeIn"
            animationOut="fadeOut"
            style={{ margin: 0 }}
        >
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Image
                    source={require(loading)}
                    style={{ width: 70, height: 70 }}
                />
            </View>
        </Modal>
    )
    return (
        <SafeAreaView
            style={styles.header}
        >
            <ToastAlert />
            <ModalLoading visible={showLoading} />
            {renderScanQrCodeModal()}

            <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={styles.touchBack}
            >
                <MaterialIcons
                    name="keyboard-arrow-left"
                    size={30}
                    color={COLORS.black}
                />
                <Text
                    style={{
                        color: COLORS.black,
                        fontSize: 17,
                        fontWeight: 'bold',
                    }}
                >
                    Quay lại
                </Text>
            </TouchableOpacity>

            <View
                style={styles.viewBackground}
            >
                {type === 'Organization' ? (
                    <View
                        style={styles.viewQr}
                    >
                        <Text
                            style={styles.qr}
                        >
                            Mã QR cá nhân
                        </Text>
                        <View
                            style={styles.showQr}
                        >
                            <QRCode value={id} size={200} />
                        </View>
                        <Text
                            style={styles.textName}
                        >
                            {fullname}
                        </Text>
                    </View>
                ) : (
                    <View
                        style={styles.viewQr}
                    >
                        <View
                            style={styles.viewProfile}
                        >
                            <Image
                                source={avatar}
                                style={styles.avatar}
                            />
                        </View>
                        <Text
                            style={styles.fullname}
                        >
                            {fullname}
                        </Text>
                    </View>
                )}
            </View>
            <View
                style={{
                    backgroundColor: '#fff',
                    height: '25%',
                    marginHorizontal: 25,
                }}
            >
                <View
                    style={{
                        flex: 1,
                        flexDirection: 'row',
                        justifyContent: 'space-around',
                        alignItems: 'center',
                    }}
                >
                    {type === 'Organization' ? (
                        <TouchableOpacity
                            onPress={() => navigation.navigate('ShowQr')}
                            activeOpacity={0.8}
                            style={{
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <Image
                                source={require(scan1)}
                                style={{ width: 50, height: 50 }}
                            />
                            <Text
                                style={{
                                    color: COLORS.black,
                                    fontWeight: '500',
                                    fontSize: 16,
                                    marginTop: 10,
                                }}
                            >
                                Quản lý QR
                            </Text>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity
                            activeOpacity={0.8}
                            style={{
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <Image
                                source={require(attendance)}
                                style={{ width: 50, height: 50 }}
                            />
                            <Text
                                style={{
                                    color: COLORS.black,
                                    fontWeight: '500',
                                    fontSize: 16,
                                    marginTop: 10,
                                }}
                            >
                                HĐ đã điểm danh
                            </Text>
                        </TouchableOpacity>
                    )}
                    {/* <View
                        style={{
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <Image
                            source={require(scan1)}
                            style={{ width: 50, height: 50 }}
                        />
                        <Text
                            style={{
                                color: COLORS.black,
                                fontWeight: '500',
                                fontSize: 16,
                                marginTop: 10,
                            }}
                        >
                            Quản lý QR
                        </Text>
                    </View> */}
                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={{
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <Image
                            source={require(report)}
                            style={{ width: 47, height: 47 }}
                        />
                        <Text
                            style={{
                                color: COLORS.black,
                                fontWeight: '500',
                                fontSize: 16,
                                marginTop: 10,
                            }}
                        >
                            Gửi phản ánh
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View
                style={styles.option}
            >
                <View>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Feed')}
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <AntDesign name="home" size={27} color={'#696969'} />
                    </TouchableOpacity>
                </View>
                <View
                    style={{
                        top: -40,
                    }}
                >
                    <TouchableOpacity
                        onPress={() => {
                            setIsScanner(true)
                            setScanned(false)
                        }}
                        activeOpacity={0.8}
                        style={styles.scanImg}
                    >
                        <Image
                            source={require(scan)}
                            style={{
                                height: 130,
                                width: 130,
                                // Các thiết lập khác của hình ảnh nếu cần
                            }}
                        />
                    </TouchableOpacity>
                </View>
                <View>
                    <TouchableOpacity
                        onPress={() =>
                            navigation.navigate('NotificationScreen')
                        }
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <Ionicons
                            name="notifications-outline"
                            size={27}
                            color={'#696969'}
                        />
                    </TouchableOpacity>
                </View>
                {/* Thêm phần này để ảnh scan nằm giữa đường borderTop */}
            </View>
        </SafeAreaView>
    )
}

export default Attendance
