import React, { useState, useEffect } from 'react'
import {
    View,
    Text,
    KeyboardAvoidingView,
    FlatList,
    ScrollView,
    TouchableOpacity,
    TextInput,
    RefreshControl,
    Modal,
} from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import { styles } from './style/PostScreenStyle'
import CustomButton from '../../components/custom/CustomButton'
import AsyncStoraged from '../../services/AsyncStoraged'
import ImageAvata from '../../assets/hero2.jpg'
import { COLORS, FONTS, SIZES, images } from '../../constants'
import { addYears, format, addDays, parse, isAfter } from 'date-fns'
import axios from 'axios'
import { MaterialIcons, Ionicons } from '@expo/vector-icons'
import DatePicker, { getFormatedDate } from 'react-native-modern-datepicker'
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message'
import API_URL from '../../config/config'
import { Image } from 'expo-image'
import ModalLoading from '../../components/modal/ModalLoading'
import { SelectList } from 'react-native-dropdown-select-list'
import ToastAlert from '../../components/modal/ToastAlert'

const checkin = '../../assets/checkin.png'
const addPicture = '../../assets/add-image.png'
const Create = ({ navigation }) => {
    const [selectedImages, setSelectedImage] = useState([])
    const [avatar, setAvatar] = useState('')
    const [fullname, setFullname] = useState('')
    const [address, setAddress] = useState('')
    const [token, setToken] = useState()
    const [exprirationDate, setExprirationDate] = useState('Chọn ngày')
    const [dateActivity, setDateActivity] = useState('Chọn ngày')
    const [scope, setScope] = useState('public')
    const [content, setContent] = useState('')
    const [participants, setParticipants] = useState('')
    const [ButtonPress, setButtonPress] = useState('')
    const [openStartDatePicker, setOpenStartDatePicker] = useState(false)
    const [openActiDatePicker, setOpenActiDatePicker] = useState(false)
    const [selected, setSelected] = useState('')
    const currentDate = new Date()
    const data = [
        { key: 'Activity', value: 'Hoạt động tình nguyện' },
        { key: 'Donation', value: 'Hoạt động quyên góp' },
        { key: 'normal', value: 'Chia sẻ hoạt động' },
    ]
    const initialData = [
        { key: 'sach_vo', value: 'Sách vở' },
        { key: 'do_dung_cu', value: 'Đồ dùng cũ' },
        { key: 'do_an', value: 'Đồ ăn' },
        { key: 'quan_ao', value: 'Quần áo' },
        { key: 'do_choi', value: 'Đồ chơi' },
        { key: 'thuc_pham_kho', value: 'Thực phẩm khô' },
        { key: 'do_dung_hoc_tap', value: 'Đồ dùng học tập' },
        { key: 'thuoc', value: 'Thuốc' },
        // Các mục khác có thể thêm vào đây
    ]
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
    const [list, setList] = useState([])
    const [selectList, setSelecteList] = useState(initialData)

    const handleSelection = (selectedItem) => {
        const isAlreadyAdded = list.some((item) => item === selectedItem)

        // Nếu mục chưa được thêm vào danh sách, thêm nó vào
        if (!isAlreadyAdded) {
            setList((prevList) => [...prevList, selectedItem])

            // Cập nhật danh sách data: loại bỏ mục đã được chọn
            const updatedData = selectList.filter(
                (item) => item.value !== selectedItem
            )
            setSelecteList(updatedData)
        }
    }

    const removeItem = (itemToRemove) => {
        setList((prevList) => prevList.filter((item) => item !== itemToRemove))

        // Thêm mục trở lại vào danh sách data
        const selectedItem = initialData.find(
            (item) => item.value === itemToRemove
        )
        if (selectedItem) {
            setSelecteList((prevData) => [...prevData, selectedItem])
        }
    }

    const renderItem = (item) => (
        <TouchableOpacity
            activeOpacity={0.8}
            style={{
                backgroundColor: backgroundColors[item],
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                marginLeft: 12,
                borderRadius: 16,
                padding: 5,
                marginBottom: 12,
            }}
            onPress={() => removeItem(item)}
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
        </TouchableOpacity>
    )

    function handleChangeStartDate(propDate) {
        setStartedDate(propDate)
    }

    const handleOnPressStartDate = () => {
        setOpenStartDatePicker(!openStartDatePicker)
    }

    const handleOnPressActiDate = () => {
        setOpenActiDatePicker(!openActiDatePicker)
    }
    const getUserStored = async () => {
        const userStored = await AsyncStoraged.getData()
        setAvatar(userStored.avatar)
        setFullname(userStored.fullname)
        setAddress(userStored.address)
    }
    useEffect(() => {
        getUserStored()
    }, [])
    const getToken = async () => {
        const token = await AsyncStoraged.getToken()
        setToken(token)
    }

    useEffect(() => {
        getToken()
    }, [])
    const handleImageSelection = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: true,
            aspect: [5, 5],
            quality: 1,
        })
        delete result.cancelled
        if (!result.canceled) {
            if (!selectedImages) {
                setSelectedImage(result.assets)
            } else {
                setSelectedImage([...selectedImages, ...result.assets])
            }
        }
    }
    function removeImage(item) {
        const newList = selectedImages.filter((listItem) => listItem !== item)
        setSelectedImage(newList)
    }
    function resetForm() {
        setSelectedImage([])
        setParticipants(null)
        setContent(null)
        setList([])
        setSelecteList(initialData)
    }
    const [refreshing, setRefreshing] = React.useState(false)

    const onRefresh = React.useCallback(() => {
        setRefreshing(true)
        setTimeout(() => {
            setRefreshing(false)
        }, 2000)
    }, [])

    const formData = new FormData()
    const uploadPost = async () => {
        selectedImages.forEach((images, index) => {
            formData.append('images', {
                uri: images.uri,
                type: 'image/jpeg',
                name: images.fileName,
            })
        })

        formData.append('scope', scope)
        formData.append('content', content)
        formData.append('type', selected)
        if (selected === 'Donation') {
            var donateItem = list.join(', ')
            formData.append('donateItem', donateItem)
            formData.append('exprirationDate', exprirationDate)
        } else if (selected === 'Activity') {
            formData.append('dateActivity', dateActivity)
            formData.append('participants', participants)
            formData.append('exprirationDate', exprirationDate)
        }
        setButtonPress(true)
        if (selected === 'normal') {
            if (
                selectedImages.length === 0 ||
                !content ||
                !scope ||
                !selected
            ) {
                Toast.show({
                    type: 'warning',
                    text1: 'Cảnh báo',
                    text2: 'Nhập đầy đủ thông tin bao gồm ảnh!',
                    visibilityTime: 2500,
                })
                setButtonPress(false)
                return
            }
        } else if (selected === 'Activity') {
            if (
                selectedImages.length === 0 ||
                !content ||
                !scope ||
                !participants ||
                !selected
            ) {
                Toast.show({
                    type: 'warning',
                    text1: 'Cảnh báo',
                    text2: 'Nhập đầy đủ thông tin bao gồm ảnh!',
                    visibilityTime: 2500,
                })
                setButtonPress(false)
                return
            }
        } else {
            if (
                selectedImages.length === 0 ||
                !content ||
                !scope ||
                !selected
            ) {
                Toast.show({
                    type: 'warning',
                    text1: 'Cảnh báo',
                    text2: 'Nhập đầy đủ thông tin bao gồm ảnh!',
                    visibilityTime: 2500,
                })
                setButtonPress(false)
                return
            }
        }

        if (selected === 'Activity') {
            const date1 = exprirationDate
            const date2 = format(
                parse(dateActivity, 'MM-dd-yyyy', new Date()),
                'dd-MM-yyyy'
            )
            const [day1, month1, year1] = date1.split('-').map(Number)
            const [day2, month2, year2] = date2.split('-').map(Number)

            const dateOne = new Date(year1, month1 - 1, day1)
            const dateTwo = new Date(year2, month2 - 1, day2)
            const timeDiff = dateOne.getTime() - dateTwo.getTime()
            const daysDiff = timeDiff / (1000 * 3600 * 24)
            if (daysDiff >= 0) {
                Toast.show({
                    type: 'warning',
                    text1: 'Cảnh báo',
                    text2: 'Ngày diễn ra phải sau ngày hết hạn!',
                    visibilityTime: 2500,
                })
                setButtonPress(false)
                return
            }
        }
        axios
            .post(API_URL.API_URL + '/post', formData, {
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
                        text2: 'Đăng bài thành công',
                        visibilityTime: 2500,
                        autoHide: true,
                        onHide: () => {
                            navigation.navigate('BottomTabNavigation', {
                                name: 'Feed',
                            })
                        },
                    })
                    resetForm()
                    setButtonPress(false)
                }
            })
            .catch((error) => {
                console.log('API Error create post:', error)
                Toast.show({
                    type: 'error',
                    text1: 'Thất bại',
                    text2: 'Đăng bài thất bại!',
                    visibilityTime: 2500,
                })
                setButtonPress(false)
            })
    }
    return (
        <KeyboardAvoidingView
            style={{
                flex: 1,
                flexDirection: 'column',
                justifyContent: 'center',
                backgroundColor: '#fff',
            }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <ModalLoading visible={ButtonPress} />
            <ToastAlert />
            <ScrollView
                style={{ zIndex: 1 }}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
            >
                <View style={{ backgroundColor: '#fff', height: '100%' }}>
                    <View style={styles.post}>
                        <View style={styles.header}>
                            <View style={styles.profile}>
                                <Image
                                    source={
                                        avatar ? { uri: avatar } : ImageAvata
                                    }
                                    style={styles.profile_img}
                                />
                                <View style={styles.profile_details}>
                                    <Text style={styles.author}>
                                        {fullname}
                                    </Text>
                                    <View style={styles.checkin}>
                                        <Image
                                            source={require(checkin)}
                                            style={styles.checkinIcon}
                                        />
                                        <Text style={styles.checkinText}>
                                            {address}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>

                    <View style={{ paddingHorizontal: 10 }}>
                        <Text style={styles.headerInput}>
                            Chọn hình thức đăng bài:
                        </Text>
                        <SelectList
                            setSelected={(val) => setSelected(val)}
                            data={data}
                            save="key"
                            search={false}
                            placeholder={'Chọn hình thức'}
                            boxStyles={{
                                marginHorizontal: 10,
                                borderColor: COLORS.primary,
                                borderWidth: 1.5,
                            }}
                            dropdownStyles={{
                                marginHorizontal: 10,
                                borderColor: COLORS.primary,
                            }}
                        />
                        <Text style={styles.headerInput}>
                            Nhập nội dung bài viết:
                        </Text>
                        <TextInput
                            value={content}
                            placeholderTextColor={'#696969'}
                            onChangeText={(content) => {
                                setContent(content)
                            }}
                            style={styles.content_detail}
                            placeholder={
                                selected === 'Activity'
                                    ? 'Bạn muốn kêu gọi tình nguyện ở việc gì, ở đâu ...'
                                    : selected === 'Donation'
                                    ? 'Bạn muốn kêu gọi quyên góp gì, số lượng bao nhiêu, ở đâu ...'
                                    : 'Bạn muốn chia sẻ điều gì? ...'
                            }
                            multiline={true}
                        />
                        {selected === 'Donation' ||
                        selected === 'normal' ? null : (
                            <>
                                <View style={{ flex: 1, flexDirection: 'row' }}>
                                    <Text style={styles.headerInput}>
                                        Số tình nguyện viên:
                                    </Text>
                                </View>
                                <View style={{ flex: 1, flexDirection: 'row' }}>
                                    <TextInput
                                        value={participants}
                                        placeholderTextColor={'#696969'}
                                        onChangeText={(participants) => {
                                            setParticipants(participants)
                                        }}
                                        style={styles.address}
                                        placeholder="100"
                                        keyboardType="numeric"
                                    />
                                </View>
                            </>
                        )}
                        {selected === 'Donation' ? (
                            <>
                                <Text style={styles.headerInput}>
                                    Chọn đồ dùng nhận quyên góp:
                                </Text>
                                <SelectList
                                    setSelected={(val) => handleSelection(val)}
                                    data={selectList}
                                    save="value"
                                    search={true}
                                    placeholder={'Chọn đồ nhận quyên góp'}
                                    searchPlaceholder={'Tìm kiếm'}
                                    boxStyles={{
                                        marginHorizontal: 10,
                                        borderColor: COLORS.primary,
                                        borderWidth: 1.5,
                                    }}
                                    dropdownStyles={{
                                        marginHorizontal: 10,
                                        borderColor: COLORS.primary,
                                    }}
                                />
                                <View
                                    style={{
                                        flex: 1,
                                        flexDirection: 'row',
                                        flexWrap: 'wrap',
                                        marginTop: 10,
                                    }}
                                >
                                    {!list
                                        ? null
                                        : list.map((item, index) => (
                                              <React.Fragment key={index}>
                                                  {renderItem(item)}
                                              </React.Fragment>
                                          ))}
                                </View>
                            </>
                        ) : null}
                        {selected === 'normal' ? null : (
                            <View style={styles.content}>
                                <View
                                    style={{ flex: 1, flexDirection: 'column' }}
                                >
                                    <Text style={styles.headerInput}>
                                        Ngày hết hạn:
                                    </Text>
                                    <KeyboardAvoidingView
                                        behavior={
                                            Platform.OS == 'ios'
                                                ? 'padding'
                                                : ''
                                        }
                                        style={{
                                            backgroundColor: '#fff',
                                        }}
                                    >
                                        <View>
                                            <View>
                                                <TouchableOpacity
                                                    style={styles.inputBtn}
                                                    onPress={
                                                        handleOnPressStartDate
                                                    }
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
                                                        {exprirationDate}
                                                    </Text>
                                                    <View
                                                        style={styles.iconStyle}
                                                    >
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
                                                <View
                                                    style={styles.centeredView}
                                                >
                                                    <View
                                                        style={styles.modalView}
                                                    >
                                                        <DatePicker
                                                            mode="calendar"
                                                            minimumDate={format(
                                                                addDays(
                                                                    currentDate,
                                                                    1
                                                                ),
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
                                                            onSelectedChange={(
                                                                date
                                                            ) =>
                                                                setExprirationDate(
                                                                    format(
                                                                        parse(
                                                                            date,
                                                                            'yyyy/MM/dd',
                                                                            new Date()
                                                                        ),
                                                                        'dd-MM-yyyy'
                                                                    )
                                                                )
                                                            }
                                                            options={{
                                                                backgroundColor:
                                                                    '#FFF',
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
                                {selected === 'Donation' ? null : (
                                    <View
                                        style={{
                                            flex: 1,
                                            flexDirection: 'column',
                                        }}
                                    >
                                        <Text style={styles.headerInput}>
                                            Ngày diễn ra:
                                        </Text>
                                        <KeyboardAvoidingView
                                            behavior={
                                                Platform.OS == 'ios'
                                                    ? 'padding'
                                                    : ''
                                            }
                                            style={{
                                                backgroundColor: '#fff',
                                            }}
                                        >
                                            <View>
                                                <View>
                                                    <TouchableOpacity
                                                        style={styles.inputBtn}
                                                        onPress={
                                                            handleOnPressActiDate
                                                        }
                                                    >
                                                        {dateActivity !==
                                                        'Chọn ngày' ? (
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
                                                                {format(
                                                                    parse(
                                                                        dateActivity,
                                                                        'MM-dd-yyyy',
                                                                        new Date()
                                                                    ),
                                                                    'dd-MM-yyyy'
                                                                )}
                                                            </Text>
                                                        ) : (
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
                                                                {dateActivity}
                                                            </Text>
                                                        )}

                                                        <View
                                                            style={
                                                                styles.iconStyle
                                                            }
                                                        >
                                                            <Image
                                                                style={
                                                                    styles.icon
                                                                }
                                                                source={require('../../assets/calendar.png')}
                                                            />
                                                        </View>
                                                    </TouchableOpacity>
                                                </View>

                                                {/* Create modal for date picker */}
                                                <Modal
                                                    animationType="slide"
                                                    transparent={true}
                                                    visible={openActiDatePicker}
                                                >
                                                    <View
                                                        style={
                                                            styles.centeredView
                                                        }
                                                    >
                                                        <View
                                                            style={
                                                                styles.modalView
                                                            }
                                                        >
                                                            <DatePicker
                                                                mode="calendar"
                                                                minimumDate={format(
                                                                    addDays(
                                                                        currentDate,
                                                                        1
                                                                    ),
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
                                                                onSelectedChange={(
                                                                    date
                                                                ) =>
                                                                    setDateActivity(
                                                                        format(
                                                                            parse(
                                                                                date,
                                                                                'yyyy/MM/dd',
                                                                                new Date()
                                                                            ),
                                                                            'MM-dd-yyyy'
                                                                        )
                                                                    )
                                                                }
                                                                options={{
                                                                    backgroundColor:
                                                                        '#FFF',
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
                                                                    handleOnPressActiDate
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
                                )}
                            </View>
                        )}
                        {selected === 'Donation' ||
                        selected === 'normal' ? null : (
                            <View
                                style={{
                                    marginTop: 5,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                            >
                                <Text
                                    style={{
                                        fontSize: 14,
                                        fontStyle: 'italic',
                                        color: COLORS.primary,
                                    }}
                                >
                                    (* Lưu ý: ngày diễn ra phải sau ngày hết hạn
                                    đăng ký)
                                </Text>
                            </View>
                        )}
                        <Text style={styles.headerInput}>
                            Hình ảnh bài viết:
                        </Text>
                        <FlatList
                            data={selectedImages}
                            horizontal={true}
                            renderItem={({ item, index }) => (
                                <View
                                    style={{
                                        position: 'relative',
                                        flexDirection: 'column',
                                        flex: 1,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                    key={index}
                                >
                                    <Image
                                        source={{ uri: item.uri }}
                                        style={{
                                            paddingVertical: 4,
                                            marginLeft: 12,
                                            width: 80,
                                            height: 80,
                                            borderRadius: 12,
                                        }}
                                    />
                                    <TouchableOpacity
                                        onPress={() => removeImage(item)}
                                        style={{
                                            position: 'absolute',
                                            top: 0,
                                            right: 0,
                                            backgroundColor: '#C5C7C7',
                                            borderRadius: 12, // Bo tròn góc
                                            padding: 5,
                                        }}
                                    >
                                        <MaterialIcons
                                            name="delete"
                                            size={20}
                                            color={COLORS.black}
                                        />
                                    </TouchableOpacity>
                                </View>
                            )}
                        />
                        <TouchableOpacity
                            style={{
                                flex: 1,
                                flexDirection: 'row',
                                paddingVertical: 10,
                                marginHorizontal: 10,
                            }}
                            onPress={() => handleImageSelection()}
                        >
                            <Image
                                source={require(addPicture)}
                                style={{
                                    height: 50,
                                    width: 50,
                                    marginRight: 15,
                                }}
                            />
                            <View
                                style={{
                                    backgroundColor: '#C5C7C7',
                                    flex: 1,
                                    padding: 10,
                                    borderRadius: 5,
                                }}
                            >
                                <Text
                                    style={{
                                        fontStyle: 'italic',
                                        fontSize: 13,
                                        color: '#8B0000',
                                        backgroundColor: 'transparent',
                                    }}
                                >
                                    * (Ảnh chụp phải rõ nét, đầy đủ nơi tổ chức
                                    tình nguyện)
                                </Text>
                            </View>
                        </TouchableOpacity>
                        <View
                            style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginBottom: 100,
                            }}
                        >
                            <View
                                style={{
                                    width: 200,
                                }}
                            >
                                <CustomButton
                                    title="ĐĂNG BÀI"
                                    onPress={() => uploadPost()}
                                    isLoading={ButtonPress}
                                />
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    )
}

export default Create
