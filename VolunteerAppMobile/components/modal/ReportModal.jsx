import React, { useEffect, useState, useRef } from 'react'
import {
    Text,
    View,
    TouchableOpacity,
    FlatList,
    TextInput,
    TouchableWithoutFeedback,
    Keyboard,
} from 'react-native'
import Modal from 'react-native-modal'
import { AntDesign, Ionicons, MaterialIcons } from '@expo/vector-icons'
import { COLORS } from '../../constants'
import { Image } from 'expo-image'
import axios from 'axios'
import AsyncStoraged from '../../services/AsyncStoraged'
import API_URL from '../../config/config'
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message'
import * as ImagePicker from 'expo-image-picker'
import ModalLoading from './ModalLoading'
import Checkbox from 'expo-checkbox'
import CustomButton from '../custom/CustomButton'
import ToastAlert from './ToastAlert'

const ReportModal = ({ visible, onRequestClose, orgId }, ref) => {
    const [text, setText] = useState('')
    const [showLoading, setShowLoading] = useState(false)
    const [token, setToken] = useState('')
    const [keyboard, setKeyBoard] = useState(true)
    const [selectedImages, setSelectedImage] = useState([])
    const [isChecked, setIsChecked] = useState(false)
    const handleImageSelection = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: true,
            aspect: [5, 5],
            quality: 1,
        })

        delete result.cancelled
        if (result.cancelled) {
            return
        }
        if (Array.isArray(selectedImages)) {
            setSelectedImage([...selectedImages, ...result.assets])
        } else {
            setSelectedImage(result.assets)
        }
    }

    useEffect(() => {
        setText('')
        setSelectedImage()
        setKeyBoard(true)
    }, [visible])
    const getToken = async () => {
        const token = await AsyncStoraged.getToken()
        setToken(token)
    }
    useEffect(() => {
        getToken()
    }, [])
    const formData = new FormData()
    const createGroup = async () => {
        setShowLoading(true)
        if (!selectedImages || !text || !activityId) {
            Toast.show({
                type: 'warning',
                text1: 'Cảnh báo',
                text2: 'Nhập đầy đủ thông tin và ảnh',
                visibilityTime: 2500,
            })
            setShowLoading(false)
            return
        }
        setKeyBoard(false)
        selectedImages.forEach((avatar, index) => {
            formData.append('avatar', {
                uri: avatar.uri,
                type: 'image/jpeg',
                name: avatar.fileName,
            })
        })
        formData.append('activityId', activityId)
        formData.append('name', text)
        axios
            .post(API_URL.API_URL + '/group', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: token,
                },
            })
            .then((response) => {
                if (response.data.status === 'SUCCESS') {
                    setShowLoading(false)
                    setKeyBoard(true)
                    Toast.show({
                        type: 'success',
                        text1: 'Thành công',
                        text2: 'Tạo nhóm thành công',
                        visibilityTime: 2500,
                        autoHide: true,
                        onHide: onRequestClose,
                    })
                }
            })
            .catch((error) => {
                console.log('API Error:', error)
                setShowLoading(false)
                setKeyBoard(true)
                Toast.show({
                    type: 'error',
                    text1: 'Thất bại',
                    text2: 'Tạo nhóm thất bại!',
                    visibilityTime: 2500,
                })
            })
    }
    function removeImage(item) {
        const newList = selectedImages.filter((listItem) => listItem !== item)
        setSelectedImage(newList)
    }
    const reportOrg = async () => {
        setShowLoading(true)
        Keyboard.dismiss()
        if (!selectedImages || !text || !orgId) {
            setShowLoading(false)
            Toast.show({
                type: 'warning',
                text1: 'Cảnh báo',
                text2: 'Vui lòng nhập đầy đủ thông tin!',
                visibilityTime: 2500,
            })
            return
        }
        if (!isChecked) {
            setShowLoading(false)
            Toast.show({
                type: 'warning',
                text1: 'Cảnh báo',
                text2: 'Vui lòng đồng ý với các điều khoản!',
                visibilityTime: 2500,
            })
            return
        }
        const formData = new FormData()
        selectedImages.forEach((images, index) => {
            formData.append('images', {
                uri: images.uri,
                type: 'image/jpeg',
                name: images.fileName,
            })
        })

        formData.append('orgId', orgId)
        formData.append('content', text)

        axios
            .post(API_URL.API_URL + '/user/report', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: token,
                },
            })
            .then((response) => {
                if (response.data.status === 'SUCCESS') {
                    Toast.show({
                        type: 'success',
                        text1: 'Thành công',
                        text2: 'Báo cáo tài khoản thành công',
                        visibilityTime: 3500,
                        autoHide: true,
                        onHide: () => {
                            onRequestClose()
                        },
                    })
                    setShowLoading(false)
                }
            })
            .catch((error) => {
                console.log('API Error:', error)
                setShowLoading(false)
                Toast.show({
                    type: 'error',
                    text1: 'Thất bại',
                    text2: 'Báo cáo tài khoản thất bại!',
                    visibilityTime: 2500,
                })
            })
    }
    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <Modal
                animationType="fade"
                visible={visible}
                onRequestClose={onRequestClose}
                customBackdrop={
                    <TouchableWithoutFeedback onPress={onRequestClose}>
                        <View
                            style={{
                                flex: 1,
                            }}
                        />
                    </TouchableWithoutFeedback>
                }
                avoidKeyboard={keyboard}
                style={{
                    margin: 0,
                    justifyContent: 'center',
                    backgroundColor: 'rgba(0, 0, 0, 0.4)',
                }}
            >
                <ModalLoading visible={showLoading} />
                <ToastAlert/>
                <View
                    style={{
                        backgroundColor: '#fff',
                        borderRadius: 25,
                        margin: 10,
                        paddingBottom: 30,
                    }}
                >
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            borderBottomWidth: 1,
                            padding: 15,
                            borderBottomColor: '#cccc',
                            zIndex: 2,
                        }}
                    >
                        <TouchableOpacity
                            onPress={onRequestClose}
                            activeOpacity={0.8}
                        >
                            <Ionicons name="chevron-back-sharp" size={20} />
                        </TouchableOpacity>
                        <Text style={{ fontWeight: 'bold', fontSize: 19 }}>
                            Báo cáo tài khoản
                        </Text>
                        <View onPress={createGroup} activeOpacity={0.8}>
                            <Text
                                style={{
                                    fontWeight: '600',
                                    fontSize: 18,
                                    color: COLORS.white,
                                }}
                            >
                                Gửi
                            </Text>
                        </View>
                    </View>

                    <View
                        style={{
                            marginTop: 15,
                            marginHorizontal: 20,
                        }}
                    >
                        <TouchableOpacity
                            onPress={handleImageSelection}
                            activeOpacity={0.8}
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderWidth: 0.5,
                                padding: 10,
                                borderRadius: 999,
                                borderColor: '#ccc',
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 15,
                                    fontWeight: '500',
                                    marginRight: 10,
                                }}
                            >
                                Cung cấp hình ảnh cho báo cáo của bạn
                            </Text>
                            <AntDesign name="upload" size={20} />
                        </TouchableOpacity>
                        <Text
                            style={{
                                fontSize: 12,
                                marginTop: 5,
                            }}
                        >
                            * Lưu ý, vui lòng cung cấp hình ảnh rõ nét và đúng
                            sự thật
                        </Text>
                    </View>
                    <FlatList
                        data={selectedImages}
                        showsHorizontalScrollIndicator={false}
                        horizontal={true}
                        renderItem={({ item, index }) => (
                            <View
                                key={index}
                                style={{
                                    position: 'relative',
                                    flexDirection: 'column',
                                    flex: 1,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginTop: 10,
                                }}
                            >
                                <Image
                                    source={{ uri: item.uri }}
                                    style={{
                                        paddingVertical: 4,
                                        marginLeft: 12,
                                        width: 120,
                                        height: 120,
                                        borderRadius: 12,
                                    }}
                                />
                                <TouchableOpacity
                                    onPress={() => removeImage(item)}
                                    style={{
                                        position: 'absolute',
                                        top: 0,
                                        right: 0,
                                    }}
                                >
                                    <AntDesign
                                        size={18}
                                        name="closecircle"
                                        color={'#ccc'}
                                    />
                                </TouchableOpacity>
                            </View>
                        )}
                    />
                    <View
                        style={{
                            flexDirection: 'row',
                            marginHorizontal: 8,
                            paddingTop: 18,
                            borderTopWidth: 1,
                            borderTopColor: '#FFF',
                        }}
                    >
                        <View
                            style={{
                                flex: 1,
                                height: 100,
                                borderRadius: 15,
                                backgroundColor: '#F0F0F0',
                                marginHorizontal: 12,
                                paddingHorizontal: 12,
                                justifyContent: 'space-between',
                                flexDirection: 'row',
                                alignItems: 'center',
                            }}
                        >
                            <TextInput
                                placeholder={'Nội dung báo cáo'}
                                placeholderTextColor="#696969"
                                value={text}
                                onChangeText={(text) => setText(text)}
                                multiline={true}
                            />
                            {!text ? null : (
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    onPress={() => setText('')}
                                >
                                    <AntDesign
                                        size={18}
                                        name="closecircle"
                                        color={'#ccc'}
                                    />
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                    <View
                        style={{
                            flexDirection: 'column',
                            marginHorizontal: 20,
                            marginTop: 10,
                        }}
                    >
                        <View
                            style={{
                                flexDirection: 'row',
                            }}
                        >
                            <Checkbox
                                style={{ marginRight: 8 }}
                                value={isChecked}
                                onValueChange={setIsChecked}
                                color={isChecked ? COLORS.primary : undefined}
                            />

                            <Text>Tôi đồng ý</Text>
                        </View>
                        <View>
                            <Text
                                style={{
                                    fontSize: 12,
                                    color: '#696969',
                                    marginTop: 5,
                                }}
                            >
                                1. Bằng việc gửi báo cáo này, tôi xác nhận những
                                thông tin đã cung cấp là chính xác.
                            </Text>
                            <Text
                                style={{
                                    fontSize: 12,
                                    color: '#696969',
                                    marginTop: 5,
                                }}
                            >
                                2. Tôi hiểu rằng việc cung cấp thông tin sai sự
                                thật có thể dẫn đến việc đình chỉ hoặc tạm ngưng
                                các dịch vụ cho tài khoản của tôi.
                            </Text>
                            <Text
                                style={{
                                    fontSize: 12,
                                    color: '#696969',
                                    marginTop: 5,
                                }}
                            >
                                3. Tôi hiểu rằng tiến độ xử lý có thể chậm trễ
                                nếu thông tin cung cấp qua biểu mẫu không chính
                                xác.
                            </Text>
                            <Text
                                style={{
                                    fontSize: 12,
                                    color: '#696969',
                                    marginTop: 5,
                                }}
                            >
                                4. Chúng tôi có thể chia sẻ phản hồi của bạn (
                                bao gồm các hình ảnh và mô tả) với các bên liên
                                quan nhằm mục đích kiểm tra báo cáo của bạn. Vui
                                lòng không đăng tải bất kỳ thông tin cá nhân
                                nào.
                            </Text>
                        </View>
                    </View>
                    <View style={{ marginHorizontal: 20, marginTop: 10 }}>
                        <CustomButton
                            onPress={reportOrg}
                            title="Gửi thông tin"
                        />
                    </View>
                </View>
            </Modal>
        </TouchableWithoutFeedback>
    )
}

export default ReportModal
