import {
    View,
    Text,
    useWindowDimensions,
    FlatList,
    ScrollView,
    TouchableOpacity,
    RefreshControl,
    Modal,
    ActivityIndicator,
    SafeAreaView,
} from 'react-native'
import React, { useState, useEffect } from 'react'
import { COLORS, FONTS, SIZES, images } from '../../constants'
import {
    Feather,
    AntDesign,
    Ionicons,
    MaterialIcons,
    MaterialCommunityIcons,
    FontAwesome,
} from '@expo/vector-icons'
import { TabView, SceneMap, TabBar } from 'react-native-tab-view'
import { SliderBox } from 'react-native-image-slider-box'
import * as Progress from 'react-native-progress'
import AsyncStoraged from '../../services/AsyncStoraged'
import * as ImagePicker from 'expo-image-picker'
import ImageUpload from '../../assets/add-image.png'
import axios from 'axios'
import ImageAvata from '../../assets/hero2.jpg'
import CustomButton from '../../components/custom/CustomButton'
import API_URL from '../../config/config'
import { Image } from 'expo-image'
import { useNavigation } from '@react-navigation/native'
import CustomViewInfo from '../../components/custom/CustomViewInfo'
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message'
import Post from '../Feed/Post'
const loading = '../../assets/loading.gif'
const cover = '../../assets/cover.jpg'

