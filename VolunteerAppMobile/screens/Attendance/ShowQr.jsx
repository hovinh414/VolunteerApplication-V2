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
    TextInput, // Import TextInput
} from 'react-native'
import QRCode from 'react-native-qrcode-svg'
import { MaterialIcons } from '@expo/vector-icons'
import { COLORS, FONTS } from '../../constants'
import AsyncStoraged from '../../services/AsyncStoraged'
import axios from 'axios'
import API_URL from '../../config/config'
import Modal from 'react-native-modal'
import { Image } from 'expo-image'
import { styles } from './style/showQrStyle'

const loading = '../../assets/loading.gif'
function ShowQr({ navigation }) {
    const screenWidth = Dimensions.get('window').width

    const [posts, setPosts] = useState([])
    const [token, setToken] = useState('')
    const [avatar, setAvatar] = useState(null)
    const [type, setType] = useState(null)
    const [orgId, setOrgId] = useState('normal')
    const [isFetchingNextPage, setIsFetchingNextPage] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [refreshing, setRefreshing] = useState(false)
    const [showSearchInput, setShowSearchInput] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [isModalVisible, setModalVisible] = useState(false)
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            onRefreshPost()
        })

        return unsubscribe
    }, [navigation])

    useEffect(() => {
        getToken()
    }, [])

    useEffect(() => {
        getUserStored()
    }, [])

    const getToken = async () => {
        const token = await AsyncStoraged.getToken()
        setToken(token)
    }

    const getUserStored = async () => {
        const userStored = await AsyncStoraged.getData()
        if (userStored) {
            setAvatar(userStored.avatar)
            setType(userStored.type)
            setOrgId(userStored._id)
        } else {
            setAvatar(null)
            setType(null)
        }
    }

    const onRefreshPost = () => {
        setCurrentPage(1)
        setPosts([])
        getPosts()
    }

    const calculateDaysDifference = (exprirationDate) => {
        const currentDate = new Date()
        const targetDate = new Date(exprirationDate)
        const timeDifference = targetDate - currentDate
        const daysDifference = Math.floor(
            timeDifference / (1000 * 60 * 60 * 24)
        )
        return daysDifference
    }

    const getPosts = async () => {
        axios
            .get(API_URL.API_URL + '/posts/' + orgId + '?page=1&limit=4')
            .then((response) => {
                if (response.data.status === 'SUCCESS') {
                    setPosts(response.data.data)
                }
            })
            .catch((error) => {
                console.log('API Error:', error)
            })
    }
    useEffect(() => {
        getPosts()
    }, [orgId])

    const onRefresh = () => {
        setRefreshing(true)
        setCurrentPage(1)
        getPosts().then(() => {
            setRefreshing(false)
        })
    }

    const fetchNextPage = async () => {
        if (!isFetchingNextPage) {
            setIsFetchingNextPage(true)
            setIsLoading(true)
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token,
                },
            }

            try {
                const response = await axios.get(
                    `${API_URL.API_URL}/posts?page=${currentPage + 1}&limit=6`,
                    config
                )

                if (response.data.status === 'SUCCESS') {
                    setPosts([...posts, ...response.data.data])
                    setCurrentPage(currentPage + 1)
                } else {
                    setPosts([...posts, ...response.data.data])
                }
            } catch (error) {
                setIsLoading(false)

                console.log('API Error:', error)
                return
            } finally {
                setIsFetchingNextPage(false)
            }
        }
    }

    const toggleSearchInput = () => {
        setShowSearchInput(!showSearchInput)
    }
    const renderQrCodeModal = (postId) => (
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
                    style={styles.container}
                >
                    <View
                        style={styles.background}
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
                        <QRCode value={postId} size={250} />
                    </View>
                </View>
            </TouchableOpacity>
        </Modal>
    )
    const RenderLoader = () => {
        return (
            <View>
                {isLoading ? (
                    <View
                        style={{
                            marginBottom: 50,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <Image
                            source={require(loading)}
                            style={{ width: 50, height: 50 }}
                        />
                    </View>
                ) : null}
            </View>
        )
    }
    return (
        <SafeAreaView
            KeyboardAvoidingView
            style={styles.header}
        >
            <View
                style={styles.view}
            >
                <TouchableOpacity
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        paddingVertical: 7,
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
                            Điểm danh
                        </Text>
                    )}
                </TouchableOpacity>

                {showSearchInput ? (
                    <View
                        style={styles.searchInput}
                    >
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
                            // Xử lý sự kiện nhập liệu, tìm kiếm, vv.
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
                onEndReached={fetchNextPage}
                onEndReachedThreshold={0.4}
                showsVerticalScrollIndicator={false}
                data={posts}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
                ListFooterComponent={RenderLoader}
                renderItem={({ item, index }) => (
                    <TouchableOpacity
                        key={index}
                        style={{
                            flex: 1,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                        activeOpacity={0.8}
                        onPress={() => setModalVisible(true)}
                    >
                        {renderQrCodeModal(item._id)}
                        <View
                            style={styles.viewList}
                        >
                            <View
                                style={styles.viewDate}
                            >
                                <Text
                                    style={{
                                        color: '#fff',
                                        fontSize: 12,
                                        fontWeight: 'bold',
                                    }}
                                >
                                    {calculateDaysDifference(
                                        item.exprirationDate
                                    )}{' '}
                                    ngày
                                </Text>
                            </View>
                            <Image
                                source={item.media}
                                style={{
                                    width: 110,
                                    height: 110,
                                    borderRadius: 15,
                                }}
                            />
                            <View
                                style={{
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    marginLeft: 12,
                                }}
                            >
                                <Text
                                    style={{
                                        marginTop: 15,
                                        ...FONTS.body5,
                                    }}
                                >
                                    {item.content.length > 15
                                        ? `${item.content.slice(0, 15)}...`
                                        : item.content}
                                </Text>
                                <Text
                                    style={{
                                        marginTop: 15,
                                        fontSize: 13,
                                    }}
                                >
                                    Đang diễn ra:{' '}
                                    <Text
                                        style={styles.date}
                                    >
                                        24-11-2023
                                    </Text>
                                </Text>
                                <View
                                    style={{
                                        marginTop: 8,
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                    }}
                                >
                                    <View
                                        activeOpacity={0.8}
                                        style={styles.viewAttendance}
                                    >
                                        <Text
                                            style={{
                                                color: COLORS.black,
                                                fontSize: 14,
                                            }}
                                        >
                                            Đã điểm danh:{' '}
                                            <Text
                                                style={styles.join}
                                            >
                                                {item.totalUserJoin} /{' '}
                                                {item.participants}
                                            </Text>
                                        </Text>
                                    </View>
                                </View>
                            </View>
                            <View
                                style={styles.attendance}
                            >
                                <Text style={{ fontWeight: 'bold' }}>
                                    Điểm danh
                                </Text>
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    onPress={() => setModalVisible(true)}
                                    style={styles.openModal}
                                >
                                    <MaterialIcons
                                        name={'qr-code-2'}
                                        size={50}
                                        color={COLORS.white}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </TouchableOpacity>
                )}
            />
        </SafeAreaView>
    )
}

export default ShowQr
