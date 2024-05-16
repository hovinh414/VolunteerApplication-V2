import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Alert,
    Dimensions,
    Image,
    FlatList,
    Linking,
    RefreshControl,
} from 'react-native'
import QRCode from 'react-native-qrcode-svg'
import Modal from 'react-native-modal'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { COLORS, FONTS, SIZES } from '../../../constants/theme'
import * as Progress from 'react-native-progress'
import PopupMenu from '../../../components/menu/PopupMenu'
import {
    MaterialIcons,
    Feather,
    Ionicons,
    FontAwesome,
} from '@expo/vector-icons'
import CustomButton from '../../../components/custom/CustomButton'
import { friends, posts } from '../../../constants/data'
import { SliderBox } from 'react-native-image-slider-box'
import AsyncStoraged from '../../../services/AsyncStoraged'
import API_URL from '../../../config/config'
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message'
import { format } from 'date-fns'
import ModalLoading from '../../../components/modal/ModalLoading'
import CreateGroupModal from '../../../components/modal/CreateGroupModal'
import { getStatusBarHeight } from 'react-native-status-bar-height'
import ToastAlert from '../../../components/modal/ToastAlert'
import { styles } from '../style/detailStyle'

const DetailPost = ({ navigation, route }) => {
    const [items, setItems] = useState(route.params)
    const screenWidth = Dimensions.get('window').width
    const screenHeight = Dimensions.get('window').height
    const [type, setType] = useState('')
    const [email, setEmail] = useState('')
    const [showLoading, setShowLoading] = useState(false)
    const [orgId, setOrgId] = useState('')
    const [isModalVisible, setModalVisible] = useState(false)
    const [showCreate, setShowCreate] = useState(false)
    const [joinId, setJoinId] = useState('')
    const getUserStored = async () => {
        const userStored = await AsyncStoraged.getData()
        if (userStored) {
            setType(userStored.type)
            setEmail(userStored.email)
            setOrgId(userStored._id)
        } else {
            setType(null)
        }
    }
    useEffect(() => {
        getUserStored()
    }, [])
    const refreshDetail = async () => {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,
            },
        }
        try {
            const response = await axios.get(
                API_URL.API_URL + '/post/' + items._id,
                config
            )
            if (response.data.status === 'SUCCESS') {
                setItems(response.data.data)
            }
        } catch (error) {
            console.log('API Error:', error)
        }
    }
    const [statusBarHeight, setStatusBarHeight] = useState(0)
    const options = [
        {
            title: 'Thống kê hoạt động',
            icon: 'bar-chart-outline',
            action: () => navigation.navigate('Statistical', items.activityId),
        },
        {
            title: 'Sao kê hoạt động',
            icon: 'wallet-outline',
            action: () => alert('Thống kê'),
        },
        {
            title: 'Chi tiết',
            icon: 'reader-outline',
            action: () => alert('Thống kê'),
        },
    ]
    useEffect(() => {
        const height = getStatusBarHeight()
        setStatusBarHeight(height)
    }, [])
    const [token, setToken] = useState('')
    const getToken = async () => {
        const token = await AsyncStoraged.getToken()
        setToken(token)
    }
    const [refreshing, setRefreshing] = React.useState(false)
    const onRefresh = React.useCallback(() => {
        refreshDetail()
        setTimeout(() => {
            setRefreshing(false)
        }, 2000)
    }, [])
    useEffect(() => {
        getToken()
    }, [])
    function DaysDifference({ exprirationDate }) {
        const [daysDifference, setDaysDifference] = useState(null)

        useEffect(() => {
            const currentDate = new Date()
            const targetDate = new Date(exprirationDate)
            const timeDifference = targetDate - currentDate
            const daysDifference = Math.floor(
                timeDifference / (1000 * 60 * 60 * 24)
            )
            setDaysDifference(daysDifference)
        }, [exprirationDate])

        if (daysDifference === null) {
            return null // Hoặc thay thế bằng UI mặc định khác nếu cần
        }
        if (daysDifference <= 0) {
            return (
                <Text
                    style={{
                        fontSize: 15,
                        fontWeight: '500',
                    }}
                >
                    Đã hết hạn
                </Text>
            )
        } else {
            return (
                <Text
                    style={{
                        fontSize: 15,
                        fontWeight: '500',
                    }}
                >
                    {daysDifference} ngày
                </Text>
            )
        }
    }
    function LongText({ content, maxLength }) {
        const [isFullTextVisible, setIsFullTextVisible] = useState(false)

        // Hàm này được gọi khi người dùng bấm vào nút "Xem thêm" hoặc "Thu gọn"
        const toggleTextVisibility = () => {
            setIsFullTextVisible(!isFullTextVisible)
        }

        // Hiển thị nội dung đầy đủ hoặc ngắn gọn tùy thuộc vào trạng thái
        const displayText = isFullTextVisible
            ? content
            : content.slice(0, maxLength)

        return (
            <View>
                {content.length > maxLength && (
                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={toggleTextVisibility}
                    >
                        <Text style={{ fontSize: 16, textAlign: 'justify' }}>
                            {displayText}
                        </Text>
                        <Text
                            style={{ fontWeight: '500', color: COLORS.primary }}
                        >
                            {isFullTextVisible ? '...Thu gọn' : '...Xem thêm'}
                        </Text>
                    </TouchableOpacity>
                )}
            </View>
        )
    }
    const handleNavigate = (data) => {
        // console.log(item)
        navigation.navigate('ViewDetailImage', data)
    }
    const joinActivity = async () => {
        try {
            setShowLoading(true)
            const res = await axios({
                method: 'put',
                url: API_URL.API_URL + '/activity/' + items.activityId,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token,
                },
            })
            console.log(res.data.status)
            if (res.data.status === 'SUCCESS') {
                setShowLoading(false)
                Toast.show({
                    type: 'joinToast',
                    text1: 'Thành công',
                    text2: 'Tham gia thành công',
                    visibilityTime: 2500,
                })

                setJoinId(items._id)
                refreshDetail()
            }
        } catch (error) {
            if (error) {
                Toast.show({
                    type: 'error',
                    text1: 'Thất bại',
                    text2: 'Tham gia thất bại!',
                    visibilityTime: 2500,
                })
                setShowLoading(false)
                console.log(error)
            }
        }
    }

    const joinActi = () => {
        Alert.alert('Thông báo', 'Bạn có muốn tham gia hoạt động', [
            {
                text: 'Hủy',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
            },
            {
                text: 'Đồng ý',
                onPress: () => {
                    joinActivity()
                },
            },
        ])
    }
    const joinGroup = async () => {
        try {
            setShowLoading(true)
            const res = await axios({
                method: 'post',
                url: API_URL.API_URL + '/group/member/' + items.groupChatId,
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
                    text2: 'Tham gia thành công',
                    visibilityTime: 2500,
                })
                refreshDetail()
            }
        } catch (error) {
            if (error) {
                Toast.show({
                    type: 'error',
                    text1: 'Thất bại',
                    text2: 'Tham gia thất bại!',
                    visibilityTime: 2500,
                })
                setShowLoading(false)
                console.log(error)
            }
        }
    }

    const joinGr = () => {
        Alert.alert('Thông báo', 'Bạn có muốn tham gia nhóm trò chuyện?', [
            {
                text: 'Hủy',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
            },
            {
                text: 'Đồng ý',
                onPress: () => {
                    joinGroup()
                },
            },
        ])
    }
    const formatDate = (originalDate) => {
        const formattedDate = format(new Date(originalDate), 'dd-MM-yyyy')
        return formattedDate
    }
    const renderQrCodeModal = () => (
        <Modal
            isVisible={isModalVisible}
            animationIn="fadeIn"
            animationOut="fadeOut"
        >
            <TouchableOpacity
                style={{ flex: 1 }}
                activeOpacity={1}
                onPressOut={() => setModalVisible(false)}
            >
                <View
                    style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <View
                        style={{
                            backgroundColor: COLORS.white,
                            padding: 20,
                            borderRadius: 20,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <Text
                            style={{
                                fontWeight: 'bold',
                                fontSize: 17,
                                marginBottom: 10,
                            }}
                        >
                            Quét mã QR này để điểm danh
                        </Text>
                        <QRCode value={items._id} size={250} />
                    </View>
                </View>
            </TouchableOpacity>
        </Modal>
    )
    const handleMap = (_address) => {
        const mapAddress = encodeURIComponent(_address)
        const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${mapAddress}`
        Linking.openURL(googleMapsUrl)
    }

    return (
        <View style={{ flex: 1 }}>
            <ToastAlert/>
            <CreateGroupModal
                onRequestClose={() => {
                    setShowCreate(false)
                    refreshDetail()
                }}
                visible={showCreate}
                activityId={items.activityId}
            />
            <ModalLoading visible={showLoading} />
            {renderQrCodeModal()}
            <TouchableOpacity
                onPress={() => navigation.navigate('Feed', joinId)}
                style={styles.backBtn}
            >
                <MaterialIcons
                    name="keyboard-arrow-left"
                    size={26}
                    color={COLORS.black}
                />
            </TouchableOpacity>
            {items.ownerId === orgId ? (
                <PopupMenu options={options} />
            ) : null}

            <ScrollView
                style={{
                    backgroundColor: '#fff',
                }}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
            >
                <View style={{ zIndex: 1 }}>
                    <View style={{ flex: 1, marginBottom: 15 }}>
                        <SliderBox
                            images={items.media}
                            paginationBoxVerticalPadding={5}
                            activeOpacity={1}
                            dotColor={COLORS.primary}
                            inactiveDotColor={COLORS.white}
                            sliderBoxHeight={250}
                            resizeMode={'contain'}
                            autoplay
                            dotStyle={{ width: 7, height: 7 }}
                        />
                    </View>
                    <View
                        style={styles.iconMember}
                    >
                        <View style={{ flexDirection: 'row', marginRight: 70 }}>
                            <View
                                style={styles.viewIcon}
                            >
                                <FontAwesome
                                    name="group"
                                    size={18}
                                    color="#fff"
                                />
                            </View>
                            <View style={{ flexDirection: 'column' }}>
                                <Text
                                    style={styles.total}
                                >
                                    Số tình nguyện viên
                                </Text>
                                <Text
                                    style={{
                                        fontSize: 15,
                                        fontWeight: '500',
                                    }}
                                >
                                    {items.participants} người
                                </Text>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <View
                                style={styles.viewTime}
                            >
                                <Ionicons
                                    name="calendar-outline"
                                    size={20}
                                    color="#fff"
                                />
                            </View>
                            <View style={{ flexDirection: 'column' }}>
                                <Text
                                    style={styles.textTime}
                                >
                                    Thời gian còn lại
                                </Text>
                                <DaysDifference
                                    exprirationDate={items.exprirationDate}
                                />
                            </View>
                        </View>
                    </View>
                    <View
                        style={{
                            flexDirection: 'row',
                            paddingHorizontal: 15,
                            marginBottom: 5,
                        }}
                    >
                        <TouchableOpacity
                            onPress={() => handleMap(items.address)}
                            activeOpacity={0.8}
                            style={styles.viewMap}
                        >
                            <Ionicons
                                name="location-outline"
                                size={22}
                                color="#696969"
                            />
                            <Text
                                style={styles.textMap}
                            >
                                {items.address}
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View
                        style={{
                            flexDirection: 'row',
                            paddingHorizontal: 15,
                            marginBottom: 5,
                        }}
                    >
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'flex-start',
                                alignItems: 'center',
                                marginTop: 4,
                            }}
                        >
                            <Ionicons
                                name="calendar-outline"
                                size={22}
                                color="#696969"
                            />
                            <Text
                                style={{
                                    fontSize: 14,
                                    marginLeft: 4,
                                    color: '#696969',
                                }}
                            >
                                Ngày diễn ra:
                            </Text>
                            <Text
                                style={{
                                    fontSize: 14,
                                    color: COLORS.primary,
                                    marginLeft: 4,
                                    marginRight: 15,
                                    fontWeight: 'bold',
                                }}
                            >
                                {formatDate(items.dateActivity)}{' '}
                            </Text>
                        </View>
                    </View>
                    <View
                        style={styles.ownerView}
                    >
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'flex-start',
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 14,
                                    color: '#696969',
                                }}
                            >
                                Đăng bởi:
                            </Text>
                            <Text
                                style={styles.ownerName}
                            >
                                {items.ownerDisplayname}{' '}
                                <FontAwesome
                                    name="check-circle"
                                    size={15}
                                    color={COLORS.primary}
                                />
                            </Text>
                        </View>
                    </View>
                    <View
                        style={{
                            flexDirection: 'column',
                            paddingHorizontal: 15,
                        }}
                    >
                        <Progress.Bar
                            progress={items.totalUserJoin / items.participants}
                            color="#FF493C"
                            height={8}
                            width={SIZES.width - 45}
                            unfilledColor="#D3D3D3"
                            borderColor="#F5F5F5"
                            borderRadius={25}
                        />
                        <Text
                            style={{
                                paddingVertical: 10,
                                color: '#696969',
                            }}
                        >
                            Đã tham gia:
                            <Text
                                style={styles.joinedPeople}
                            >
                                {' '}
                                {items.totalUserJoin}/{items.participants} người
                            </Text>
                        </Text>
                    </View>
                    <View
                        style={{
                            flexDirection: 'column',
                            paddingHorizontal: 15,
                        }}
                    >
                        <Text
                            style={{
                                color: '#696969',
                            }}
                        >
                            {items.totalLikes} lượt thích
                        </Text>
                    </View>

                    <View
                        style={{
                            flexDirection: 'column',
                            paddingTop: 15,
                            paddingHorizontal: 15,
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 16,
                                fontWeight: 'bold',
                                marginBottom: 15,
                            }}
                        >
                            Câu chuyện
                        </Text>
                        {items.content.length > 100 ? (
                            <LongText maxLength={250} content={items.content} />
                        ) : (
                            <Text
                                style={{ fontSize: 16, textAlign: 'justify' }}
                            >
                                {items.content}
                            </Text>
                        )}
                    </View>
                    <View
                        style={{
                            flexDirection: 'column',
                            paddingTop: 25,
                            paddingHorizontal: 15,
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 16,
                                fontWeight: 'bold',
                                marginBottom: 15,
                            }}
                        >
                            Ảnh/Video
                        </Text>
                        <FlatList
                            style={{
                                marginBottom: 15,
                            }}
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                            data={items.media}
                            renderItem={({ item, index }) => (
                                <View
                                    key={index}
                                    style={{
                                        flexDirection: 'column',
                                        flex: 1,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <TouchableOpacity
                                        style={{
                                            paddingVertical: 4,
                                        }}
                                        onPress={() => handleNavigate(item)}
                                    >
                                        <Image
                                            source={{ uri: item }}
                                            style={styles.imgPost}
                                        />
                                    </TouchableOpacity>
                                </View>
                            )}
                        />
                        {type === 'Organization' && items.isEnableQr ? (
                            <View
                                style={{
                                    marginBottom: 50,
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                }}
                            >
                                <TouchableOpacity
                                    onPress={() => setModalVisible(true)}
                                    activeOpacity={0.8}
                                    style={{
                                        backgroundColor: COLORS.primary,
                                        width: items.groupChatId
                                            ? '100%'
                                            : '48%',
                                        height: 50,
                                        borderRadius: 16,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexDirection: 'row',
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontFamily: 'monterrat',
                                            color: COLORS.white,
                                            marginRight: 10,
                                        }}
                                    >
                                        ĐIỂM DANH
                                    </Text>
                                    <MaterialIcons
                                        name={'qr-code-scanner'}
                                        size={30}
                                        color={COLORS.white}
                                    />
                                </TouchableOpacity>
                                {!items.groupChatId ? (
                                    <TouchableOpacity
                                        onPress={() => setShowCreate(true)}
                                        activeOpacity={0.8}
                                        style={{
                                            backgroundColor: COLORS.white,
                                            height: 50,
                                            borderWidth: 2,
                                            borderColor: COLORS.primary,
                                            width: '48%',
                                            borderRadius: 16,
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            flexDirection: 'row',
                                        }}
                                    >
                                        <Text
                                            style={{
                                                fontFamily: 'monterrat',
                                                color: COLORS.primary,
                                                marginRight: 10,
                                            }}
                                        >
                                            TẠO NHÓM CHAT
                                        </Text>
                                        <Feather
                                            name={'users'}
                                            size={30}
                                            color={COLORS.primary}
                                        />
                                    </TouchableOpacity>
                                ) : null}
                            </View>
                        ) : orgId === items.ownerId ? (
                            <View
                                style={{
                                    marginBottom: 50,
                                }}
                            >
                                {items.groupChatId ? null : (
                                    <TouchableOpacity
                                        onPress={() => setShowCreate(true)}
                                        activeOpacity={0.8}
                                        style={{
                                            backgroundColor: COLORS.white,
                                            height: 50,
                                            borderWidth: 2,
                                            borderColor: COLORS.primary,
                                            borderRadius: 16,
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            flexDirection: 'row',
                                        }}
                                    >
                                        <Text
                                            style={{
                                                fontFamily: 'monterrat',
                                                color: COLORS.primary,
                                                marginRight: 10,
                                            }}
                                        >
                                            TẠO NHÓM CHAT
                                        </Text>
                                        <Feather
                                            name={'users'}
                                            size={30}
                                            color={COLORS.primary}
                                        />
                                    </TouchableOpacity>
                                )}
                            </View>
                        ) : items.isAttended ? (
                            <View
                                style={{
                                    marginBottom: 50,
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                }}
                            >
                                <View
                                    style={{
                                        backgroundColor: '#ccc',
                                        height: 50,
                                        width: items.isJoinGroupChat
                                            ? '100%'
                                            : '48%',
                                        borderRadius: 16,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontFamily: 'monterrat',
                                            color: '#000',
                                        }}
                                    >
                                        ĐÃ ĐIỂM DANH
                                    </Text>
                                </View>
                                {!items.isJoinGroupChat && items.groupChatId ? (
                                    <TouchableOpacity
                                        onPress={joinGr}
                                        activeOpacity={0.8}
                                        style={{
                                            backgroundColor: COLORS.white,
                                            height: 50,
                                            borderWidth: 2,
                                            borderColor: COLORS.primary,
                                            width: '48%',
                                            borderRadius: 16,
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            flexDirection: 'row',
                                        }}
                                    >
                                        <Text
                                            style={{
                                                fontFamily: 'monterrat',
                                                color: COLORS.primary,
                                                marginRight: 10,
                                            }}
                                        >
                                            THAM GIA NHÓM
                                        </Text>
                                        <Feather
                                            name={'users'}
                                            size={30}
                                            color={COLORS.primary}
                                        />
                                    </TouchableOpacity>
                                ) : null}
                            </View>
                        ) : items.isJoin ? (
                            <View
                                style={{
                                    marginBottom: 50,
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                }}
                            >
                                <View
                                    style={{
                                        backgroundColor: '#ccc',
                                        height: 50,
                                        width: items.isJoinGroupChat || !items.groupChatId
                                            ? '100%'
                                            : '48%',
                                        borderRadius: 16,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontFamily: 'monterrat',
                                            color: '#000',
                                        }}
                                    >
                                        ĐÃ THAM GIA
                                    </Text>
                                </View>
                                {!items.isJoinGroupChat && items.groupChatId ? (
                                    <TouchableOpacity
                                        onPress={joinGr}
                                        activeOpacity={0.8}
                                        style={{
                                            backgroundColor: COLORS.white,
                                            height: 50,
                                            borderWidth: 2,
                                            borderColor: COLORS.primary,
                                            width: '48%',
                                            borderRadius: 16,
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            flexDirection: 'row',
                                        }}
                                    >
                                        <Text
                                            style={{
                                                fontFamily: 'monterrat',
                                                color: COLORS.primary,
                                                marginRight: 10,
                                            }}
                                        >
                                            THAM GIA NHÓM
                                        </Text>
                                        <Feather
                                            name={'users'}
                                            size={30}
                                            color={COLORS.primary}
                                        />
                                    </TouchableOpacity>
                                ) : null}
                            </View>
                        ) : items.isExprired ? (
                            <View
                                style={{
                                    marginBottom: 50,
                                }}
                            >
                                <View
                                    style={{
                                        backgroundColor: '#ccc',
                                        height: 44,
                                        borderRadius: 16,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontFamily: 'monterrat',
                                            color: '#000',
                                        }}
                                    >
                                        ĐÃ HẾT HẠN
                                    </Text>
                                </View>
                            </View>
                        ) : type === 'Organization' || !type ? (
                            <View
                                style={{
                                    marginBottom: 50,
                                }}
                            >
                                <View
                                    style={{
                                        backgroundColor: '#fff',
                                        height: 44,
                                        borderRadius: 16,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                ></View>
                            </View>
                        ) : (
                            <View
                                style={{
                                    marginBottom: 50,
                                }}
                            >
                                <CustomButton
                                    onPress={joinActi}
                                    title="THAM GIA"
                                />
                            </View>
                        )}
                    </View>
                </View>
            </ScrollView>
        </View>
    )
}

export default DetailPost