const ProfileCard = () => {
    const navigation = useNavigation()
    const [avatar, setAvatar] = useState('')
    const [fullname, setFullname] = useState('')
    const [isActive, setIsActive] = useState(false)
    const [follower, setFollower] = useState('')
    const getUserStored = async () => {
        const userStored = await AsyncStoraged.getData()
        setAvatar(userStored.avatar)
        setFullname(userStored.fullname)
        setIsActive(userStored.isActiveOrganization)
        setFollower(userStored.follower)
    }

    const getUserStoredEdit = async () => {
        const userStored = await AsyncStoraged.getData()
        setAvatar(userStored.avatar)
        setFullname(userStored.fullname)
    }
    useEffect(() => {
        getUserStored()
    }, [])
    const layout = useWindowDimensions()

    const onRefresh = () => {
        getUserStoredEdit()
    }
    React.useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            onRefresh()
        })

        return unsubscribe
    }, [navigation])

    return (
        <View>
            <View
                style={{
                    width: '100%',
                    height: 'auto',
                    position: 'relative',
                }}
            >
                <Image
                    source={require(cover)}
                    contentFit="cover"
                    style={{
                        height: 228,
                        width: '100%',
                    }}
                />
                <TouchableOpacity
                    style={{
                        position: 'absolute',
                        top: 15,
                        right: 12,
                        zIndex: 1,
                    }}
                    onPress={() => navigation.navigate('Settings')}
                >
                    <Feather name="menu" size={28} color={COLORS.black} />
                </TouchableOpacity>
                <View style={{ alignItems: 'center', top: -67 }}>
                    <Image
                        source={avatar ? { uri: avatar } : ImageAvata}
                        contentFit="contain"
                        style={{
                            height: 135,
                            width: 135,
                            borderRadius: 999,
                        }}
                    />

                    <Text
                        style={{
                            ...FONTS.h3,
                            color: COLORS.black,
                            marginVertical: 8,
                        }}
                    >
                        {fullname}
                    </Text>
                    {isActive ? (
                        <Text
                            style={{
                                color: '#4EB09B',
                                ...FONTS.body5,
                            }}
                        >
                            Đã xác thực{' '}
                            <FontAwesome
                                name="check-circle"
                                size={15}
                                color={'#4EB09B'}
                            />
                        </Text>
                    ) : (
                        <Text
                            style={{
                                color: COLORS.black,
                                ...FONTS.body5,
                            }}
                        >
                            Chưa xác thực{' '}
                            <FontAwesome
                                name="times-circle"
                                size={15}
                                color={COLORS.black}
                            />
                        </Text>
                    )}

                    <View style={{ flexDirection: 'row', paddingTop: 15 }}>
                        <TouchableOpacity
                            style={{
                                width: 160,
                                height: 36,
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: COLORS.primary,
                                borderRadius: 15,
                                marginHorizontal: 10,
                            }}
                            onPress={() => navigation.navigate('EditProfile')}
                        >
                            <Text
                                style={{
                                    ...FONTS.body5,
                                    color: '#fff',
                                }}
                            >
                                Chỉnh sửa thông tin
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{
                                width: 36,
                                height: 36,
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: '#DCDCDC',
                                borderRadius: 15,
                                marginRight: 5,
                            }}
                        >
                            <Feather
                                name="heart"
                                size={20}
                                color={COLORS.primary}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{
                                width: 36,
                                height: 36,
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: '#DCDCDC',
                                borderRadius: 15,
                                marginRight: 5,
                            }}
                        >
                            <Feather
                                name="message-square"
                                size={20}
                                color={COLORS.primary}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => navigation.navigate('InfoRoute')}
                            style={{
                                width: 36,
                                height: 36,
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: '#DCDCDC',
                                borderRadius: 15,
                                marginRight: 5,
                            }}
                        >
                            <AntDesign
                                name="user"
                                size={20}
                                color={COLORS.primary}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => navigation.navigate('VerifyOrgRoute')}
                            style={{
                                width: 36,
                                height: 36,
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: '#DCDCDC',
                                borderRadius: 15,
                                marginRight: 5,
                            }}
                        >
                            <Feather
                                name="upload"
                                size={20}
                                color={COLORS.primary}
                            />
                        </TouchableOpacity>
                    </View>
                    <View
                        style={{
                            paddingVertical: 8,
                            flexDirection: 'row',
                        }}
                    >
                        <View
                            style={{
                                flexDirection: 'column',
                                alignItems: 'center',
                                marginHorizontal: 10,
                            }}
                        >
                            <Text
                                style={{
                                    fontFamily: 'monterrat',
                                    fontSize: 16,
                                    lineHeight: 30,
                                    color: COLORS.black,
                                }}
                            >
                                {follower}
                            </Text>
                            <Text
                                style={{
                                    ...FONTS.body5,
                                    color: COLORS.black,
                                }}
                            >
                                Người theo dõi
                            </Text>
                        </View>

                        <View
                            style={{
                                flexDirection: 'column',
                                alignItems: 'center',
                                marginHorizontal: 10,
                            }}
                        >
                            <Text
                                style={{
                                    fontFamily: 'monterrat',
                                    fontSize: 16,
                                    lineHeight: 30,
                                    color: COLORS.black,
                                }}
                            >
                                67
                            </Text>
                            <Text
                                style={{
                                    ...FONTS.body5,
                                    color: COLORS.black,
                                }}
                            >
                                Đang theo dõi
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    )
}
const ProfileOrganisation = ({ navigation }) => {
    const [orgId, setOrgId] = useState()
    const [isLoading, setIsLoading] = useState(false)
    const [posts, setPosts] = useState([])
    const getUserStored = async () => {
        const userStored = await AsyncStoraged.getData()
        setOrgId(userStored._id)
    }

    useEffect(() => {
        getUserStored()
    }, [])
    const onRefresh = () => {
        setRefreshing(true)
        getPosts().then(() => {
            setRefreshing(false)
        })
    }
    React.useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            onRefresh()
        })
        return unsubscribe
    }, [navigation])
    const toastConfig = {
        success: (props) => (
            <BaseToast
                {...props}
                style={{
                    borderLeftColor: '#379A4F',
                    backgroundColor: '#379A4F',
                    borderRadius: 12,
                }}
                text1Style={{
                    color: '#fff',
                    fontSize: 18,
                }}
                text2Style={{
                    fontSize: 16,
                    color: '#fff',
                }}
                renderLeadingIcon={SuccessToast}
            />
        ),

        error: (props) => (
            <BaseToast
                {...props}
                style={{
                    borderLeftColor: '#FF0035',
                    backgroundColor: '#FF0035',
                    borderRadius: 12,
                }}
                text1Style={{
                    fontSize: 18,
                    color: '#fff',
                }}
                text2Style={{
                    fontSize: 16,
                    color: '#fff',
                }}
                renderLeadingIcon={ErrorToast}
            />
        ),
        warning: (props) => (
            <BaseToast
                {...props}
                style={{
                    borderLeftColor: '#FFE600',
                    backgroundColor: '#FFE600',
                    borderRadius: 12,
                }}
                text1Style={{
                    fontSize: 18,
                }}
                text2Style={{
                    fontSize: 16,
                    color: '#696969',
                }}
                renderLeadingIcon={WarningToast}
            />
        ),
    }
    const WarningToast = () => {
        // Your component logic here

        return (
            <View
                style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginLeft: 12,
                }}
            >
                <Ionicons
                    name="alert-circle-outline"
                    size={35}
                    color={COLORS.black}
                />
            </View>
        )
    }
    const SuccessToast = () => {
        // Your component logic here

        return (
            <View
                style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginLeft: 12,
                }}
            >
                <Ionicons
                    name="checkmark-circle-outline"
                    size={35}
                    color={'#fff'}
                />
            </View>
        )
    }
    const ErrorToast = () => {
        // Your component logic here

        return (
            <View
                style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginLeft: 12,
                }}
            >
                <Ionicons
                    name="close-circle-outline"
                    size={35}
                    color={'#fff'}
                />
            </View>
        )
    }

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
                        <ActivityIndicator size="large" color={COLORS.black} />
                    </View>
                ) : null}
            </View>
        )
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
    }, [orgId]) // Ensure that orgId is updated as expected

    const [refreshing, setRefreshing] = useState(false)
    const [isFetchingNextPage, setIsFetchingNextPage] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const fetchNextPage = async () => {
        if (!isFetchingNextPage && currentPage < 10) {
            setIsFetchingNextPage(true)
            setIsLoading(true)
            try {
                const response = await axios.get(
                    `${API_URL.API_URL}/posts/` +
                        orgId +
                        `?page=${currentPage + 1}&limit=4`
                )
                if (response.data.status === 'SUCCESS') {
                    setPosts([...posts, ...response.data.data])
                    setCurrentPage(currentPage + 1)
                } else {
                    setPosts([...posts, ...response.data.data])
                }
            } catch (error) {
                setIsLoading(false)
                Toast.show({
                    type: 'noPost',
                    text1: 'Bạn đã xem hết rồi',
                    text2: 'Bạn đã xem tất cả bài viết mới nhất',
                    visibilityTime: 2500,
                })
                console.log('API Error:', error)
            } finally {
                setIsLoading(false)
                setIsFetchingNextPage(false)
            }
        }
    }
    const RenderNoPost = () => {
        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 35,
                }}
            >
                <Text style={{ fontWeight: 'bold', fontSize: 20 }}>
                    Chưa có bài viết nào
                </Text>
            </View>
        )
    }
    return (
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor: '#fff',
                marginTop: 30,
            }}
        >
            <Post
                posts={posts}
                headers={<ProfileCard />}
                fetchNextPage={fetchNextPage}
                refreshing={refreshing}
                onRefresh={onRefresh}
                footer={
                    posts.length > 0 && posts ? (
                        <RenderLoader />
                    ) : (
                        <RenderNoPost />
                    )
                }
            />
            <View>
                <View
                    style={{
                        zIndex: 2,
                    }}
                >
                    <Toast config={toastConfig} />
                </View>
            </View>
        </SafeAreaView>
    )
}

export default ProfileOrganisation
