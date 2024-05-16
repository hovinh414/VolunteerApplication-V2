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
import React, { useState, useEffect } from 'react'
import { COLORS, FONTS, SIZES } from '../../../constants/theme'
import { images } from '../../../constants'
import PopupMenu from '../../../components/menu/PopupMenu'
import {
    MaterialIcons,
    Feather,
    Ionicons,
    FontAwesome,
} from '@expo/vector-icons'
import CustomButton from '../../../components/custom/CustomButton'
import ToastAlert from '../../../components/modal/ToastAlert'
import { SliderBox } from 'react-native-image-slider-box'
import AsyncStoraged from '../../../services/AsyncStoraged'
import ModalLoading from '../../../components/modal/ModalLoading'
import { getStatusBarHeight } from 'react-native-status-bar-height'
import DonateModal from '../../../components/modal/DonateModal'
import { styles } from '../style/detailStyle'

const DetailDonation = ({ navigation, route }) => {
    const [items, setItems] = useState(route.params)
    const screenHeight = Dimensions.get('window').height
    const [type, setType] = useState('')
    const [email, setEmail] = useState('')
    const [showLoading, setShowLoading] = useState(false)
    const [showDonate, setShowDonate] = useState(false)
    const [orgId, setOrgId] = useState('')
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
                <Image source={images.book} style={styles.itemDonation} />
            ) : item === 'Đồ dùng cũ' ? (
                <Image source={images.dishes} style={styles.itemDonation} />
            ) : item === 'Đồ ăn' ? (
                <Image source={images.food} style={styles.itemDonation} />
            ) : item === 'Quần áo' ? (
                <Image source={images.cloth} style={styles.itemDonation} />
            ) : item === 'Đồ chơi' ? (
                <Image source={images.toy} style={styles.itemDonation} />
            ) : item === 'Thuốc' ? (
                <Image source={images.medicine} style={styles.itemDonation} />
            ) : item === 'Đồ dùng học tập' ? (
                <Image source={images.stationery} style={styles.itemDonation} />
            ) : (
                <Image source={images.noodles} style={styles.itemDonation} />
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
    const handleMap = (_address) => {
        const mapAddress = encodeURIComponent(_address)
        const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${mapAddress}`
        Linking.openURL(googleMapsUrl)
    }

    return (
        <View style={{ flex: 1, marginTop: 12 }}>
            <ToastAlert />
            <DonateModal
                onRequestClose={() => {
                    setShowDonate(false)
                }}
                visible={showDonate}
                donateItems={items.donateItem.split(', ')}
                donationId={items.donationId}
            />
            <ModalLoading visible={showLoading} />
            <TouchableOpacity
                style={styles.backBtn}
                onPress={() => navigation.goBack()}
            >
                <MaterialIcons
                    name="keyboard-arrow-left"
                    size={26}
                    color={COLORS.black}
                />
            </TouchableOpacity>
            {items.ownerId === orgId ? <PopupMenu options={options} /> : null}

            <ScrollView
                style={{
                    backgroundColor: '#fff',
                }}
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
                    <View style={styles.iconMember}>
                        <View style={{ flexDirection: 'row', marginRight: 70 }}>
                            <View style={styles.viewIcon}>
                                <FontAwesome
                                    name="group"
                                    size={18}
                                    color="#fff"
                                />
                            </View>
                            <View style={{ flexDirection: 'column' }}>
                                <Text style={styles.total}>Số lượt thích</Text>
                                <Text
                                    style={{
                                        fontSize: 15,
                                        fontWeight: '500',
                                    }}
                                >
                                    {items.totalLikes} lượt thích
                                </Text>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={styles.viewTime}>
                                <Ionicons
                                    name="calendar-outline"
                                    size={20}
                                    color="#fff"
                                />
                            </View>
                            <View style={{ flexDirection: 'column' }}>
                                <Text style={styles.textTime}>
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
                            paddingHorizontal: 12,
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
                            <Text style={styles.textMap}>{items.address}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.ownerView}>
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
                            <Text style={styles.ownerName}>
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
                            paddingHorizontal: 12,
                            marginTop: 10,
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 16,
                                fontWeight: 'bold',
                                marginBottom: 15,
                            }}
                        >
                            Nhận quyên góp các đồ dùng sau:
                        </Text>
                        <View
                            style={{
                                flexDirection: 'row',
                                flexWrap: 'wrap',
                            }}
                        >
                            {items.donateItem.split(', ').map((item, index) => (
                                <React.Fragment key={index}>
                                    {renderItem(item)}
                                </React.Fragment>
                            ))}
                        </View>
                    </View>
                    <View
                        style={{
                            flexDirection: 'column',
                            paddingTop: 10,
                            paddingHorizontal: 12,
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
                            paddingHorizontal: 12,
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
                        {items.isLock ? (
                            <View
                                style={{
                                    backgroundColor: '#ccc',
                                    height: 50,
                                    width: '100%',
                                    borderRadius: 16,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <Text
                                    style={{
                                        fontFamily: 'monterrat',
                                        fontSize: 16,
                                        color: '#000',
                                    }}
                                >
                                    HOẠT ĐỘNG ĐÃ ĐÓNG
                                </Text>
                            </View>
                        ) : items.ownerId === orgId ? (
                            <View
                                style={{
                                    marginBottom: 50,
                                }}
                            >
                                <CustomButton
                                    onPress={() =>
                                        navigation.navigate('ConfirmDonation', {
                                            postId: items._id,
                                            donationId: items.donationId,
                                        })
                                    }
                                    title="XÁC NHẬN QUYÊN GÓP"
                                />
                            </View>
                        ) : type === 'Organization' || !token ? null : (
                            <View
                                style={{
                                    marginBottom: 50,
                                }}
                            >
                                <CustomButton
                                    onPress={() => setShowDonate(true)}
                                    title="ỦNG HỘ NGAY"
                                />
                            </View>
                        )}
                    </View>
                </View>
            </ScrollView>
        </View>
    )
}

export default DetailDonation
