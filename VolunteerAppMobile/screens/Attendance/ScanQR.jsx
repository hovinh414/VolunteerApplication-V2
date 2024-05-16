import {
    View,
    Text,
    TouchableOpacity,
    SafeAreaView,
    Dimensions,
    ScrollView,
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
import Modal from 'react-native-modal'
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message'
import ModalLoading from '../../components/modal/ModalLoading'
import ToastAlert from '../../components/modal/ToastAlert'
import { styles } from './style/scanQRStyle'

const loading = '../../assets/loading.gif'
const ScanQR = ({ navigation, route }) => {
    const screenWidth = Dimensions.get('window').width
    const [showLoading, setShowLoading] = useState(false)
    const [scanned, setScanned] = useState(false)
    const [hasPermission, setHasPermission] = useState()
    const [token, setToken] = useState('')
    const getToken = async () => {
        const token = await AsyncStoraged.getToken()
        setToken(token)
    }

    useEffect(() => {
        getToken()
    }, [])
    useEffect(() => {
        const getBarCodeScannerPermissions = async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync()
            setHasPermission(status === 'granted')
            console.log(hasPermission)
        }
        getBarCodeScannerPermissions()
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

    return (
        <View
            style={styles.container}
        >
            <ToastAlert/>
            <View
                activeOpacity={1}
                style={{
                    flex: 1,
                    backgroundColor: '#fec4b6',
                }}
            >
                <ModalLoading visible={showLoading} />
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.backButton}
                >
                    <MaterialIcons
                        name="keyboard-arrow-left"
                        size={30}
                        color={'#fec4b6'}
                    />
                    <Text
                        style={{
                            color: COLORS.black,
                            fontSize: 20,
                            fontWeight: 'bold',
                        }}
                    >
                        Scan QR Code
                    </Text>
                    <MaterialIcons
                        name={'qr-code-scanner'}
                        size={30}
                        color={COLORS.black}
                    />
                </TouchableOpacity>
                <View
                    style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <View
                        style={styles.backgroundColor}
                    >
                        <View
                            style={styles.viewTextScan}
                        >
                            <Text
                                style={styles.textScan}
                            >
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
                            style={{ width: 350, height: 350 }}
                        />
                        <View
                            style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginTop: 25,
                            }}
                        >
                            <Text
                                style={{
                                    color: COLORS.black,
                                    fontWeight: '500',
                                    fontSize: 15,
                                }}
                            >
                                Cảm ơn bạn đã tham gia tình nguyện cùng Việc Tử
                                Tế!
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    )
}

export default ScanQR
