import {
    View,
    Text,
    TouchableOpacity,
    Dimensions,
    FlatList,
    StyleSheet,
    ActivityIndicator,
    Easing,
} from 'react-native'
import * as Progress from 'react-native-progress'
import { SafeAreaView } from 'react-native-safe-area-context'
import React, { useState, useEffect } from 'react'
import { COLORS, FONTS, SIZES, images } from '../constants'
import {
    AntDesign,
    Ionicons,
    Feather,
    MaterialIcons,
    MaterialCommunityIcons,
    Entypo,
} from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import axios from 'axios'
import API_URL from '../config/config'
import { Image } from 'expo-image'
import AsyncStoraged from '../services/AsyncStoraged'
import ModalLoading from '../components/modal/ModalLoading'
import MenuFeed from '../components/menu/MenuFeed'
import Post from './Feed/Post'
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message'
import { IOChanel, SocketIOService } from '../scripts/socket'
const ioService = new SocketIOService()
const Feed = ({ navigation, route }) => {
    // const { postId } = ;
    const onRefreshPost = () => {
        setCurrentPage(0)
        setPosts([])
        setUserProdcutive([])
        setPostOutStandings([])
        setJoinedPost([])
        getPosts()
        getUserProductive()
        getPostOutStanding()
        setTypePost('normal')
    }

    const windowWidth = Dimensions.get('window').width
    const [posts, setPosts] = useState([])
    const [postOutStandings, setPostOutStandings] = useState([])
    const [userProductive, setUserProdcutive] = useState([])
    const [joinedPost, setJoinedPost] = useState([])
    const [token, setToken] = useState('')
    const [orgId, setOrgId] = useState()
    const [typePost, setTypePost] = useState('normal')
    const [type, setType] = useState()
    const [isFetchingNextPage, setIsFetchingNextPage] = useState(false)
    const [currentPage, setCurrentPage] = useState(0)
    const [isLoading, setIsLoading] = useState(false)
    const [loading, setLoading] = useState(false)
    const [menuVisible, setMenuVisible] = useState(false)

    const getToken = async () => {
        const token = await AsyncStoraged.getToken()
        setToken(token)
    }

    useEffect(() => {
        setJoinedPost((prevJoinedPost) => [...prevJoinedPost, route.params])
    }, [route.params])
    useEffect(() => {
        getToken()
    }, [])
    const getUserStored = async () => {
        const userStored = await AsyncStoraged.getData()
        if (userStored) {
            setOrgId(userStored._id)
            setType(userStored.type)
        } else {
            setOrgId(null)
            setType(null)
        }
    }
    useEffect(() => {
        getUserStored()
    }, [])
    const getPosts = async () => {
        const config = {
            headers: {
                Authorization: token,
            },
        }
        try {
            const response = await axios.get(
                API_URL.API_URL + '/posts?page=1&limit=5',
                config
            )

            if (response.data.status === 'SUCCESS') {
                setPosts(response.data.data.posts)
                setJoinedPost(response.data.data.joinedPost)
            }
        } catch (error) {
            console.log('API Error get post:', error)
        }
    }
    const getUserProductive = async () => {
        try {
            const response = await axios.get(
                API_URL.API_URL + '/user/productive-activities'
            )

            if (response.data.status === 'SUCCESS') {
                setUserProdcutive(response.data.data)
            }
        } catch (error) {
            console.log('API Error get user:', error)
        }
    }
    const getPostOutStanding = async () => {
        try {
            const response = await axios.get(
                API_URL.API_URL + '/post-top/out-standing'
            )

            if (response.data.status === 'SUCCESS') {
                setPostOutStandings(response.data.data)
            }
        } catch (error) {
            console.log('API Error get post out standing:', error)
        }
    }
    useEffect(() => {
        getPosts()
        getUserProductive()
        getPostOutStanding()
    }, [token])

    const [refreshing, setRefreshing] = useState(false)
    const onRefresh = () => {
        setRefreshing(true)
        setCurrentPage(1)
        setTypePost('normal')
        getPosts().then(() => {
            setRefreshing(false)
        })
    }
    const options = [
        {
            title: 'Đang theo dõi',
            icon: 'people-outline',
            action: () => getPostsFollow(),
        },
        {
            title: 'Đã tham gia',
            icon: 'heart-outline',
            action: () => alert('Đã tham gia'),
        },
        {
            title: 'Sắp diễn ra',
            icon: 'reader-outline',
            action: () => alert('Sắp diễn ra'),
        },
    ]
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
                if (typePost === 'normal') {
                    const response = await axios.get(
                        `${API_URL.API_URL}/posts?page=${
                            currentPage + 1
                        }&limit=5`,
                        config
                    )

                    if (response.data && response.data.status === 'SUCCESS') {
                        setPosts([...posts, ...response.data.data.posts])
                        setJoinedPost([
                            ...joinedPost,
                            ...response.data.data.joinedPost,
                        ])
                        setCurrentPage(currentPage + 1)
                    } else if (response.data) {
                        setPosts([...posts, ...response.data.data.posts])
                        setJoinedPost([
                            ...joinedPost,
                            ...response.data.data.joinedPost,
                        ])
                    }
                } else {
                    const res = await axios({
                        method: 'post',
                        url: `${API_URL.API_URL}/posts/follows?page=${
                            currentPage + 1
                        }&limit=5`,
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: token,
                        },
                    })

                    if (res.data.status === 'SUCCESS') {
                        setPosts([...posts, ...res.data.data.postsInformation])
                        setCurrentPage(currentPage + 1)
                    } else {
                        setPosts([...posts, ...res.data.data.postsInformation])
                    }
                }
            } catch (error) {
                if (error.response.status === 400) {
                    setIsLoading(false)
                    Toast.show({
                        type: 'noPost',
                        text1: 'Bạn đã xem hết rồi',
                        text2: 'Bạn đã xem tất cả bài viết mới nhất',
                        visibilityTime: 2500,
                        position: 'bottom',
                        bottomOffset: 70,
                    })
                } else {
                    console.log(error)
                }
            } finally {
                setIsFetchingNextPage(false)
            }
        }
    }

    const getPostsFollow = async () => {
        setLoading(true)
        try {
            const res = await axios({
                method: 'post',
                url: API_URL.API_URL + '/posts/follows?page=1&limit=5',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token,
                },
            })

            if (res.data.status === 'SUCCESS') {
                setPosts(res.data.data.postsInformation)
                setTypePost('follow')
            }
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }
    const viewDetailPost = async (_postId) => {
        setLoading(true)
        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,
            },
        }
        try {
            const response = await axios.get(
                API_URL.API_URL + '/post/' + _postId,
                config
            )
            if (response.data.status === 'SUCCESS') {
                navigation.navigate('DetailPost', response.data.data)
            }
        } catch (error) {
            console.log('API Error:', error)
        } finally {
            setLoading(false)
        }
    }
    const viewProfile = async (_orgId) => {
        setLoading(true)
        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,
            },
        }
        try {
            const response = await axios.get(
                API_URL.API_URL + '/profile/' + _orgId,
                config
            )
            if (response.data.status === 'SUCCESS') {
                navigation.navigate(
                    'ProfileUser',
                    response.data.data.profileResult
                )
            }
        } catch (error) {
            console.log('API Error:', error)
        } finally {
            setLoading(false)
        }
    }
    const RenderSuggestionsContainer = () => {
        return (
            <View
                style={{
                    paddingBottom: 5,
                    borderBottomWidth: 1,
                    borderBottomColor: '#fff',
                }}
            >
                <ModalLoading visible={loading} />
                <View
                    style={{
                        paddingVertical: 10,
                        paddingLeft: 15,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                    }}
                >
                    <View
                        activeOpacity={0.8}
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <Text
                            style={{
                                color: COLORS.black,
                                fontWeight: '700',
                                fontSize: 14,
                                marginLeft: 5,
                            }}
                        >
                            Tài khoản tích cực
                        </Text>
                    </View>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={{ flexDirection: 'row', marginRight: 10 }}
                        onPress={() =>
                            navigation.navigate(
                                'ProductiveActivities',
                                userProductive
                            )
                        }
                    >
                        <Text
                            style={{
                                color: COLORS.primary,
                                fontSize: 14,
                                marginLeft: 10,
                            }}
                        >
                            Xem tất cả
                        </Text>
                    </TouchableOpacity>
                </View>
                <FlatList
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    data={userProductive}
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
                                onPress={
                                    item.userId === orgId
                                        ? () =>
                                              navigation.navigate(
                                                  'ProfileOrganisation'
                                              )
                                        : () => viewProfile(item.userId)
                                }
                                style={{
                                    paddingVertical: 4,
                                    marginLeft: 12,
                                }}
                            >
                                <View
                                    style={{
                                        flexDirection: 'column',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        width: 90,
                                    }}
                                >
                                    <Image
                                        source={item.avatar}
                                        style={{
                                            width: 80,
                                            height: 80,
                                            borderRadius: 80,
                                            borderWidth: 2,

                                            borderColor: '#FF493C',
                                        }}
                                    />
                                    <Text
                                        style={{ fontSize: 12, marginTop: 7 }}
                                        numberOfLines={1}
                                    >
                                        {item.fullName}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    )}
                />
                <View
                    style={{
                        borderColor: '#cccc',
                        borderTopWidth: 0.5,
                        paddingVertical: 10,
                        paddingLeft: 15,
                        marginTop: 20,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                    }}
                >
                    <View
                        activeOpacity={0.8}
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <Ionicons
                            name="newspaper-outline"
                            size={20}
                            color={COLORS.primary}
                        />
                        <Text
                            style={{
                                color: COLORS.black,
                                fontWeight: '700',
                                fontSize: 14,
                                marginLeft: 5,
                            }}
                        >
                            Hoạt động nổi bật
                        </Text>
                    </View>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={{ flexDirection: 'row', marginRight: 10 }}
                        onPress={() =>
                            navigation.navigate(
                                'FeaturedArticle',
                                postOutStandings
                            )
                        }
                    >
                        <Text
                            style={{
                                color: COLORS.primary,
                                fontSize: 14,
                                marginLeft: 10,
                            }}
                        >
                            Xem tất cả
                        </Text>
                    </TouchableOpacity>
                </View>
                <FlatList
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    data={postOutStandings}
                    renderItem={({ item, index }) => (
                        <TouchableOpacity
                            key={index}
                            activeOpacity={0.8}
                            style={{
                                flexDirection: 'column',
                                flex: 1,
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                            onPress={() => viewDetailPost(item._id)}
                        >
                            <View
                                style={{
                                    marginLeft: 12,
                                }}
                            >
                                <View style={{}}>
                                    <Image
                                        source={item.media}
                                        style={{
                                            width: 300,
                                            height: 220,
                                            borderTopLeftRadius: 15,
                                            borderTopRightRadius: 15,
                                        }}
                                    />
                                    <LinearGradient
                                        colors={[
                                            'rgba(0,0,0,0)',
                                            'rgba(0,0,0,1)',
                                        ]}
                                        style={{
                                            position: 'absolute',
                                            bottom: 0,
                                            width: 300,
                                            height: 80,
                                        }}
                                    />
                                </View>
                                <View
                                    style={{
                                        flexDirection: 'row',

                                        position: 'absolute',
                                        left: 10,
                                        bottom: 5,
                                    }}
                                >
                                    <Image
                                        source={item.ownerInfo.avatar}
                                        style={{
                                            height: 48,
                                            width: 48,
                                            borderRadius: 24,
                                        }}
                                    />
                                    <View
                                        style={{
                                            flexDirection: 'column',
                                            marginLeft: 8,
                                            justifyContent: 'space-between',
                                            marginVertical: 10,
                                        }}
                                    >
                                        <Text
                                            style={{
                                                fontSize: 15,
                                                color: '#fff',
                                                fontWeight: '500',
                                            }}
                                        >
                                            {item.ownerInfo.fullName}
                                        </Text>
                                        <Text
                                            style={{
                                                fontSize: 14,
                                                color: '#fff',
                                            }}
                                        ></Text>
                                    </View>
                                </View>
                            </View>
                            <View
                                style={{
                                    marginLeft: 12,
                                }}
                            >
                                <View
                                    style={{
                                        backgroundColor: '#F0F0F0',
                                        width: 300,
                                        height: 150,
                                        borderBottomLeftRadius: 15,
                                        borderBottomRightRadius: 15,
                                    }}
                                >
                                    <Text
                                        style={{
                                            marginLeft: 12,
                                            marginTop: 15,
                                            fontSize: 16,
                                        }}
                                    >
                                        {item.content.length > 23
                                            ? `${item.content.slice(0, 23)}...`
                                            : item.content}
                                    </Text>
                                    <View
                                        style={{
                                            marginTop: 17,
                                            paddingVertical: 10,
                                            marginHorizontal: 10,
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                        }}
                                    >
                                        <View
                                            activeOpacity={0.8}
                                            style={{
                                                flexDirection: 'row',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    color: COLORS.black,
                                                    fontSize: 15,
                                                    marginLeft: 5,
                                                }}
                                            >
                                                Đã tham gia:{' '}
                                                <Text
                                                    style={{
                                                        color: COLORS.primary,
                                                        fontSize: 15,
                                                        fontWeight: 'bold',
                                                    }}
                                                >
                                                    {
                                                        item.numOfPeopleParticipated
                                                    }{' '}
                                                    / {item.participants}
                                                </Text>
                                            </Text>
                                        </View>
                                        <TouchableOpacity
                                            activeOpacity={0.8}
                                            style={{
                                                flexDirection: 'row',
                                                marginRight: 10,
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    color: COLORS.primary,
                                                    fontSize: 15,
                                                    marginLeft: 10,
                                                }}
                                            >
                                                {(
                                                    (item.numOfPeopleParticipated /
                                                        item.participants) *
                                                    100
                                                ).toFixed(0)}{' '}
                                                %
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View
                                        style={{
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <Progress.Bar
                                            progress={
                                                item.numOfPeopleParticipated /
                                                item.participants
                                            }
                                            color="#FF493C"
                                            height={8}
                                            width={280}
                                            unfilledColor="#cccc"
                                            borderColor="#cccc"
                                            borderRadius={25}
                                        />
                                    </View>
                                    <View
                                        style={{
                                            paddingVertical: 10,
                                            marginHorizontal: 10,
                                        }}
                                    >
                                        <TouchableOpacity
                                            style={{
                                                backgroundColor: '#F0F0F0',
                                                borderRadius: 10,
                                                padding: 5,
                                                borderWidth: 2,
                                                borderColor: COLORS.primary,
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                            }}
                                            onPress={() =>
                                                viewDetailPost(item._id)
                                            }
                                        >
                                            <Text
                                                style={{
                                                    fontSize: 16,
                                                    fontWeight: '500',
                                                    color: COLORS.primary,
                                                }}
                                            >
                                                Xem chi tiết
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                    {/* <View
                                        style={{
                                            paddingVertical: 10,
                                            marginHorizontal: 10,
                                        }}
                                    >
                                        {type !==
                                        'User' ? null : !joinedPost ? null : joinedPost.includes(
                                              item._id
                                          ) ? (
                                            <View
                                                style={{
                                                    backgroundColor: '#ccc',
                                                    borderRadius: 10,
                                                    padding: 5,
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                }}
                                            >
                                                <Text
                                                    style={{
                                                        ...FONTS.body5,
                                                        color: 'black',
                                                    }}
                                                >
                                                    Đã tham gia
                                                </Text>
                                            </View>
                                        ) : item.isExprired ? (
                                            <View
                                                style={{
                                                    backgroundColor: '#cccc',
                                                    borderRadius: 10,
                                                    padding: 5,

                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                }}
                                            >
                                                <Text
                                                    style={{
                                                        ...FONTS.body5,
                                                        color: 'black',
                                                    }}
                                                >
                                                    Đã hết hạn
                                                </Text>
                                            </View>
                                        ) : (
                                            <TouchableOpacity
                                                style={{
                                                    backgroundColor:
                                                        COLORS.primary,
                                                    borderRadius: 10,
                                                    padding: 5,

                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                }}
                                                onPress={() =>
                                                    viewDetailPost(item._id)
                                                }
                                            >
                                                <Text
                                                    style={{
                                                        ...FONTS.body5,
                                                        color: 'white',
                                                    }}
                                                >
                                                    Tham Gia
                                                </Text>
                                            </TouchableOpacity>
                                        )}
                                    </View> */}
                                </View>
                            </View>
                        </TouchableOpacity>
                    )}
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
    const toastConfig = {
        warning: (props) => (
            <BaseToast
                {...props}
                style={{
                    borderLeftColor: '#E0E0E0',
                    backgroundColor: '#E0E0E0',
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
        noPost: ({ text1, text2, email }) => (
            <View
                style={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    width: '95%',
                    height: 'auto',
                    borderLeftColor: '#E0E0E0',
                    backgroundColor: '#E0E0E0',
                    borderRadius: 12,
                    padding: 10,
                    justifyContent: 'center',
                }}
            >
                <View
                    style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: 5,
                    }}
                >
                    <Ionicons
                        name="checkmark-circle-outline"
                        size={70}
                        color={COLORS.black}
                    />
                </View>
                <View
                    style={{
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: 5,
                    }}
                >
                    <Text
                        style={{
                            fontSize: 18,
                            fontWeight: '700',
                            color: COLORS.black,
                        }}
                    >
                        {text1}
                    </Text>
                    <Text
                        style={{
                            fontSize: 16,
                            color: COLORS.black,
                            marginTop: 5,
                            marginRight: 5,
                        }}
                    >
                        {text2}
                    </Text>
                    <TouchableOpacity onPress={onRefreshPost}>
                        <Text
                            style={{
                                fontSize: 16,
                                color: COLORS.blue,
                                fontWeight: 'bold',
                                marginTop: 5,
                                marginRight: 5,
                            }}
                        >
                            Làm mới lại trang chủ
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
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

    const renderHeader = () => {
        return (
            <View
                style={{
                    paddingHorizontal: 22,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}
            >
                <MenuFeed options={options} />
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                    }}
                >
                    {token ? (
                        <>
                            <TouchableOpacity
                                onPress={() =>
                                    navigation.navigate('NotificationScreen')
                                }
                                style={{
                                    height: 45,
                                    width: 45,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: '#fff',
                                    shadowColor: '#18274B',
                                    shadowOffset: {
                                        width: 0,
                                        height: 4.5,
                                    },
                                    shadowOpacity: 0.12,
                                    shadowRadius: 6.5,
                                    elevation: 2,
                                    borderRadius: 22,
                                    marginRight: 10,
                                }}
                            >
                                <Ionicons
                                    name="notifications-outline"
                                    size={26}
                                    color={COLORS.black}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() =>
                                    navigation.navigate('Chat', ioService)
                                }
                                style={{
                                    height: 45,
                                    width: 45,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: '#fff',
                                    shadowColor: '#18274B',
                                    shadowOffset: {
                                        width: 0,
                                        height: 4.5,
                                    },
                                    shadowOpacity: 0.12,
                                    shadowRadius: 6.5,
                                    elevation: 2,
                                    borderRadius: 22,
                                }}
                            >
                                <AntDesign
                                    name="message1"
                                    size={23}
                                    color={COLORS.black}
                                />
                            </TouchableOpacity>
                        </>
                    ) : (
                        <>
                            <TouchableOpacity
                                style={{
                                    height: 45,
                                    width: 45,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: '#fff',
                                    shadowColor: '#18274B',
                                    shadowOffset: {
                                        width: 0,
                                        height: 4.5,
                                    },
                                    shadowOpacity: 0.12,
                                    shadowRadius: 6.5,
                                    elevation: 2,
                                    borderRadius: 22,
                                    marginRight: 10,
                                }}
                                onPress={() =>
                                    navigation.navigate('LoginScreen')
                                }
                            >
                                <Ionicons
                                    name="notifications-outline"
                                    size={26}
                                    color={COLORS.black}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{
                                    height: 50,
                                    width: 50,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: '#fff',
                                    shadowColor: '#18274B',
                                    shadowOffset: {
                                        width: 0,
                                        height: 4.5,
                                    },
                                    shadowOpacity: 0.12,
                                    shadowRadius: 6.5,
                                    elevation: 2,
                                    borderRadius: 22,
                                }}
                                onPress={() =>
                                    navigation.navigate('LoginScreen')
                                }
                            >
                                <AntDesign
                                    name="message1"
                                    size={23}
                                    color={COLORS.black}
                                />
                            </TouchableOpacity>
                        </>
                    )}
                </View>
            </View>
        )
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#FFF' }}>
            <ModalLoading visible={loading} />
            {renderHeader()}
            <View style={{ flex: 1, marginTop: 15, marginBottom: 20 }}>
                <Post
                    joinedPost={joinedPost}
                    posts={posts}
                    fetchNextPage={fetchNextPage}
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    headers={<RenderSuggestionsContainer />}
                    footer={RenderLoader}
                />
            </View>
            <View
                style={{
                    zIndex: 10,
                }}
            >
                <Toast config={toastConfig} />
            </View>
        </SafeAreaView>
    )
}
export default Feed
