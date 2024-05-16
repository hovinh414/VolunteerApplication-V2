import React, { useEffect, useState, useRef } from 'react'
import {
    Text,
    View,
    TouchableOpacity,
    FlatList,
    TextInput,
    TouchableWithoutFeedback,
    KeyboardAvoidingView,
} from 'react-native'
import Modal from 'react-native-modal'
import { Feather, Ionicons } from '@expo/vector-icons'
import { COLORS, images } from '../../constants'
import { Image } from 'expo-image'
import axios from 'axios'
import AsyncStoraged from '../../services/AsyncStoraged'
import API_URL from '../../config/config'
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message'
import DatePicker, { getFormatedDate } from 'react-native-modern-datepicker'
import ModalLoading from './ModalLoading'
import { addYears, format, addDays, parse, isAfter } from 'date-fns'
import { styles } from '../../screens/Post/style/PostScreenStyle'
import ToastAlert from './ToastAlert'

const picture = '../assets/picture.png'
const DonateModal = (
    { visible, onRequestClose, donationId, donateItems },
    ref
) => {
    const [showLoading, setShowLoading] = useState(false)
    const [timeSend, setTimeSend] = useState(false)
    const [donateItem, setDonateItem] = useState([])
    const [token, setToken] = useState('')
    const [openStartDatePicker, setOpenStartDatePicker] = useState(false)
    const [keyboard, setKeyBoard] = useState(true)
    const currentDate = new Date()

    const getToken = async () => {
        const token = await AsyncStoraged.getToken()
        setToken(token)
    }
    useEffect(() => {
        getToken()
    }, [])
    const handleOnPressStartDate = () => {
        setOpenStartDatePicker(!openStartDatePicker)
    }
    function handleChangeStartDate(propDate) {
        setStartedDate(propDate)
    }
    const handleQuantityChange = (item, qty) => {
        // Kiểm tra xem mặt hàng đã tồn tại trong danh sách quyên góp chưa
        const itemIndex = donateItem.findIndex(
            (donateItem) => donateItem.item === item
        )
        if (itemIndex === -1) {
            // Nếu mặt hàng chưa tồn tại trong danh sách, thêm mặt hàng mới
            setDonateItem([...donateItem, { item, quantity: qty }])
        } else {
            // Nếu mặt hàng đã tồn tại trong danh sách, cập nhật số lượng
            const updatedItems = [...donateItem]
            updatedItems[itemIndex].quantity = qty
            setDonateItem(updatedItems)
        }
    }
    function formatDate(originalDateString) {
        // Tạo một đối tượng Date từ chuỗi ngày giờ gốc
        var originalDate = new Date(originalDateString)

        // Lấy ngày, tháng và năm từ đối tượng Date
        var day = originalDate.getDate()
        var month = originalDate.getMonth() + 1 // Tháng bắt đầu từ 0, nên cần cộng thêm 1
        var year = originalDate.getFullYear()

        // Định dạng lại thành chuỗi "dd-MM-yyyy"
        var formattedDateString =
            (day < 10 ? '0' : '') +
            day +
            '-' +
            (month < 10 ? '0' : '') +
            month +
            '-' +
            year

        return formattedDateString
    }
    const getTotalQuantity = () => {
        return donateItem.reduce((total, currentItem) => {
            // Chỉ tính số lượng nếu quantity khác 0 và không rỗng
            if (currentItem.quantity && currentItem.quantity.trim() !== '0') {
                total += parseInt(currentItem.quantity)
            }
            return total
        }, 0)
    }
    const getItemsWithNonZeroQuantity = () => {
        const itemsWithQuantity = donateItem
            .filter((item) => item.quantity && item.quantity.trim() !== '0')
            .map((item) => item.item) // Chỉ lấy tên của mặt hàng

        return itemsWithQuantity.join(', ')
    }

    const handleDonate = async () => {
        setShowLoading(true)
        const totalQuantity = getTotalQuantity()
        console.log('Tổng số lượng:', totalQuantity)
        const itemsString = getItemsWithNonZeroQuantity()
        console.log('Các đồ vật quyên góp:', itemsString)

        try {
            if (!timeSend || totalQuantity === 0 || !itemsString) {
                Toast.show({
                    type: 'warning',
                    text1: 'Cảnh báo',
                    text2: 'Vui lòng nhập đầy đủ thông tin!',
                    visibilityTime: 2500,
                    topOffset: 10,
                })
                setShowLoading(false)
                return
            }
            const res = await axios({
                method: 'put',
                url: API_URL.API_URL + '/donation',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    Authorization: token,
                },
                data: {
                    donationId: donationId,
                    donateItem: itemsString,
                    quantity: totalQuantity,
                    timeSend: timeSend,
                },
            })
            if (res.data.status === 'SUCCESS') {
                setShowLoading(false)
                console.log(res.data.data.totalUserJoin)
                Toast.show({
                    type: 'success',
                    text1: 'Thành công',
                    text2: 'Quyên góp thành công',
                    visibilityTime: 2500,
                    autoHide: true,
                    onHide: onRequestClose,
                })
                setDonateItem([])
                setTimeSend()
            }
        } catch (error) {
            if (error) {
                console.log('API Donate Error:', error)
                setShowLoading(false)
                Toast.show({
                    type: 'error',
                    text1: 'Thất bại',
                    text2: 'Quyên góp thất bại',
                    visibilityTime: 2500,
                    topOffset: 10,
                })
            }
        }
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
            <ToastAlert />
            <View
                style={{
                    height: '75%',
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
                        Quyên góp
                    </Text>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={handleDonate}
                    >
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
                <>
                    <View
                        style={{
                            flex: 1,
                            marginTop: 10,
                        }}
                    >
                        <View
                            style={{
                                flexDirection: 'column',
                                marginBottom: 20,
                            }}
                        >
                            <Text
                                style={{
                                    paddingVertical: 10,
                                    marginHorizontal: 20,
                                    fontSize: 18,
                                }}
                            >
                                Ngày gửi:
                            </Text>
                            <KeyboardAvoidingView
                                behavior={Platform.OS == 'ios' ? 'padding' : ''}
                                style={{
                                    backgroundColor: '#fff',
                                }}
                            >
                                <View>
                                    <View>
                                        <TouchableOpacity
                                            style={{
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                marginHorizontal: 20,
                                                paddingHorizontal: 10,
                                                height: 50,
                                                justifyContent: 'center',
                                                borderRadius: 10,
                                                borderWidth: 1.5,
                                                borderColor: COLORS.primary,
                                            }}
                                            onPress={handleOnPressStartDate}
                                        >
                                            <Text
                                                style={{
                                                    flex: 1,
                                                    fontSize: 16,
                                                    marginLeft: 10,
                                                    paddingVertical: 13,
                                                    width: 29,
                                                    color: '#696969',
                                                }}
                                            >
                                                {!timeSend
                                                    ? 'Chọn ngày gửi'
                                                    : formatDate(timeSend)}
                                            </Text>
                                            <View style={styles.iconStyle}>
                                                <Image
                                                    style={styles.icon}
                                                    source={require('../../assets/calendar.png')}
                                                />
                                            </View>
                                        </TouchableOpacity>
                                    </View>

                                    {/* Create modal for date picker */}
                                    <Modal
                                        animationType="slide"
                                        transparent={true}
                                        visible={openStartDatePicker}
                                    >
                                        <View style={styles.centeredView}>
                                            <View style={styles.modalView}>
                                                <DatePicker
                                                    mode="calendar"
                                                    minimumDate={format(
                                                        addDays(currentDate, 1),
                                                        'yyyy-MM-dd'
                                                    )}
                                                    maximumDate={format(
                                                        addYears(
                                                            currentDate,
                                                            1
                                                        ),
                                                        'yyyy-MM-dd'
                                                    )}
                                                    onDateChanged={
                                                        handleChangeStartDate
                                                    }
                                                    onSelectedChange={(date) =>
                                                        setTimeSend(
                                                            format(
                                                                parse(
                                                                    date,
                                                                    'yyyy/MM/dd',
                                                                    new Date()
                                                                ),
                                                                "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"
                                                            )
                                                        )
                                                    }
                                                    options={{
                                                        backgroundColor: '#FFF',
                                                        textHeaderColor:
                                                            COLORS.primary,
                                                        textDefaultColor:
                                                            COLORS.black,
                                                        selectedTextColor:
                                                            '#fff',
                                                        mainColor:
                                                            COLORS.primary,
                                                        textSecondaryColor:
                                                            '#FFFFFF',
                                                        borderColor:
                                                            'rgba(122, 146, 165, 0.1)',
                                                    }}
                                                />

                                                <TouchableOpacity
                                                    style={{
                                                        padding: 10,
                                                        borderRadius: 16,
                                                        backgroundColor:
                                                            COLORS.primary,
                                                    }}
                                                    onPress={
                                                        handleOnPressStartDate
                                                    }
                                                >
                                                    <Text
                                                        style={{
                                                            color: '#fff',
                                                            fontSize: 16,
                                                            fontFamily:
                                                                'regular',
                                                        }}
                                                    >
                                                        Đóng
                                                    </Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </Modal>
                                </View>
                            </KeyboardAvoidingView>
                        </View>
                        <FlatList
                            data={donateItems}
                            renderItem={({ item, index }) => (
                                <View
                                    style={{
                                        flexDirection: 'column',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        marginTop: 15,
                                        padding: 5,
                                        marginVertical: 10,
                                        marginHorizontal: 15,
                                    }}
                                >
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            width: '100%',
                                        }}
                                    >
                                        <View
                                            style={{
                                                flexDirection: 'row',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                borderBottomWidth: 1,
                                                borderTopWidth: 1,
                                                borderLeftWidth: 1,
                                                borderColor: '#DCDCDC',
                                                borderBottomLeftRadius: 15,
                                                borderTopLeftRadius: 15,
                                                padding: 10,
                                                flex: 1,
                                            }}
                                        >
                                            <TextInput
                                                value={item}
                                                placeholderTextColor={'#696969'}
                                                placeholder="Nhập tên đồ quyên góp"
                                                style={{
                                                    width: '100%',
                                                    height: 50,
                                                    fontSize: 16,
                                                    fontWeight: '500',
                                                }}
                                            />
                                        </View>
                                        <View
                                            style={{
                                                flexDirection: 'row',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                borderBottomWidth: 1,
                                                borderTopWidth: 1,
                                                borderLeftWidth: 1,
                                                borderRightWidth: 1,
                                                borderColor: '#DCDCDC',
                                                borderBottomRightRadius: 15,
                                                borderTopRightRadius: 15,
                                                padding: 10,
                                                flex: 1,
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    fontSize: 15,
                                                    fontWeight: '500',
                                                    marginRight: 5,
                                                }}
                                            >
                                                {item === 'Quần áo'
                                                    ? 'Số lượng (bộ):'
                                                    : item === 'Sách vở'
                                                    ? 'Số lượng (cuốn):'
                                                    : item === 'Thuốc'
                                                    ? 'Số lượng (vỉ/hộp):'
                                                    : item === 'Thực phẩm khô'
                                                    ? 'Số lượng (hộp):'
                                                    : item === 'Đồ ăn'
                                                    ? 'Số lượng (suất):'
                                                    : 'Số lượng (cái):'}
                                            </Text>
                                            <TextInput
                                                placeholderTextColor={'#696969'}
                                                onChangeText={(qty) => {
                                                    handleQuantityChange(
                                                        item,
                                                        qty
                                                    )
                                                }}
                                                style={{
                                                    width: '30%',
                                                    height: 50,
                                                    fontSize: 15,
                                                    fontWeight: '500',
                                                }}
                                                keyboardType="numeric"
                                            />
                                        </View>
                                    </View>
                                </View>
                            )}
                        />
                    </View>
                </>
            </View>
        </Modal>
    )
}

export default DonateModal
