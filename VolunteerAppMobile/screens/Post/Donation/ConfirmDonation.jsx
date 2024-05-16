import React, { useState, useEffect } from 'react'
import {
    View,
    Text,
    Dimensions,
    TouchableOpacity,
    FlatList,
    KeyboardAvoidingView,
    RefreshControl,
    SafeAreaView,
    TextInput,
    Alert, // Import TextInput
} from 'react-native'
import QRCode from 'react-native-qrcode-svg'
import { MaterialIcons, FontAwesome } from '@expo/vector-icons'
import { COLORS, FONTS, images } from '../../../constants'
import AsyncStoraged from '../../../services/AsyncStoraged'
import axios from 'axios'
import API_URL from '../../../config/config'
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message'
import { Image } from 'expo-image'
import { styles } from '../../Attendance/style/showQrStyle'
import ModalLoading from '../../../components/modal/ModalLoading'
import ToastAlert from '../../../components/modal/ToastAlert'

function ConfirmDonation({ navigation, route }) {
    const { postId, donationId } = route.params
    const screenWidth = Dimensions.get('window').width
    const [token, setToken] = useState('')
    const [showSearchInput, setShowSearchInput] = useState(false)
    const [searchKeyword, setSearchKeyword] = useState('')
    const [showLoading, setShowLoading] = useState(false)
    const [data, setData] = useState([])
    const backgroundColors = {
        'Sách vở': '#F0F0F0',
        'Đồ dùng cũ': '#D9E6FF',
        'Đồ ăn': '#FFE8E5',
        'Quần áo': '#FFF7CD',
        'Đồ chơi': '#D5E8D4',
        Thuốc: '#F9E2D2',
        'Đồ dùng học tập': '#F6D6FF',
        'Thực phẩm khô': '#FFDAB9',
    }
    const renderItem = (item) => (
        <View
            style={{
                backgroundColor: backgroundColors[item],
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 12,
                borderRadius: 16,
                padding: 5,
                marginBottom: 12,
            }}
        >
            {item === 'Sách vở' ? (
                <Image
                    source={images.book}
                    style={{
                        height: 30,
                        width: 30,
                        marginRight: 15,
                    }}
                />
            ) : item === 'Đồ dùng cũ' ? (
                <Image
                    source={images.dishes}
                    style={{
                        height: 30,
                        width: 30,
                        marginRight: 15,
                    }}
                />
            ) : item === 'Đồ ăn' ? (
                <Image
                    source={images.food}
                    style={{
                        height: 30,
                        width: 30,
                        marginRight: 15,
                    }}
                />
            ) : item === 'Quần áo' ? (
                <Image
                    source={images.cloth}
                    style={{
                        height: 30,
                        width: 30,
                        marginRight: 15,
                    }}
                />
            ) : item === 'Đồ chơi' ? (
                <Image
                    source={images.toy}
                    style={{
                        height: 30,
                        width: 30,
                        marginRight: 15,
                    }}
                />
            ) : item === 'Thuốc' ? (
                <Image
                    source={images.medicine}
                    style={{
                        height: 30,
                        width: 30,
                        marginRight: 15,
                    }}
                />
            ) : item === 'Đồ dùng học tập' ? (
                <Image
                    source={images.stationery}
                    style={{
                        height: 30,
                        width: 30,
                        marginRight: 15,
                    }}
                />
            ) : (
                <Image
                    source={images.noodles}
                    style={{
                        height: 30,
                        width: 30,
                        marginRight: 15,
                    }}
                />
            )}
            <Text
                style={{
                    fontSize: 14,
                    fontWeight: '500',
                }}
            >
                {item}
            </Text>
        </View>
    )
    useEffect(() => {
        getToken()
    }, [])

    const getToken = async () => {
        const token = await AsyncStoraged.getToken()
        setToken(token)
    }
    const getListJoin = async () => {
        const config = {
            headers: {
                Authorization: token,
            },
        }
        try {
            const response = await axios.get(
                API_URL.API_URL + '/donation/join/' + donationId,
                config
            )

            if (response.data.status === 'SUCCESS') {
                setData(response.data.data)
            }
        } catch (error) {
            console.log('API Error get join:', error)
        }
    }
    useEffect(() => {
        getListJoin()
    }, [token])
    data.sort((a, b) => {
        if (a.join.isAttended !== b.join.isAttended) {
            // Nếu isAttended khác nhau, sắp xếp false trước
            return a.join.isAttended ? 1 : -1
        } else {
            // Nếu isAttended giống nhau, sắp xếp theo thời gian
            return new Date(a.join.timeSend) - new Date(b.join.timeSend)
        }
    })

    function formatTime(dateTimeString) {
        const date = new Date(dateTimeString)
        const day = date.getDate().toString().padStart(2, '0')
        const month = (date.getMonth() + 1).toString().padStart(2, '0')
        const year = date.getFullYear()

        return `${day}/${month}/${year}`
    }
    function isDateBeforeNow(dateString) {
        // Chuyển đổi dateString thành đối tượng Date
        const date = new Date(dateString)
        // So sánh date với ngày hiện tại
        return date < new Date()
    }
    const handleSearchInputChange = (text) => {
        setSearchKeyword(text)
    }
    const filteredData = data.filter((item) =>
        item.username.toLowerCase().includes(searchKeyword.toLowerCase())
    )
    const toggleSearchInput = () => {
        setShowSearchInput(!showSearchInput)
    }
    const confirm = (userId) => {
        Alert.alert('Thông báo', 'Bạn chắc chắn muốn xác nhận quyên góp?', [
            {
                text: 'Hủy',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
            },
            {
                text: 'Đồng ý',
                onPress: () => {
                    handleConfirm(userId)
                },
            },
        ])
    }
    const handleConfirm = async (userId) => {
        setShowLoading(true)
        try {
            const res = await axios({
                method: 'post',
                url: API_URL.API_URL + '/donation/attendance/' + postId,
                headers: {
                    Authorization: token,
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                data: {
                    userId: userId,
                },
            })
            if (res.data.status === 'SUCCESS') {
                setShowLoading(false)
                Toast.show({
                    type: 'success',
                    text1: 'Thành công',
                    text2: 'Xác nhận thành công',
                    visibilityTime: 2500,
                    autoHide: true,
                })
                getListJoin()
            }
        } catch (error) {
            if (error) {
                console.log('API Donate Error:', error)
                setShowLoading(false)
                Toast.show({
                    type: 'error',
                    text1: 'Thất bại',
                    text2: 'Xác nhận thất bại',
                    visibilityTime: 2500,
                    topOffset: 10,
                })
            }
        }
    }
    return (
        <SafeAreaView KeyboardAvoidingView style={styles.header}>
            <ModalLoading visible={showLoading} />
            <ToastAlert />
            <View style={styles.view}>
                <TouchableOpacity
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        paddingVertical: 7,
                        marginHorizontal: 12,
                    }}
                    onPress={() => {
                        showSearchInput
                            ? setShowSearchInput(false)
                            : navigation.goBack()
                    }}
                >
                    {showSearchInput ? (
                        <MaterialIcons
                            name="keyboard-arrow-left"
                            size={30}
                            color={COLORS.black}
                        />
                    ) : (
                        <MaterialIcons
                            name="keyboard-arrow-left"
                            size={30}
                            color={COLORS.black}
                        />
                    )}
                    {showSearchInput ? null : (
                        <Text
                            style={{
                                ...FONTS.body5,
                                fontSize: 18,
                                marginLeft: 10,
                            }}
                        >
                            Xác nhận quyên góp
                        </Text>
                    )}
                </TouchableOpacity>

                {showSearchInput ? (
                    <View style={styles.searchInput}>
                        <MaterialIcons
                            name="search"
                            size={30}
                            color={'#cccc'}
                            style={{ paddingLeft: 10, borderRadius: 30 }}
                        />
                        <TextInput
                            placeholder="Nhập từ khóa tìm kiếm"
                            style={{
                                marginLeft: 10,
                            }}
                            onChangeText={handleSearchInputChange}
                        />
                    </View>
                ) : (
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={toggleSearchInput}
                    >
                        <MaterialIcons
                            name="search"
                            size={30}
                            color={COLORS.black}
                            style={{ marginRight: 8 }}
                        />
                    </TouchableOpacity>
                )}
            </View>
            <FlatList
                onEndReachedThreshold={0.4}
                showsVerticalScrollIndicator={false}
                data={filteredData}
                renderItem={({ item, index }) => (
                    <View
                        key={index}
                        style={{
                            flexDirection: 'column',
                            justifyContent: 'center',
                            backgroundColor: '#F8F8F8',
                            width: screenWidth - 35,
                            marginHorizontal: 12,
                            marginTop: 15,
                            borderRadius: 15,
                            padding: 10,
                        }}
                        activeOpacity={0.8}
                    >
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                            }}
                        >
                            <View
                                style={{
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                }}
                            >
                                <Image
                                    source={
                                        item.avatar
                                            ? item.avatar
                                            : images.noneAvatar
                                    }
                                    style={{
                                        width: 90,
                                        height: 90,
                                        borderRadius: 15,
                                    }}
                                />
                                {!item.join.isAttended ? (
                                    isDateBeforeNow(item.join.timeSend) ? (
                                        <View
                                            style={{
                                                flexDirection: 'row',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                marginTop: 10,
                                            }}
                                        >
                                            <FontAwesome
                                                name="calendar-times-o"
                                                size={15}
                                                color={COLORS.primary}
                                            />
                                            <Text
                                                style={{
                                                    fontSize: 15,

                                                    marginLeft: 5,
                                                    fontWeight: '500',
                                                    color: COLORS.primary,
                                                }}
                                            >
                                                Đã quá hạn
                                            </Text>
                                        </View>
                                    ) : null
                                ) : null}
                            </View>
                            <View
                                style={{
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    marginLeft: 12,
                                    width: screenWidth - 35 - 115,
                                }}
                            >
                                <Text
                                    style={{
                                        fontSize: 15,
                                    }}
                                >
                                    Người gửi:{' '}
                                    <Text
                                        style={{
                                            fontSize: 15,
                                            marginLeft: 12,
                                            marginTop: 15,
                                            fontWeight: '700',
                                            color: COLORS.primary,
                                        }}
                                    >
                                        {item.username}
                                    </Text>
                                </Text>
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        flexWrap: 'wrap',
                                        marginTop: 15,
                                    }}
                                >
                                    {item.join.donateItem
                                        .split(', ')
                                        .map((item, index) => (
                                            <React.Fragment key={index}>
                                                {renderItem(item)}
                                            </React.Fragment>
                                        ))}
                                </View>
                                <Text
                                    style={{
                                        fontSize: 13,
                                    }}
                                >
                                    Ngày gửi:{' '}
                                    <Text style={styles.date}>
                                        {!item.join.isAttended
                                            ? isDateBeforeNow(
                                                  item.join.timeSend
                                              )
                                                ? `${formatTime(
                                                      item.join.timeSend
                                                  )} (Đã quá hạn)`
                                                : formatTime(item.join.timeSend)
                                            : formatTime(item.join.timeSend)}
                                    </Text>
                                </Text>
                                <Text
                                    style={{
                                        marginTop: 15,
                                        fontSize: 13,
                                    }}
                                >
                                    Số lượng:{' '}
                                    <Text style={styles.date}>
                                        {item.join.quantity}
                                    </Text>
                                </Text>
                            </View>
                        </View>
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-around',
                                marginTop: 10,
                            }}
                        >
                            {item.join.isAttended ? (
                                <View
                                    activeOpacity={0.8}
                                    style={{
                                        backgroundColor: '#ccc',
                                        height: 40,
                                        width: '100%',
                                        borderRadius: 16,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexDirection: 'row',
                                    }}
                                    onPress={() =>
                                        confirm(item.join.donationId)
                                    }
                                >
                                    <Text
                                        style={{
                                            fontFamily: 'monterrat',
                                            color: COLORS.black,
                                        }}
                                    >
                                        ĐÃ XÁC NHẬN
                                    </Text>
                                </View>
                            ) : (
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    style={{
                                        backgroundColor: COLORS.primary,
                                        height: 40,
                                        width: '100%',
                                        borderRadius: 16,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexDirection: 'row',
                                    }}
                                    onPress={() => confirm(item.join.userId)}
                                >
                                    <Text
                                        style={{
                                            fontFamily: 'monterrat',
                                            color: COLORS.white,
                                        }}
                                    >
                                        XÁC NHẬN
                                    </Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                )}
            />
        </SafeAreaView>
    )
}

export default ConfirmDonation
