import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
    Image,
    Modal,
} from 'react-native'
import React, { useState, useEffect } from 'react'
import { COLORS, FONTS } from '../../constants/theme'
import { MaterialIcons, Ionicons } from '@expo/vector-icons'
import CustomInputPassword from '../../components/custom/CustomInputPassword'
import Auth from '../Login/Auth'
import axios from 'axios'
import AsyncStoraged from '../../services/AsyncStoraged'
import CustomButton from '../../components/custom/CustomButton'
import API_URL from '../../config/config'
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message'
import ToastAlert from '../../components/modal/ToastAlert'

const ChangePassword = ({ navigation }) => {
    const [password, setPassword] = useState()
    const [newPassword, setNewPassword] = useState()
    const [passwordConfirm, setPasswordConfirm] = useState()
    const [passwordErrorMessage, setPasswordErrorMessage] = useState('')
    const [newPasswordErrorMessage, setNewPasswordErrorMessage] = useState('')
    const [newPasswordConfirmErrorMessage, setNewPasswordConfirmErrorMessage] =
        useState('')
    const [isPasswordShow, setIsPasswordShow] = useState(true)
    const [isNewPasswordShow, setIsNewPasswordShow] = useState(true)
    const [isConfirmPasswordShow, setIsConfirmPasswordShow] = useState(true)
    const [userId, setUserId] = useState()
    const [token, setToken] = useState()
    const [ButtonPress, setButtonPress] = useState('')
    const [showWarning, setShowWarning] = useState(false)
    const [type, setType] = useState('')

    const getUserStored = async () => {
        const userStored = await AsyncStoraged.getData()
        setUserId(userStored._id)
        setType(userStored.type)
    }
    const getToken = async () => {
        const token = await AsyncStoraged.getToken()
        setToken(token)
    }

    useEffect(() => {
        getToken()
    }, [])
    useEffect(() => {
        getUserStored()
    }, [])
    const onRefresh = () => {
        getToken()
        getUserStored()
    }
    function resetForm() {
        setNewPassword(null)
        setPassword(null)
        setPasswordConfirm(null)
    }
    const handleUpdatePassword = async () => {
        try {
            if (!password || !passwordConfirm || !newPassword) {
                Toast.show({
                    type: 'warning',
                    text1: 'Cảnh báo',
                    text2: 'Vui lòng nhập đầy đủ mật khẩu!',
                    visibilityTime: 2500,
                })
                return
            }
            setButtonPress(true)
            const res = await axios({
                method: 'put',
                url: API_URL.API_URL + '/user?userid=' + userId,
                headers: {
                    Authorization: token,
                },
                data: {
                    oldPassword: password,
                    password: passwordConfirm,
                },
            })

            if (res.data.status === 'SUCCESS') {
                Toast.show({
                    type: 'success',
                    text1: 'Thành công',
                    text2: 'Đổi mật khẩu thành công',
                    visibilityTime: 2500,
                })
                setButtonPress(false)
            }
        } catch (error) {
            console.log('API Error:', error)
            if (type === 'Organization') {
                Toast.show({
                    type: 'error',
                    text1: 'Thất bại',
                    text2: 'Thay đổi mật khẩu thất bại',
                    visibilityTime: 2500,
                    autoHide: true,
                    onHide: () => {
                        navigation.navigate('ProfileOrganisation')
                    },
                })
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Thất bại',
                    text2: 'Thay đổi mật khẩu thất bại',
                    visibilityTime: 2500,
                    autoHide: true,
                    onHide: () => {
                        navigation.navigate('Profile')
                    },
                })
            }
            setButtonPress(false)
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
    const showNewPasswordMessage = (_password) => {
        if (_password.length === 0) {
            setNewPasswordErrorMessage('Mật khẩu không được trống')
        } else if (Auth.isValidPassword(_password) === false) {
            setNewPasswordErrorMessage(
                'Mật khẩu bao gồm 8 ký tự, chữ in hoa và chữ số'
            )
        } else {
            setNewPasswordErrorMessage('')
        }
    }
    const showConfirmNewPasswordMessage = (_password, _newPassword) => {
        if (_password !== _newPassword) {
            setNewPasswordConfirmErrorMessage('Mật khẩu không trùng khớp')
        } else {
            setNewPasswordConfirmErrorMessage('')
        }
    }
    return (
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor: '#fff',
            }}
        >
            <ToastAlert/>
            <View
                style={{
                    marginHorizontal: 12,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    paddingTop: 22,
                    zIndex: 1,
                }}
            >
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={{
                        paddingTop: 19,
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

                <Text style={{ ...FONTS.h3 }}>Đổi mật khẩu</Text>
            </View>

            <ScrollView style={{ paddingHorizontal: 22 }}>
                <View
                    style={{
                        alignItems: 'center',
                        marginVertical: 22,
                    }}
                ></View>

                <View>
                    <View>
                        <Text
                            style={{
                                ...FONTS.h4,
                                fontSize: 16,
                                fontWeight: 400,
                                marginVertical: 8,
                            }}
                        >
                            <Text style={{ color: COLORS.primary }}>*</Text> Mật
                            khẩu hiện tại
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
                    <View>
                        <Text
                            style={{
                                ...FONTS.h4,
                                fontSize: 16,
                                fontWeight: 400,
                                marginVertical: 8,
                            }}
                        >
                            <Text style={{ color: COLORS.primary }}>*</Text> Mật
                            khẩu mới
                        </Text>

                        <CustomInputPassword
                            onChangeText={(newPassword) => {
                                setNewPassword(newPassword)
                                showNewPasswordMessage(newPassword)
                            }}
                            placeholder={'Nhập mật khẩu mới'}
                            error={newPasswordErrorMessage.length !== 0}
                            errorMessage={newPasswordErrorMessage}
                            secureTextEntry={isNewPasswordShow}
                            isPasswordShow={isNewPasswordShow}
                            onPress={() =>
                                isNewPasswordShow
                                    ? setIsNewPasswordShow(false)
                                    : setIsNewPasswordShow(true)
                            }
                        />
                    </View>
                </View>

                <View
                    style={{
                        paddingBottom: 12,
                    }}
                >
                    <Text
                        style={{
                            ...FONTS.h4,
                            fontSize: 16,
                            fontWeight: 400,
                            marginVertical: 8,
                        }}
                    >
                        <Text style={{ color: COLORS.primary }}>*</Text> Nhập
                        lại mật khẩu mới
                    </Text>

                    <CustomInputPassword
                        placeholder={'Nhập lại mật khẩu mới'}
                        onChangeText={(passwordConfirm) => {
                            setPasswordConfirm(passwordConfirm)
                            showConfirmNewPasswordMessage(
                                newPassword,
                                passwordConfirm
                            )
                        }}
                        error={newPasswordConfirmErrorMessage.length !== 0}
                        errorMessage={newPasswordConfirmErrorMessage}
                        secureTextEntry={isConfirmPasswordShow}
                        isPasswordShow={isConfirmPasswordShow}
                        onPress={() =>
                            isConfirmPasswordShow
                                ? setIsConfirmPasswordShow(false)
                                : setIsConfirmPasswordShow(true)
                        }
                    />
                </View>

                <CustomButton
                    onPress={() => handleUpdatePassword()}
                    title="ĐỔI MẬT KHẨU"
                    isLoading={ButtonPress}
                />
            </ScrollView>
        </SafeAreaView>
    )
}

export default ChangePassword
