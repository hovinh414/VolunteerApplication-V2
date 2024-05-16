import {
    View,
    Text,
    useWindowDimensions,
    FlatList,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    RefreshControl,
    Linking,
} from 'react-native'
import React, { useState, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { COLORS, FONTS, SIZES, images } from '../../constants'
import {
    Feather,
    AntDesign,
    Ionicons,
    MaterialIcons,
    MaterialCommunityIcons,
} from '@expo/vector-icons'
import { TabView, SceneMap, TabBar } from 'react-native-tab-view'
import CustomViewInfo from '../../components/custom/CustomViewInfo'
import ImageAvata from '../../assets/hero2.jpg'
import { Image } from 'expo-image'
import AsyncStoraged from '../../services/AsyncStoraged'
import axios from 'axios'
import API_URL from '../../config/config'
import { useNavigation } from '@react-navigation/native'
import { format } from 'date-fns'
const cover = '../../assets/cover.jpg'
const PostsRoute = () => {
    const screenWidth = Dimensions.get('window').width
    const [posts, setPosts] = useState([])
    const [token, setToken] = useState('')
    const [avatar, setAvatar] = useState(null)
    const [type, setType] = useState(null)
    const [currentPage, setCurrentPage] = useState(1)
    const [refreshing, setRefreshing] = useState(false)
    const navigation = useNavigation()
    useEffect(() => {
        getToken()
    }, [])

    const getToken = async () => {
        const token = await AsyncStoraged.getToken()
        setToken(token)
    }
    const onRefresh = () => {
        setRefreshing(true)
        setCurrentPage(1)
        getPosts().then(() => {
            setRefreshing(false)
        })
    }
    const getPosts = async () => {
        const config = {
            headers: {
                Authorization: token,
            },
        }

        try {
            const response = await axios.get(
                API_URL.API_URL + '/activity/join',
                config
            )

            if (response.data.status === 'SUCCESS') {
                setPosts(response.data.data)
            }
        } catch (error) {
            console.log('API Error get activity:', error)
        }
    }

    useEffect(() => {
        getPosts()
    }, [token])
    const viewDetailPost = async (_postId) => {
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
        }
    }
    return (
        <View>
            {posts.length === 0 ? (
                <View
                    style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <Text style={{ fontWeight: 'bold', fontSize: 20 }}>
                        Chưa tham gia hoạt động nào
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={posts}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                        />
                    }
                    renderItem={({ item, index }) => (
                        <TouchableOpacity
                            key={index}
                            style={{
                                flex: 1,
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                            activeOpacity={0.8}
                            onPress={() => viewDetailPost(item._postId)}
                        >
                            <View
                                style={{
                                    flexDirection: 'row',
                                    backgroundColor: '#F0F0F0',
                                    width: screenWidth - 24,
                                    height: 100,
                                    marginHorizontal: 12,
                                    marginTop: 15,
                                    justifyContent: 'flex-start',
                                    borderRadius: 15,
                                    padding: 10,
                                }}
                            >
                                <Image
                                    source={item.media}
                                    style={{
                                        width: 80,
                                        height: 80,
                                        borderRadius: 15,
                                    }}
                                />
                                <View
                                    style={{
                                        flexDirection: 'column',
                                        marginTop: 10,
                                        justifyContent: 'flex-start',
                                        marginLeft: 12,
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontSize: 17,
                                        }}
                                    >
                                        <Text
                                            style={{
                                                marginLeft: 12,
                                                marginTop: 15,
                                                fontWeight: '700',
                                                color: COLORS.primary,
                                            }}
                                        >
                                            {item.ownerDisplayname}
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
                                            style={{
                                                flexDirection: 'row',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    color: COLORS.black,
                                                    fontSize: 14,
                                                }}
                                            >
                                                Ngày diễn ra:{' '}
                                                {item.dateActivity ? (
                                                    <Text
                                                        style={{
                                                            color: COLORS.primary,
                                                            fontSize: 14,
                                                            fontWeight: 'bold',
                                                        }}
                                                    >
                                                        {
                                                            (formattedDate =
                                                                format(
                                                                    new Date(
                                                                        item.dateActivity
                                                                    ),
                                                                    'dd-MM-yyyy'
                                                                ))
                                                        }
                                                    </Text>
                                                ) : null}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>
                    )}
                />
            )}
        </View>
    )
}

const InfoRoute = ({ navigation }) => {
    const [address, setAddress] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const getUserStored = async () => {
        const userStored = await AsyncStoraged.getData()
        setAddress(userStored.address)
        setEmail(userStored.email)
        setPhone(userStored.phone)
    }
    useEffect(() => {
        getUserStored()
    }, [])
    const handleMap = () => {
        const mapAddress = encodeURIComponent(address)
        const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${mapAddress}`
        Linking.openURL(googleMapsUrl)
    }
    const handlePhone = () => {
        const phoneUrl = `tel:${phone}`
        Linking.openURL(phoneUrl)
    }
    const handleEmail = () => {
        const emailUrl = `mailto:${email}`
        Linking.openURL(emailUrl)
    }
    return (
        <ScrollView style={{ flex: 1, marginHorizontal: 22 }}>
            <View style={{ paddingTop: 20 }}>
                <CustomViewInfo
                    onPress={handleMap}
                    value={address}
                    icon={'location-outline'}
                    height={70}
                />
            </View>
            <View style={{ paddingTop: 20 }}>
                <CustomViewInfo
                    onPress={handleEmail}
                    value={email}
                    icon={'mail-outline'}
                    height={48}
                />
            </View>
            <View style={{ paddingTop: 20 }}>
                <CustomViewInfo
                    onPress={handlePhone}
                    value={phone}
                    icon={'call-outline'}
                    height={48}
                />
            </View>
        </ScrollView>
    )
}

const renderScene = SceneMap({
    first: PostsRoute,
    second: InfoRoute,
})
const Profile = ({ navigation, route }) => {
    const [avatar, setAvatar] = useState('')
    const [fullname, setFullname] = useState('')
    const getUserStored = async () => {
        const userStored = await AsyncStoraged.getData()
        setAvatar(userStored.avatar)
        setFullname(userStored.fullname)
    }
    useEffect(() => {
        getUserStored()
    }, [])

    const layout = useWindowDimensions()
    const [index, setIndex] = useState(0)
    const [routes] = useState([
        { key: 'first', title: 'Hoạt động đã tham gia', icon: 'home' },
        { key: 'second', title: 'Thông tin', icon: 'user' },
    ])

    const renderTabBar = (props) => (
        <TabBar
            {...props}
            indicatorStyle={{
                backgroundColor: COLORS.primary,
            }}
            renderIcon={({ route, focused, color }) => (
                <AntDesign
                    name={route.icon}
                    size={20}
                    color={focused ? COLORS.black : 'gray'}
                />
            )}
            style={{
                backgroundColor: '#fff',
                height: 64,
            }}
            renderLabel={({ focused, route }) => (
                <Text style={[{ color: focused ? COLORS.black : 'gray' }]}>
                    {route.title}
                </Text>
            )}
        />
    )
    const onRefresh = () => {
        getUserStored()
    }
    React.useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            onRefresh()
        })

        return unsubscribe
    }, [navigation])
    return (
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor: '#fff',
            }}
        >
            <View>
                <View
                    style={{
                        width: '100%',
                        position: 'relative',
                        height: 'auto',
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
                                onPress={() =>
                                    navigation.navigate('EditProfile')
                                }
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
                                    name="sharealt"
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
                                    name="more-horizontal"
                                    size={20}
                                    color={COLORS.primary}
                                />
                            </TouchableOpacity>
                        </View>
                        {/* <View
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
                                    200
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
                        </View> */}
                    </View>
                </View>
            </View>
            <View style={{ flex: 1, top: -67 }}>
                <View
                    style={{
                        flex: 1,
                        marginHorizontal: 12,
                    }}
                >
                    <TabView
                        navigationState={{ index, routes }}
                        renderScene={renderScene}
                        onIndexChange={setIndex}
                        initialLayout={{ width: layout.width }}
                        renderTabBar={renderTabBar}
                    />
                </View>
            </View>
        </SafeAreaView>
    )
}

export default Profile
