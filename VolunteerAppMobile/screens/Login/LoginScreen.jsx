import {
    View,
    Text,
    Image,
    Pressable,
    Modal,
    TouchableOpacity,
} from 'react-native'
import React, { useState, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import COLORS from '../../constants/colors'
import { MaterialIcons, Ionicons } from '@expo/vector-icons'
import Checkbox from 'expo-checkbox'
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message'
import CustomInputPassword from '../../components/custom/CustomInputPassword'
import axios from 'axios'
import CustomInput from '../../components/custom/CustomInput'
import Auth from './Auth'
import AsyncStoraged from '../../services/AsyncStoraged'
import CustomButton from '../../components/custom/CustomButton'
import API_URL from '../../config/config'
import ToastAlert from '../../components/modal/ToastAlert'

const LoginScreen = ({ navigation }) => {
    const [isPasswordShow, setIsPasswordShow] = useState(true)
    const [isChecked, setIsChecked] = useState(false)
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [passwordErrorMessage, setPasswordErrorMessage] = useState('')
    const [usernameErrorMessage, setusernameErrorMessage] = useState('')

    const removeUser = async () => {
        const userStored = await AsyncStoraged.removeData()
    }
    useEffect(() => {
        removeUser()
    }, [])
    const showEmailandPhoneErrorMessage = (_username) => {
        if (_username.length === 0) {
            setusernameErrorMessage('Tên đăng nhập không được trống')
        } else {
            setusernameErrorMessage('')
        }
    }
    const showPasswordMessage = (_password) => {
        if (_password.length === 0) {
            setPasswordErrorMessage('Mật khẩu không được trống')
        } else if (Auth.isValidPassword(_password) === false) {
            setPasswordErrorMessage(
                'Mật khẩu bao gồm 8 ký tự, chữ in hoa và chữ số'
            )
        } else {
            setPasswordErrorMessage('')
        }
    }
    const handleLogin = async () => {
        try {
            if (!username || !password) {
                Toast.show({
                    type: 'warning',
                    text1: 'Cảnh báo',
                    text2: 'Vui lòng nhập đầy đủ thông tin!',
                    visibilityTime: 2500,
                    topOffset: 10,
                })
                return
            }
            const res = await axios({
                method: 'post',
                url: API_URL.API_URL + '/login',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    Accept: 'application/json',
                },
                data: {
                    username,
                    password,
                },
            })
            if (res.data.status === 'SUCCESS') {
                if (!res.data.data.userResult) {
                    if (!res.data.data.orgResult.isEnable) {
                        Toast.show({
                            type: 'error',
                            text1: 'Thất bại',
                            text2: 'Tài khoản của bạn đã bị khóa!',
                            visibilityTime: 2500,
                            topOffset: 10,
                        })
                        return
                    } else {
                        AsyncStoraged.storeData(res.data.data.orgResult)
                    }
                } else {
                    if (!res.data.data.userResult.isEnable) {
                        Toast.show({
                            type: 'error',
                            text1: 'Thất bại',
                            text2: 'Tài khoản của bạn đã bị khóa!',
                            visibilityTime: 2500,
                            topOffset: 10,
                        })
                        return
                    } else {
                        AsyncStoraged.storeData(res.data.data.userResult)
                    }
                }

                AsyncStoraged.setToken(res.data.data.refreshToken)
                navigation.reset({
                    index: 0,
                    routes: [
                        {
                            name: 'BottomTabNavigation',
                            params: { screen: 'Feed' },
                        },
                    ],
                })
            }
        } catch (error) {
            if (error) {
                console.log('API Error:', error)
                Toast.show({
                    type: 'error',
                    text1: 'Thất bại',
                    text2: 'Đăng nhập thất bại',
                    visibilityTime: 2500,
                    topOffset: 10,
                })
            }
        }
    }
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
            <ToastAlert/>
            {/* <CustomAlert
                visible={showWarning}
                mess={mess}
                onRequestClose={() => setShowWarning(false)}
                onPress={() => setShowWarning(false)}
                title={'ĐÓNG'}
                icon={icon}
            /> */}
            <View style={{ flex: 1, marginHorizontal: 22, zIndex: 1 }}>
                <View style={{ marginVertical: 22 }}>
                    <Text
                        style={{
                            fontSize: 22,
                            fontWeight: 'bold',
                            marginVertical: 12,
                            color: COLORS.black,
                        }}
                    >
                        Xin Chào ! 👋
                    </Text>

                    <Text
                        style={{
                            fontSize: 16,
                            color: COLORS.black,
                        }}
                    >
                        Đăng nhập để tiếp tục!
                    </Text>
                </View>

                <View>
                    <Text
                        style={{
                            fontSize: 16,
                            fontWeight: 400,
                            marginVertical: 8,
                        }}
                    >
                        Tài khoản
                    </Text>

                    <CustomInput
                        onChangeText={(username) => {
                            setUsername(username)
                            showEmailandPhoneErrorMessage(username)
                        }}
                        placeholder="Nhập tài khoản của bạn"
                        error={usernameErrorMessage.length !== 0}
                        errorMessage={usernameErrorMessage}
                    />
                </View>

                <View style={{ marginBottom: 12 }}>
                    <Text
                        style={{
                            fontSize: 16,
                            fontWeight: 400,
                            marginVertical: 8,
                        }}
                    >
                        Mật khẩu
                    </Text>

                    <CustomInputPassword
                        onChangeText={(password) => {
                            setPassword(password)
                            showPasswordMessage(password)
                        }}
                        placeholder={'Nhập mật khẩu hiện tại'}
                        error={passwordErrorMessage.length !== 0}
                        errorMessage={passwordErrorMessage}
                        secureTextEntry={isPasswordShow}
                        isPasswordShow={isPasswordShow}
                        onPress={() =>
                            isPasswordShow
                                ? setIsPasswordShow(false)
                                : setIsPasswordShow(true)
                        }
                    />
                </View>

                {/* <View
                    style={{
                        flexDirection: 'row',
                        marginVertical: 6,
                        marginBottom: 18,
                    }}
                >
                    <Checkbox
                        style={{ marginRight: 8 }}
                        value={isChecked}
                        onValueChange={setIsChecked}
                        color={isChecked ? COLORS.primary : undefined}
                    />

                    <Text>Remember Me</Text>
                </View> */}

                <CustomButton onPress={() => handleLogin()} title="ĐĂNG NHẬP" />

                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginVertical: 20,
                    }}
                >
                    <View
                        style={{
                            flex: 1,
                            height: 1,
                            backgroundColor: COLORS.grey,
                            marginHorizontal: 10,
                        }}
                    />
                    <Text style={{ fontSize: 14 }}>Hoặc</Text>
                    <View
                        style={{
                            flex: 1,
                            height: 1,
                            backgroundColor: COLORS.grey,
                            marginHorizontal: 10,
                        }}
                    />
                </View>

                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                    }}
                >
                    <TouchableOpacity
                        onPress={() => console.log('Pressed')}
                        style={{
                            flex: 1,
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexDirection: 'row',
                            height: 52,
                            borderWidth: 1,
                            borderColor: COLORS.grey,
                            marginRight: 4,
                            borderRadius: 10,
                        }}
                    >
                        <Image
                            source={require('../../assets/facebook.png')}
                            style={{
                                height: 36,
                                width: 36,
                                marginRight: 8,
                            }}
                            resizeMode="contain"
                        />

                        <Text>Facebook</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => console.log('Pressed')}
                        style={{
                            flex: 1,
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexDirection: 'row',
                            height: 52,
                            borderWidth: 1,
                            borderColor: COLORS.grey,
                            marginRight: 4,
                            borderRadius: 10,
                        }}
                    >
                        <Image
                            source={require('../../assets/google.png')}
                            style={{
                                height: 36,
                                width: 36,
                                marginRight: 8,
                            }}
                            resizeMode="contain"
                        />

                        <Text>Google</Text>
                    </TouchableOpacity>
                </View>

                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        marginVertical: 22,
                    }}
                >
                    <Text style={{ fontSize: 16, color: COLORS.black }}>
                        Bạn chưa có tài khoản ?{' '}
                    </Text>
                    <Pressable
                        onPress={() => navigation.navigate('SignupType')}
                    >
                        <Text
                            style={{
                                fontSize: 16,
                                color: COLORS.primary,
                                fontWeight: 'bold',
                                marginLeft: 6,
                            }}
                        >
                            Đăng ký
                        </Text>
                    </Pressable>
                </View>
            </View>
        </SafeAreaView>
    )
}

export default LoginScreen
