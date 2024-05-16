import React, { useEffect, useState, useRef } from 'react'
import {
    Text,
    View,
    TouchableOpacity,
    FlatList,
    TouchableWithoutFeedback,
    Alert,
} from 'react-native'
import Modal from 'react-native-modal'
import { Feather, Ionicons } from '@expo/vector-icons'
import { COLORS } from '../../constants'
import * as Animatable from 'react-native-animatable'
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message'
import ModalLoading from './ModalLoading'
import axios from 'axios'
import API_URL from '../../config/config'
import ToastAlert from './ToastAlert'
const LockModal = (
    { visible, onRequestClose, ownerId, userId, type, donationId, token },
    ref
) => {
    const [isReasonsVisible, setIsReasonsVisible] = useState(false)
    const [selectedReason, setSelectedReason] = useState(null)
    const [showLoading, setShowLoading] = useState(false)
    const reasons = [
        'Bài viết đã đủ số lượng quyên góp',
        'Bài viết đủ số người tham gia',
        'Bài viết đã hết hạn đăng ký',
    ]
    const toggleReasonsVisibility = () => {
        setSelectedReason(null)
        setIsReasonsVisible(!isReasonsVisible)
    }

    const handleReasonSelection = (index) => {
        setSelectedReason(index)
    }

    const handleLockPost = async () => {
        setShowLoading(true)
        try {
            const res = await axios({
                method: 'put',
                url: API_URL.API_URL + '/post/lock',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    Authorization: token,
                },
                data: {
                    donationId: donationId,
                    reasonLock: selectedReason,
                },
            })
            if (res.data.status === 'SUCCESS') {
                setShowLoading(false)
                console.log(res.data.message)
                Toast.show({
                    type: 'success',
                    text1: 'Thành công',
                    text2: 'Đóng bài thành công',
                    visibilityTime: 2500,
                    autoHide: true,
                    onHide: onRequestClose,
                })
                toggleReasonsVisibility()
            }
        } catch (error) {
            if (error) {
                console.log('API lock post Error:', error)
                setShowLoading(false)
                Toast.show({
                    type: 'error',
                    text1: 'Thất bại',
                    text2: 'Đóng bài thất bại',
                    visibilityTime: 2500,
                    topOffset: 10,
                })
            }
        }
    }
    const confirm = () => {
        if (!selectedReason) {
            Toast.show({
                type: 'warning',
                text1: 'Cảnh báo',
                text2: 'Chọn lý do đóng bài!',
                visibilityTime: 2500,
                autoHide: true,
                onHide: onRequestClose,
            })
        } else {
            Alert.alert('Thông báo', 'Bạn chắc chắn muốn đóng bài viết?', [
                {
                    text: 'Hủy',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
                {
                    text: 'Đồng ý',
                    onPress: () => {
                        handleLockPost()
                    },
                },
            ])
        }
    }
    return (
        <Modal
            animationType="slide"
            visible={visible}
            onRequestClose={onRequestClose}
            customBackdrop={
                <TouchableWithoutFeedback onPress={onRequestClose}>
                    <View style={{ flex: 1 }} />
                </TouchableWithoutFeedback>
            }
            avoidKeyboard={true}
            style={{
                margin: 0,
                justifyContent: 'flex-end',
                flex: 1,
                // backgroundColor: 'rgba(0, 0, 0, 0.1)',
                borderRadius: 25,
            }}
        >
            <ModalLoading visible={showLoading} />
            <ToastAlert />
            <View
                style={{
                    width: '100%',
                    backgroundColor: '#fff',
                    borderTopLeftRadius: 25,
                    borderTopRightRadius: 25,
                    paddingBottom: 30,
                    backgroundColor: '#DCDCDC',
                }}
            >
                {/* <TouchableOpacity
                    onPress={onRequestClose}
                    style={{
                        position: 'absolute',
                        top: 10,
                        right: 10,
                        zIndex: 3,
                    }}
                >
                    <Feather name="x" size={26} color={COLORS.black} />
                </TouchableOpacity> */}
                <View
                    style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <Feather name="minus" size={55} color={COLORS.black} />
                </View>
                {ownerId === userId ? (
                    <>
                        <TouchableOpacity
                            style={{
                                backgroundColor: '#C8C8C8',
                                flexDirection: 'row',
                                alignItems: 'center',
                                marginHorizontal: 20,
                                borderTopLeftRadius: 20,
                                borderTopRightRadius: 20,
                            }}
                            activeOpacity={0.8}
                            onPress={toggleReasonsVisibility}
                        >
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    paddingVertical: 15,
                                }}
                            >
                                <Feather
                                    name="pocket"
                                    size={28}
                                    color={COLORS.black}
                                    style={{ marginLeft: 10 }}
                                />

                                <View
                                    style={{
                                        marginLeft: 12,
                                        flexDirection: 'column',
                                        justifyContent: 'space-between',
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontSize: 16,
                                            fontWeight: 'bold',
                                            marginBottom: 5,
                                        }}
                                    >
                                        Đóng bài viết
                                    </Text>
                                    <Text
                                        style={{
                                            fontSize: 12,
                                            fontWeight: '500',
                                        }}
                                    >
                                        {isReasonsVisible
                                            ? 'Chọn lý do đóng bài viết'
                                            : 'Bài viết sẽ bị đóng và không thể tham gia các hoạt động'}
                                    </Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                        <Animatable.View
                            animation={
                                isReasonsVisible ? 'slideInLeft' : 'slideOutUp'
                            }
                            duration={200}
                            style={{
                                display: isReasonsVisible ? 'flex' : 'none',
                            }}
                        >
                            <FlatList
                                data={reasons}
                                renderItem={({ item, index }) => (
                                    <TouchableOpacity
                                        style={{
                                            backgroundColor: '#f0f0f0',
                                            padding: 15,
                                            marginHorizontal: 20,
                                            borderBottomWidth: 1,
                                            borderColor: '#ccc',
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                        }}
                                        activeOpacity={0.8}
                                        onPress={() =>
                                            handleReasonSelection(item)
                                        }
                                    >
                                        <TouchableOpacity
                                            style={{
                                                width: 20,
                                                height: 20,
                                                borderRadius: 10,
                                                borderWidth: 1,
                                                borderColor: '#000',
                                                marginRight: 10,
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                            }}
                                            activeOpacity={0.8}
                                            onPress={() =>
                                                handleReasonSelection(item)
                                            }
                                        >
                                            {selectedReason === item && (
                                                <View
                                                    style={{
                                                        width: 10,
                                                        height: 10,
                                                        backgroundColor: '#000',
                                                        borderRadius: 5,
                                                    }}
                                                />
                                            )}
                                        </TouchableOpacity>
                                        <Text>{item}</Text>
                                    </TouchableOpacity>
                                )}
                                keyExtractor={(item, index) => index.toString()}
                            />
                            <TouchableOpacity
                                style={{
                                    backgroundColor: '#f0f0f0',
                                    padding: 15,
                                    marginHorizontal: 20,
                                    borderBottomWidth: 1,
                                    borderColor: '#ccc',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                                onPress={confirm}
                                activeOpacity={0.8}
                            >
                                <Text
                                    style={{ fontSize: 16, fontWeight: 'bold' }}
                                >
                                    Xác nhận
                                </Text>
                            </TouchableOpacity>
                        </Animatable.View>
                        <TouchableOpacity
                            style={{
                                backgroundColor: '#C8C8C8',
                                flexDirection: 'row',
                                alignItems: 'center',
                                marginHorizontal: 20,
                                borderBottomLeftRadius: 20,
                                borderBottomRightRadius: 20,
                                marginBottom: 10,
                            }}
                            activeOpacity={0.8}
                        >
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    paddingVertical: 15,
                                }}
                            >
                                <Feather
                                    name="minus-circle"
                                    size={28}
                                    color={COLORS.black}
                                    style={{ marginLeft: 10 }}
                                />

                                <View
                                    style={{
                                        marginLeft: 12,
                                        flexDirection: 'column',
                                        justifyContent: 'space-between',
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontSize: 16,
                                            fontWeight: 'bold',
                                            marginBottom: 5,
                                        }}
                                    >
                                        Ẩn bài viết
                                    </Text>
                                    <Text
                                        style={{
                                            fontSize: 12,
                                            fontWeight: '500',
                                        }}
                                    >
                                        Bài viết sẽ bị ẩn ở trang Feed
                                    </Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </>
                ) : (
                    <>
                        <TouchableOpacity
                            style={{
                                backgroundColor: '#C8C8C8',
                                flexDirection: 'row',
                                alignItems: 'center',
                                marginHorizontal: 20,
                                borderTopLeftRadius: 20,
                                borderTopRightRadius: 20,
                            }}
                            activeOpacity={0.8}
                        >
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    paddingVertical: 15,
                                }}
                            >
                                <Feather
                                    name="bookmark"
                                    size={28}
                                    color={COLORS.black}
                                    style={{ marginLeft: 10 }}
                                />

                                <View
                                    style={{
                                        marginLeft: 12,
                                        flexDirection: 'column',
                                        justifyContent: 'space-between',
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontSize: 16,
                                            fontWeight: 'bold',
                                            marginBottom: 5,
                                        }}
                                    >
                                        Lưu bài viết
                                    </Text>
                                    <Text
                                        style={{
                                            fontSize: 12,
                                            fontWeight: '500',
                                        }}
                                    >
                                        Thêm vào danh sách các mục đã lưu
                                    </Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{
                                backgroundColor: '#C8C8C8',
                                flexDirection: 'row',
                                alignItems: 'center',
                                marginHorizontal: 20,
                                borderBottomLeftRadius: 20,
                                borderBottomRightRadius: 20,
                                marginBottom: 10,
                            }}
                            activeOpacity={0.8}
                        >
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    paddingVertical: 15,
                                }}
                            >
                                <Feather
                                    name="plus-circle"
                                    size={28}
                                    color={COLORS.black}
                                    style={{ marginLeft: 10 }}
                                />

                                <View
                                    style={{
                                        marginLeft: 12,
                                        flexDirection: 'column',
                                        justifyContent: 'space-between',
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontSize: 16,
                                            fontWeight: 'bold',
                                            marginBottom: 5,
                                        }}
                                    >
                                        Hiển thị thêm
                                    </Text>
                                    <Text
                                        style={{
                                            fontSize: 12,
                                            fontWeight: '500',
                                        }}
                                    >
                                        Bạn sẽ nhìn thấy nhiều bài viết tương tự
                                        gợi ý
                                    </Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </>
                )}

                <>
                    <TouchableOpacity
                        style={{
                            backgroundColor: '#C8C8C8',
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginHorizontal: 20,
                            borderTopLeftRadius: 20,
                            borderTopRightRadius: 20,
                        }}
                        activeOpacity={0.8}
                    >
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                paddingVertical: 15,
                            }}
                        >
                            <Feather
                                name="bell"
                                size={28}
                                color={COLORS.black}
                                style={{ marginLeft: 10 }}
                            />

                            <View
                                style={{
                                    marginLeft: 12,
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                }}
                            >
                                <Text
                                    style={{
                                        fontSize: 16,
                                        fontWeight: 'bold',
                                        marginBottom: 5,
                                    }}
                                >
                                    Nhận thông báo về bài viết này
                                </Text>
                                <Text
                                    style={{
                                        fontSize: 12,
                                        fontWeight: '500',
                                    }}
                                >
                                    Chúng tôi sẽ thông báo khi có hoạt động về
                                    bài viết
                                </Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{
                            backgroundColor: '#C8C8C8',
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginHorizontal: 20,
                            borderBottomLeftRadius: 20,
                            borderBottomRightRadius: 20,
                        }}
                        activeOpacity={0.8}
                    >
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                paddingVertical: 15,
                            }}
                        >
                            <Feather
                                name="alert-circle"
                                size={28}
                                color={COLORS.black}
                                style={{ marginLeft: 10 }}
                            />

                            <View
                                style={{
                                    marginLeft: 12,
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                }}
                            >
                                <Text
                                    style={{
                                        fontSize: 16,
                                        fontWeight: 'bold',
                                        marginBottom: 5,
                                    }}
                                >
                                    Báo cáo ảnh
                                </Text>
                                <Text
                                    style={{
                                        fontSize: 12,
                                        fontWeight: '500',
                                    }}
                                >
                                    Ảnh vi phạm nội dung
                                </Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                </>
            </View>
        </Modal>
    )
}

export default LockModal
