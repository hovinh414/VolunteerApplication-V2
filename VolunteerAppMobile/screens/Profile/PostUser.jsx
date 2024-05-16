import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    FlatList,
    TextInput,
    RefreshControl,
    Modal,
    StyleSheet,
} from 'react-native'
import * as Progress from 'react-native-progress'
import React, { useState, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { COLORS, FONTS, SIZES, images } from '../../constants'
import API_URL from '../../config/config'
import {
    MaterialIcons,
    Ionicons,
    Feather,
    FontAwesome,
    MaterialCommunityIcons,
    Entypo,
} from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { friends, posts } from '../../constants/data'
import { SliderBox } from 'react-native-image-slider-box'
import DaysDifference from '../../components/format/DaysDifference'
import LongText from '../../components/format/LongText'
import { Image } from 'expo-image'
import axios from 'axios'
import ImageAvata from '../../assets/hero2.jpg'
import AsyncStoraged from '../../services/AsyncStoraged'

const share = '../../assets/share.png'
const PostUser = ({ posts, fetchNextPage, refreshing, onRefresh }) => {
    const [token, setToken] = useState('')
    const [avatar, setAvatar] = useState()
    const [typePost, setTypePost] = useState('normal')
    const [type, setType] = useState()
    const navigation = useNavigation()
    const getToken = async () => {
        const token = await AsyncStoraged.getToken()
        setToken(token)
    }

    useEffect(() => {
        getToken()
    }, [])
    const getUserStored = async () => {
        const userStored = await AsyncStoraged.getData()
        if (userStored) {
            setAvatar(userStored.avatar)
            setType(userStored.type)
        } else {
            setAvatar(null)
            setType(null)
        }
    }
    useEffect(() => {
        getUserStored()
    }, [])
    const RenderSuggestionsContainer = () => {
        return (
            <View
                style={{
                    paddingBottom: 5,
                    borderBottomWidth: 1,
                    borderBottomColor: '#fff',
                }}
            >
                <View style={{ marginVertical: 8 }}></View>

                <FlatList
                    horizontal={true}
                    data={friends}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item, index }) => (
                        <View
                            key={item.id}
                            style={{
                                flexDirection: 'column',
                                flex: 1,
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <TouchableOpacity
                                onPress={() => console.log('Pressed')}
                                style={{
                                    paddingVertical: 4,
                                    marginLeft: 12,
                                }}
                            >
                                <Image
                                    source={item.image}
                                    contentFit="contain"
                                    style={{
                                        width: 80,
                                        height: 80,
                                        borderRadius: 80,
                                        borderWidth: 3,

                                        borderColor: '#FF493C',
                                    }}
                                />
                            </TouchableOpacity>
                        </View>
                    )}
                />
                <View
                    style={{
                        borderColor: COLORS.white,
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
                            Chiến dịch gây quỹ nổi bật
                        </Text>
                    </View>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={{ flexDirection: 'row', marginRight: 10 }}
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
                    data={friends}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item, index }) => (
                        <View
                            key={item.id}
                            style={{
                                flexDirection: 'column',
                                flex: 1,
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <TouchableOpacity
                                onPress={() => console.log('Pressed')}
                                style={{
                                    paddingVertical: 4,
                                    marginLeft: 12,
                                }}
                            >
                                <Image
                                    source={item.image}
                                    contentFit="contain"
                                    style={{
                                        width: 80,
                                        height: 80,
                                        borderRadius: 80,
                                        borderWidth: 3,

                                        borderColor: '#FF493C',
                                    }}
                                />
                            </TouchableOpacity>
                        </View>
                    )}
                />
            </View>
        )
    }
    const likePost = async (_postId) => {
        try {
            const res = await axios({
                method: 'post',
                url: API_URL.API_URL + '/post/like',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token,
                },
                data: {
                    postId: _postId,
                },
            })
        } catch (error) {
            if (error) {
                console.log(error)
            }
        }
    }
    const unLikePost = async (_postId) => {
        try {
            const res = await axios({
                method: 'put',
                url: API_URL.API_URL + '/post/unlike',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token,
                },
                data: {
                    postId: _postId,
                },
            })
        } catch (error) {
            if (error) {
                console.log(error)
            }
        }
    }
    function LikeButton({ postId, likePost, unLikePost }) {
        const [isLiked, setIsLiked] = useState(false)
        const [totalLike, setTotalLike] = useState(0)
        if (!token) {
            console.log('Not login')
        } else {
            const checkLikes = async () => {
                try {
                    const res = await axios({
                        method: 'get',
                        url: API_URL.API_URL + '/post/like/' + postId,
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: token,
                        },
                    })

                    if (res.data.message === 'User not like this post before') {
                        setIsLiked(false)
                    } else {
                        setIsLiked(true)
                    }
                } catch (error) {
                    console.log(error)
                    setIsLiked(false)
                }
            }

            useEffect(() => {
                checkLikes()
            }, [])
        }
        const fetchLikes = async () => {
            try {
                const response = await axios.get(
                    API_URL.API_URL + '/post/likes/' + postId
                )

                if (response.data.status === 'SUCCESS') {
                    setTotalLike(response.data.data.totalLikes)
                }
            } catch (error) {
                console.log('API Error:', error)
            }
        }

        useEffect(() => {
            fetchLikes()
        }, [])
        const handleLikeClick = async () => {
            try {
                if (isLiked) {
                    await unLikePost(postId)
                    setIsLiked(false)
                } else {
                    await likePost(postId)
                    setIsLiked(true)
                }

                fetchLikes() // Gọi hàm này sau khi thực hiện like/unlike thành công
            } catch (error) {
                console.log(error)
            }
        }

        if (token !== null) {
            return (
                <View
                    style={{
                        flexDirection: 'row',

                        alignItems: 'center',
                        marginRight: SIZES.padding2,
                    }}
                >
                    <TouchableOpacity onPress={handleLikeClick}>
                        {isLiked ? (
                            <FontAwesome
                                name="heart"
                                size={20}
                                color={COLORS.primary}
                            />
                        ) : (
                            <Feather
                                name="heart"
                                size={20}
                                color={COLORS.black}
                            />
                        )}
                    </TouchableOpacity>
                    <Text style={{ ...FONTS.body4, marginLeft: 5 }}>
                        {totalLike}
                    </Text>
                </View>
            )
        } else {
            return (
                <View
                    style={{
                        flexDirection: 'row',

                        alignItems: 'center',
                        marginRight: SIZES.padding2,
                    }}
                >
                    <TouchableOpacity
                        onPress={() => navigation.navigate('LoginScreen')}
                    >
                        <Feather name="heart" size={20} color={COLORS.black} />
                    </TouchableOpacity>
                    <Text style={{ ...FONTS.body4, marginLeft: 5 }}>
                        {totalLike}
                    </Text>
                </View>
            )
        }
    }
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

    const viewProfile = async (_orgId) => {
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
        }
    }
    return (
        <FlatList
            data={posts}
            onEndReached={fetchNextPage}
            onEndReachedThreshold={0.4}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            renderItem={({ item, index }) => (
                <View
                    key={index}
                    style={{
                        backgroundColor: '#fff',
                        flexDirection: 'column',
                        width: '100%',
                        borderWidth: 1,
                        borderTopColor: '#FDF6ED',
                        borderColor: '#fff',
                        marginVertical: 12,
                    }}
                >
                    {/* Post header */}
                    <TouchableOpacity
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginTop: 12,
                            paddingBottom: 10,
                        }}
                        onPress={() => viewDetailPost(item._id)}
                    >
                        <TouchableOpacity
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                marginHorizontal: 8,
                            }}
                            onPress={() => viewProfile(item.ownerId)}
                        >
                            <Image
                                source={item.ownerAvatar}
                                style={{
                                    height: 52,
                                    width: 52,
                                    borderRadius: 26,
                                }}
                            />

                            <View style={{ marginLeft: 12 }}>
                                <Text
                                    style={{
                                        ...FONTS.body5,
                                        fontWeight: 'bold',
                                    }}
                                >
                                    {item.ownerDisplayname}
                                </Text>
                            </View>
                        </TouchableOpacity>

                        <MaterialCommunityIcons
                            name="dots-vertical"
                            size={24}
                            color={COLORS.black}
                        />
                    </TouchableOpacity>
                    <View>
                        <SliderBox
                            images={item.media}
                            paginationBoxVerticalPadding={5}
                            activeOpacity={1}
                            dotColor={COLORS.primary}
                            inactiveDotColor={COLORS.white}
                            sliderBoxHeight={500}
                            dotStyle={{ width: 7, height: 7 }}
                            onCurrentImagePressed={() =>
                                viewDetailPost(item._id)
                            }
                        />

                        {/* <FlatList
                                    data={item}
                                    horizontal
                                    renderItem={({ item, index }) => (
                                        <View
                                            style={{
                                                alignItems: 'center',
                                                marginVertical: 8,
                                            }}
                                            key={index}
                                        >
                                            <Image
                                                source={item.media}
                                                style={{
                                                    height: 450,
                                                    width: 450,
                                                    marginRight: 10,
                                                }}
                                            />
                                        </View>
                                    )}
                                /> */}
                    </View>

                    <View
                        style={{
                            marginHorizontal: 8,
                            marginVertical: 8,
                        }}
                    >
                        <LongText maxLength={150} content={item.content} />
                    </View>
                    <TouchableOpacity onPress={() => viewDetailPost(item._id)}>
                        <View
                            style={{
                                paddingLeft: 10,
                                paddingBottom: 5,
                            }}
                        >
                            <View
                                style={{
                                    paddingVertical: 10,
                                    marginTop: 10,
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
                                        Đã tham gia: {' '}
                                        <Text
                                            style={{
                                                color: COLORS.primary,
                                                fontSize: 15,
                                                fontWeight:'bold'
                                            }}
                                        >
                                            {item.totalUserJoin} /{' '}
                                            {item.participants}
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
                                            (item.totalUserJoin /
                                                item.participants) *
                                            100
                                        ).toFixed(0)}{' '}
                                        %
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            <Progress.Bar
                                progress={
                                    item.totalUserJoin / item.participants
                                }
                                color="#FF493C"
                                height={8}
                                width={SIZES.width - 20}
                                unfilledColor="#F5F5F5"
                                borderColor="#F5F5F5"
                                borderRadius={25}
                            />
                        </View>
                        <View
                            style={{
                                margin: 8,
                                flexDirection: 'row',
                                alignItems: 'center',
                            }}
                        >
                            <Ionicons
                                name="location-outline"
                                size={22}
                                color={COLORS.primary}
                            />
                            <Text
                                style={{
                                    fontSize: 13,
                                    fontFamily: 'regular',
                                    color: COLORS.primary,
                                    marginLeft: 4,
                                    marginRight: 10,
                                }}
                            >
                                {item.address}
                            </Text>
                        </View>
                        <View
                            style={{
                                marginHorizontal: 8,
                                marginBottom: 8,
                                flexDirection: 'row',
                                alignItems: 'center',
                            }}
                        >
                            <Ionicons
                                name="calendar-outline"
                                size={21}
                                color={COLORS.blue}
                            />
                            <DaysDifference
                                exprirationDate={item.exprirationDate}
                            />
                        </View>
                    </TouchableOpacity>

                    {/* Posts likes and comments */}

                    <View
                        style={{
                            marginHorizontal: 8,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            paddingBottom: 6,
                        }}
                    >
                        <View
                            style={{
                                flexDirection: 'row',
                            }}
                        >
                            <LikeButton
                                postId={item._id}
                                unLikePost={unLikePost}
                                likePost={likePost}
                            />
                            <View
                                style={{
                                    flexDirection: 'row',
                                    marginRight: SIZES.padding2,
                                    alignItems: 'center',
                                }}
                            >
                                <MaterialCommunityIcons
                                    name="message-text-outline"
                                    size={20}
                                    color={COLORS.black}
                                />
                                <Text
                                    style={{
                                        ...FONTS.body4,
                                        marginLeft: 2,
                                    }}
                                >
                                    {item.numOfComment}
                                </Text>
                            </View>
                            <View
                                style={{
                                    flexDirection: 'row',

                                    alignItems: 'center',
                                }}
                            >
                                <Image
                                    source={require(share)}
                                    style={{
                                        width: 20,
                                        height: 20,
                                    }}
                                />
                            </View>
                        </View>
                        <View
                            style={{
                                flexDirection: 'row',
                            }}
                        >
                            {type === 'Organization' ||
                            !type ? null : item.isJoin ? (
                                <View
                                    style={{
                                        backgroundColor: '#ccc',
                                        borderRadius: 10,
                                        padding: 5,
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
                            ) : (
                                <TouchableOpacity
                                    style={{
                                        backgroundColor: COLORS.primary,
                                        borderRadius: 10,
                                        padding: 5,
                                    }}
                                    onPress={() => viewDetailPost(item._id)}
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
                        </View>
                    </View>

                    {/* comment section */}

                    {!avatar ? null : (
                        <View
                            style={{
                                flexDirection: 'row',
                                marginHorizontal: 8,
                                paddingVertical: 18,
                                borderTopWidth: 1,
                                borderTopColor: '#FFF',
                            }}
                        >
                            <Image
                                source={avatar ? { uri: avatar } : ImageAvata}
                                contentFit="contain"
                                style={{
                                    height: 52,
                                    width: 52,
                                    borderRadius: 26,
                                }}
                            />

                            <View
                                style={{
                                    flex: 1,
                                    height: 52,
                                    borderRadius: 26,
                                    borderWidth: 1,
                                    borderColor: '#CCC',
                                    marginLeft: 12,
                                    paddingLeft: 12,
                                    justifyContent: 'center',
                                }}
                            >
                                <TextInput
                                    placeholder="Thêm bình luận"
                                    placeholderTextColor="#CCC"
                                />
                            </View>
                        </View>
                    )}
                </View>
            )}
        />
    )
}

export default PostUser
