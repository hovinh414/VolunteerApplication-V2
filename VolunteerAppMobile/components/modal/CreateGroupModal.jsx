import React, { useEffect, useState, useRef } from 'react'
import {
    Text,
    View,
    TouchableOpacity,
    FlatList,
    TextInput,
    TouchableWithoutFeedback,
} from 'react-native'
import Modal from 'react-native-modal'
import { AntDesign, Ionicons } from '@expo/vector-icons'
import { COLORS } from '../../constants'
import { Image } from 'expo-image'
import axios from 'axios'
import AsyncStoraged from '../../services/AsyncStoraged'
import API_URL from '../../config/config'
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message'
import * as ImagePicker from 'expo-image-picker'
import ModalLoading from './ModalLoading'
import ToastAlert from './ToastAlert'

const picture = '../../assets/picture.png'
const CreateGroupModal = ({ visible, onRequestClose, activityId }, ref) => {
    const [text, setText] = useState('')
    const [showLoading, setShowLoading] = useState(false)
    const [token, setToken] = useState('')
    const [keyboard, setKeyBoard] = useState(true)
    const [selectedImages, setSelectedImage] = useState([])
    const handleImageSelection = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            aspect: [5, 5],
            quality: 1,
        })
        delete result.cancelled
        if (!result.canceled) {
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
    return (
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
                        <Text
                            style={{
                                fontWeight: '500',
                                fontSize: 18,
                                color: COLORS.blue,
                            }}
                        >
                            Hủy
                        </Text>
                    </TouchableOpacity>
                    <Text style={{ fontWeight: 'bold', fontSize: 19 }}>
                        Tạo nhóm
                    </Text>
                    <TouchableOpacity onPress={createGroup} activeOpacity={0.8}>
                        <Text
                            style={{
                                fontWeight: '600',
                                fontSize: 18,
                                color: COLORS.blue,
                            }}
                        >
                            Xong
                        </Text>
                    </TouchableOpacity>
                </View>

                <View
                    style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginTop: 15,
                    }}
                >
                    <TouchableOpacity
                        onPress={handleImageSelection}
                        activeOpacity={0.8}
                    >
                        {!selectedImages ? null : (
                            <TouchableOpacity
                                style={{
                                    position: 'absolute',
                                    right: 0,
                                    zIndex: 2,
                                }}
                                activeOpacity={0.8}
                                onPress={() => setSelectedImage()}
                            >
                                <AntDesign
                                    size={20}
                                    name="closecircle"
                                    color={'#ccc'}
                                />
                            </TouchableOpacity>
                        )}
                        <Image
                            source={
                                selectedImages
                                    ? selectedImages
                                    : require(picture)
                            }
                            style={{
                                width: 90,
                                height: 90,
                                borderRadius: '50%',
                            }}
                        />
                    </TouchableOpacity>

                    <Text
                        style={{
                            marginTop: 10,
                            fontSize: 15,
                            fontWeight: '500',
                        }}
                    >
                        Chọn ảnh đại diện nhóm
                    </Text>
                </View>
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
                            height: 52,
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
                            style={{ height: '100%', width: '90%' }}
                            placeholder={'Tên nhóm'}
                            placeholderTextColor="#CCC"
                            value={text}
                            onChangeText={(text) => setText(text)}
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
            </View>
        </Modal>
    )
}

export default CreateGroupModal
