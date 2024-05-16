import {
    View,
    Text,
    useWindowDimensions,
    FlatList,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    ActivityIndicator,
    TextInput,
} from 'react-native'
import React, { useState, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import * as Progress from 'react-native-progress'
import { COLORS, FONTS, SIZES, images } from '../constants'
import {
    Feather,
    AntDesign,
    Ionicons,
    MaterialIcons,
    MaterialCommunityIcons,
} from '@expo/vector-icons'
import { TabView, SceneMap, TabBar } from 'react-native-tab-view'
import { useNavigation } from '@react-navigation/native'
import ImageAvata from '../assets/hero2.jpg'
import { Image } from 'expo-image'
import AsyncStoraged from '../services/AsyncStoraged'
import axios from 'axios'
import API_URL from '../config/config'
import ModalLoading from '../components/modal/ModalLoading'

const search = '../assets/search.png'
const screenWidth = Dimensions.get('window').width
const AccountSearch = ({ searchQuery }) => {
    const [token, setToken] = useState('')
    const [users, setUsers] = useState([])
    const [imageLoading, setImageLoading] = useState(true)
    const [loading, setLoading] = useState(false)
    const navigation = useNavigation()
    const getToken = async () => {
        const token = await AsyncStoraged.getToken()
        setToken(token)
    }
    useEffect(() => {
        getToken()
    }, [])
    useEffect(() => {
        const handleSearch = async () => {
            try {
                const CancelToken = axios.CancelToken
                let cancel
                const res = await axios({
                    method: 'get',
                    url: API_URL.API_URL + '/search-user?text=' + searchQuery,
                    cancelToken: new CancelToken(function executor(c) {
                        cancel = c
                    }),
                })
                setUsers(res.data.data)
                setImageLoading(false)
            } catch (error) {
                console.log('Search error: ', error)
                setImageLoading(false)
            }
        }

        handleSearch()
    }, [searchQuery])
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
    return (
        <View>
            <View style={{ marginTop: 25 }}>
                <Text style={{ fontWeight: 'bold', fontSize: 15 }}>
                    Tìm kiếm gần đây
                </Text>
            </View>
            <ModalLoading visible={loading} />
            {imageLoading ? (
                <View style={{ marginTop: 150 }}>
                    <ActivityIndicator size="large" color={COLORS.black} />
                </View>
            ) : users.length > 0 ? (
                <FlatList
                    numColumns={3}
                    data={users}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item, index }) => (
                        <View
                            key={index}
                            style={{
                                flex: 1,
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginHorizontal: 12,
                            }}
                        >
                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={() => viewProfile(item._id)}
                                style={{
                                    flexDirection: 'column',
                                    width: screenWidth / 3 - 24,
                                    height: screenWidth / 3 - 24,
                                    margin: 6,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    borderRadius: 15,
                                }}
                            >
                                <Image
                                    source={
                                        item.avatar ? item.avatar : ImageAvata
                                    }
                                    style={{
                                        marginTop: 10,
                                        width: screenWidth / 3 - 64,
                                        height: screenWidth / 3 - 64,
                                        borderRadius: '50%',
                                    }}
                                />
                                <Text
                                    numberOfLines={1}
                                    style={{
                                        fontSize: 15,
                                        marginTop: 8,
                                        fontWeight: '500',
                                        color: COLORS.black,
                                    }}
                                >
                                    {item.fullname}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}
                />
            ) : (
                // Hiển thị nếu không có kết quả tìm kiếm
                <>
                    <View
                        style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <View
                            style={{
                                marginTop: 25,
                                justifyContent: 'center',
                                alignItems: 'center',
                                width: 210,
                                height: 210,
                                backgroundColor: '#F0F0F0',
                                borderRadius: 105,
                            }}
                        >
                            <Image
                                source={require(search)}
                                style={{ width: 180, height: 180 }}
                            />
                        </View>
                    </View>
                    <View
                        style={{
                            marginTop: 25,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <Text style={{ fontSize: 15, color: '#696969' }}>
                            Không có tìm kiếm nào gần đây
                        </Text>
                    </View>
                </>
            )}
        </View>
    )
}

const PostSearch = ({ searchQuery }) => {
    const [token, setToken] = useState('')
    const [loading, setLoading] = useState(false)
    const [imageLoading, setImageLoading] = useState(true)
    const navigation = useNavigation()
    const getToken = async () => {
        const token = await AsyncStoraged.getToken()
        setToken(token)
    }
    useEffect(() => {
        getToken()
    }, [])
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
    const [posts, setPosts] = useState([])
    useEffect(() => {
        const handleSearch = async () => {
            try {
                const CancelToken = axios.CancelToken
                let cancel
                const res = await axios({
                    method: 'get',
                    url: API_URL.API_URL + '/search-post?text=' + searchQuery,
                    cancelToken: new CancelToken(function executor(c) {
                        cancel = c
                    }),
                })

                setPosts(res.data.data)
                setImageLoading(false)
            } catch (error) {
                console.log('Search error: ', error)
            }
        }

        handleSearch()
    }, [searchQuery])
    return (
        <View>
            <View style={{ marginTop: 25 }}>
                <Text style={{ fontWeight: 'bold', fontSize: 15 }}>
                    Tìm kiếm gần đây
                </Text>
            </View>
            <ModalLoading visible={loading} />
            {imageLoading ? (
                // Hiển thị loader hoặc ảnh loading nếu cần
                <View style={{ marginTop: 150 }}>
                    <ActivityIndicator size="large" color={COLORS.black} />
                </View>
            ) : posts.length > 0 ? (
                <FlatList
                    showsVerticalScrollIndicator={false}
                    data={posts}
                    renderItem={({ item, index }) => (
                        <TouchableOpacity
                            key={index}
                            style={{
                                flex: 1,
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                            activeOpacity={0.8}
                            onPress={() => viewDetailPost(item._id)}
                        >
                            <View
                                style={{
                                    flexDirection: 'row',
                                    backgroundColor: '#F0F0F0',
                                    width: screenWidth - 25,
                                    height: 130,
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
                                        marginRight: 110,
                                    }}
                                >
                                    <Text
                                        style={{
                                            ...FONTS.body5,
                                        }}
                                        numberOfLines={3}
                                        ellipsizeMode="tail"
                                    >
                                        {item.content.length > 100
                                            ? `${item.content.slice(0, 100)}...`
                                            : item.content}
                                    </Text>
                                    <Text
                                        style={{
                                            marginTop: 15,
                                            fontSize: 13,
                                        }}
                                    >
                                        {item.type === 'activity'
                                            ? 'Hoạt động tình nguyện'
                                            : 'Hoạt động quyên góp'}
                                    </Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    )}
                />
            ) : (
                <>
                    <View
                        style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <View
                            style={{
                                marginTop: 25,
                                justifyContent: 'center',
                                alignItems: 'center',
                                width: 210,
                                height: 210,
                                backgroundColor: '#F0F0F0',
                                borderRadius: 105,
                            }}
                        >
                            <Image
                                source={require(search)}
                                style={{ width: 180, height: 180 }}
                            />
                        </View>
                    </View>
                    <View
                        style={{
                            marginTop: 25,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <Text style={{ fontSize: 15, color: '#696969' }}>
                            Không có tìm kiếm nào gần đây
                        </Text>
                    </View>
                </>
            )}
        </View>
    )
}

const Search = ({ navigation, route }) => {
    const layout = useWindowDimensions()
    const [searchQuery, setSearchQuery] = useState('')
    const [index, setIndex] = useState(0)

    const [routes] = useState([
        { key: 'first', title: 'Tài khoản', icon: 'home' },
        { key: 'second', title: 'Hoạt động', icon: 'user' },
    ])
    const renderScene = SceneMap({
        first: () => <AccountSearch searchQuery={searchQuery} />,
        second: () => <PostSearch searchQuery={searchQuery} />,
    })
    // Sử dụng useEffect để theo dõi thay đổi của searchQuery

    const renderTabBar = (props) => (
        <TabBar
            {...props}
            indicatorStyle={{
                backgroundColor: COLORS.primary,
            }}
            style={{
                backgroundColor: '#fff',
            }}
            renderLabel={({ focused, route }) => (
                <Text
                    style={[
                        {
                            color: focused ? COLORS.primary : 'gray',
                            fontSize: 15,
                            fontWeight: 'bold',
                        },
                    ]}
                >
                    {route.title}
                </Text>
            )}
        />
    )

    return (
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor: '#fff',
            }}
        >
            <View style={{ padding: 12 }}>
                <View
                    style={{
                        width: '100%',
                        position: 'relative',
                        height: 50,
                    }}
                >
                    <View
                        style={{
                            flexDirection: 'row',
                            borderRadius: 10,
                            borderColor: '#cccc',
                            borderWidth: 1,
                            marginLeft: 15,
                            marginRight: 8,
                            flex: 1,
                            padding: 4,
                            alignItems: 'center',
                        }}
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
                                height: 40,
                                width: '80%',
                            }}
                            value={searchQuery}
                            onChangeText={(text) => setSearchQuery(text)}
                        />
                        {!searchQuery ? null : (
                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={() => setSearchQuery('')}
                            >
                                <AntDesign
                                    size={18}
                                    name="closecircle"
                                    color={'#ccc'}
                                />
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </View>
            <View style={{ flex: 1 }}>
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

export default Search
