import {
    View,
    Text,
    Image,
    Pressable,
    KeyboardAvoidingView,
    TouchableOpacity,
    ScrollView,
} from 'react-native'
import React, { useState } from 'react'
import CustomInputPassword from '../../components/custom/CustomInputPassword'
import COLORS from '../../constants/colors'
import { Ionicons } from '@expo/vector-icons'
import Checkbox from 'expo-checkbox'
import axios from 'axios'
import Button from '../../components/custom/Button'
import { signUpApi } from '../../services/UserService'
import Auth from '../Login/Auth'
import CustomInput from '../../components/custom/CustomInput'
import CustomButton from '../../components/custom/CustomButton'
import API_URL from '../../config/config'
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message'
import ToastAlert from '../../components/modal/ToastAlert'

const Signup = ({ navigation }) => {
    const [isPasswordShow, setIsPasswordShow] = useState(true)
    const [isChecked, setIsChecked] = useState(false)

    const [type, setType] = useState('User')
    const [fullname, setFullname] = useState('')
    const [email, setEmail] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [phone, setPhone] = useState('')
    const [usernameErrorMessage, setusernameErrorMessage] = useState('')
    const [fullnameErrorMessage, setfullnameErrorMessage] = useState('')
    const [emailErrorMessage, setEmailErrorMessage] = useState('')
    const [phoneErrorMessage, setPhoneErrorMessage] = useState('')
    const [passwordErrorMessage, setPasswordErrorMessage] = useState('')
    const [ButtonPress, setButtonPress] = useState('')
    const showFullNameError = (_fullname) => {
        if (_fullname.length === 0) {
            setfullnameErrorMessage('Tên không được trống')
        } else {
            setfullnameErrorMessage('')
        }
    }
    const showEmailMessage = (_email) => {
        if (_email.length === 0) {
            setEmailErrorMessage('Email không được trống')
        } else if (Auth.isValidEmail(_email) === false) {
            setEmailErrorMessage('Email sai định dạng')
        } else {
            setEmailErrorMessage('')
        }
    }
    const showUsernameErrorMessage = (_username) => {
        if (_username.length === 0) {
            setusernameErrorMessage('Tên đăng nhập không được trống')
        } else {
            setusernameErrorMessage('')
        }
    }
    const showPhonenumberErrorMessage = (_phone) => {
        if (Auth.isValidPhone(_phone) === false) {
            setPhoneErrorMessage('Số điện thoại không đúng')
        } else if (_phone.length !== 10) {
            setPhoneErrorMessage('Số điện thoại phải đủ 10 chữ số')
        } else {
            setPhoneErrorMessage('')
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
    const handleCheckUsername = async (_username) => {
        try {
            console.log(res)
            const res = await axios({
                method: 'get',
                url: API_URL.API_URL + '/checkUsername?username=' + _username,
            })
            console.log(res.status)
            if (res.data.status === 'SUCCESS') {
                console.log('OK')
            }
        } catch (error) {
            setusernameErrorMessage('Tên đăng nhập đã được sử dụng!')
        }
    }
    const handleSignup = async () => {
        try {
            if (!username || !password || !email || !phone || !fullname) {
                Toast.show({
                    type: 'warning',
                    text1: 'Cảnh báo',
                    text2: 'Vui lòng nhập đầy đủ thông tin!',
                    visibilityTime: 2500,
                })
                return
            } else if (isChecked === false) {
                Toast.show({
                    type: 'warning',
                    text1: 'Cảnh báo',
                    text2: 'Vui lòng đồng ý với các điều khoản!',
                    visibilityTime: 2500,
                })

                return
            }
            setButtonPress(true)
            await signUpApi(
                type,
                fullname,
                email,
                username,
                password,
                phone
            ).then((res) => {
                if (res.data.status === 'SUCCESS') {
                    Toast.show({
                        type: 'success',
                        text1: 'Thành công',
                        text2: 'Đăng ký thành công',
                        visibilityTime: 2500,
                        autoHide: true,
                        onHide: () => {

                            navigation.navigate('BottomTabNavigation')
                        },
                    })
                    setButtonPress(false)
                }
            })
        } catch (error) {
            console.log('API Error:', error)
            Toast.show({
                type: 'error',
                text1: 'Thất bại',
                text2: 'Đăng ký thất bại!',
                visibilityTime: 2500,
            })
            setButtonPress(false)
        }
    }

    return (
        <KeyboardAvoidingView
            style={{
                flex: 1,
                flexDirection: 'column',
                justifyContent: 'center',
                backgroundColor: '#fff',
                paddingTop: 15,
            }}
            behavior="padding"
        >
            <ToastAlert/>
            <ScrollView style={{zIndex:1}} >
                <View style={{ flex: 1, marginHorizontal: 22 }}>
                    <View style={{ marginVertical: 22 }}>
                        <Text
                            style={{
                                fontSize: 22,
                                fontWeight: 'bold',
                                marginVertical: 12,
                                color: COLORS.black,
                            }}
                        >
                            Đăng Ký
                        </Text>

                        <Text
                            style={{
                                fontSize: 16,
                                color: COLORS.black,
                            }}
                        >
                            Vui lòng điền đầy đủ thông tin!
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
                            Họ tên{' '}
                        </Text>
                        <CustomInput
                            onChangeText={(fullname) => {
                                setFullname(fullname)
                                showFullNameError(fullname)
                            }}
                            placeholder="Nhập họ tên của bạn"
                            error={fullnameErrorMessage.length !== 0}
                            errorMessage={fullnameErrorMessage}
                        />
                    </View>
                    <View>
                        <Text
                            style={{
                                fontSize: 16,
                                fontWeight: 400,
                                marginVertical: 8,
                            }}
                        >
                            Email
                        </Text>

                        <CustomInput
                            onChangeText={(email) => {
                                setEmail(email)
                                showEmailMessage(email)
                            }}
                            placeholder="Nhập email của bạn"
                            error={emailErrorMessage.length !== 0}
                            errorMessage={emailErrorMessage}
                        />
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

                                handleCheckUsername(username)
                                showUsernameErrorMessage(username)
                            }}
                            placeholder="Nhập tên đăng nhập của bạn"
                            error={usernameErrorMessage.length !== 0}
                            errorMessage={usernameErrorMessage}
                        />
                    </View>
                    <View>
                        <Text
                            style={{
                                fontSize: 16,
                                fontWeight: 400,
                                marginVertical: 8,
                            }}
                        >
                            Số điện thoại
                        </Text>

                        <CustomInput
                            keyboardType={'numeric'}
                            onChangeText={(phone) => {
                                setPhone(phone)
                                showPhonenumberErrorMessage(phone)
                            }}
                            placeholder="Nhập số điện thoại của bạn"
                            error={phoneErrorMessage.length !== 0}
                            errorMessage={phoneErrorMessage}
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

                    <View
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

                        <Text>Tôi đồng ý với các Điều khoản và Điều kiện</Text>
                    </View>
                    <CustomButton
                        onPress={() => handleSignup()}
                        title="ĐĂNG KÝ"
                        isLoading={ButtonPress}
                    />

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
                        <Text style={{ fontSize: 14 }}>Hoặc đăng ký với</Text>
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
                            Bạn đã có tài khoản
                        </Text>
                        <Pressable
                            onPress={() => navigation.navigate('LoginScreen')}
                        >
                            <Text
                                style={{
                                    fontSize: 16,
                                    color: COLORS.primary,
                                    fontWeight: 'bold',
                                    marginLeft: 6,
                                }}
                            >
                                Đăng nhập
                            </Text>
                        </Pressable>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    )
}

export default Signup
