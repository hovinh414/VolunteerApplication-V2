import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    FlatList,
    TextInput,
    RefreshControl,
    Share,
} from 'react-native'
import * as Progress from 'react-native-progress'
import React, { useState, useEffect, useCallback } from 'react'
import CommentModal from '../../components/modal/CommentModal'
import { COLORS, FONTS, SIZES, images } from '../../constants'
import API_URL from '../../config/config'
import {
    MaterialIcons,
    Ionicons,
    Feather,
    FontAwesome,
    MaterialCommunityIcons,
    Fontisto,
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
import { format } from 'date-fns'
import ModalLoading from '../../components/modal/ModalLoading'
import LockModal from '../../components/modal/LockModal'
import { styles } from './style/postStyle'

const share = '../../assets/share.png'
const Post = ({
    posts,
    joinedPost,
    fetchNextPage,
    refreshing,
    onRefresh,
    headers,
    footer,
}) => {
    const [token, setToken] = useState('')
    const [orgId, setOrgId] = useState('')
    const [typePost, setTypePost] = useState('')
    const [ownerId, setOwnerId] = useState('')
    const [type, setType] = useState()
    const navigation = useNavigation()
    const [loading, setLoading] = useState(false)
    const [showComment, setShowComment] = useState(false)
    const [showBlock, setShowBlock] = useState(false)
    const [currentImageIndices, setCurrentImageIndices] = useState({})

    useEffect(() => {
        // Set initial image indices for all posts to 1
        const initialIndices = {}
        posts.forEach((post) => {
            initialIndices[post._id] = 0 // Change 0 to 1 if your indices are 1-based
        })
        setCurrentImageIndices(initialIndices)
    }, [posts])

    const handleImageChange = (postId, index) => {
        setCurrentImageIndices((prevIndices) => ({
            ...prevIndices,
            [postId]: index,
        }))
    }

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
            setType(userStored.type)
            setOrgId(userStored._id)
        } else {
            setType(null)
            setOrgId(null)
        }
    }
    useEffect(() => {
        getUserStored()
    }, [])
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

    const [postIdComment, setPostIdComment] = useState('')
    const [donationId, setDonationId] = useState('')
    const [activityId, setActivityId] = useState('')
    const [postLikes, setPostLikes] = useState({})
    const [isLike, setIsLike] = useState([])

    const checkLikes = async (postId) => {
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
                setIsLike((prevLikes) => [
                    ...prevLikes,
                    { postId: postId, likeStatus: 0 },
                ])
            } else {
                setIsLike((prevLikes) => [
                    ...prevLikes,
                    { postId: postId, likeStatus: 1 },
                ])
            }
        } catch (error) {
            console.log(error)
        }
    }

    const fetchLikes = async (postId) => {
        try {
            const response = await axios.get(
                API_URL.API_URL + '/post/likes/' + postId
            )

            if (response.data.status === 'SUCCESS') {
                setPostLikes((prevLikes) => ({
                    ...prevLikes,
                    [postId]: response.data.data.totalLikes,
                }))
            }
        } catch (error) {
            console.log('API get total like Error:', error)
        }
    }

    const handleLikeClick = async (postId) => {
        try {
            if (
                isLike.find((like) => like.postId === postId)?.likeStatus === 1
            ) {
                await unLikePost(postId)
                setIsLike((prevLikes) => [
                    ...prevLikes.filter((like) => like.postId !== postId),
                    { postId: postId, likeStatus: 0 },
                ])
            } else {
                await likePost(postId)
                setIsLike((prevLikes) => [
                    ...prevLikes.filter((like) => like.postId !== postId),
                    { postId: postId, likeStatus: 1 },
                ])
            }

            // Fetch updated likes after like/unlike
            await fetchLikes(postId)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        // Check if the user is logged in before fetching likes
        if (token && posts.length > 0) {
            // Iterate through the posts and fetch likes for each post
            posts.forEach(async (post) => {
                await checkLikes(post._id)
                await fetchLikes(post._id)
            })
        } else {
            // Handle the case when the user is not logged in
            // You can add any additional logic here if needed
            console.log('User is not logged in.')
        }
    }, [token, posts])

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
                if (response.data.data.type === 'Donation') {
                    navigation.navigate('DetailDonation', response.data.data)
                    setLoading(false)
                } else if (response.data.data.type === 'Activity') {
                    navigation.navigate('DetailPost', response.data.data)
                    setLoading(false)
                } else {
                    navigation.navigate('DetailNormal', response.data.data)
                    setLoading(false)
                }
            }
        } catch (error) {
            console.log('API Error:', error)
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
                setLoading(false)
            }
        } catch (error) {
            console.log('API Error:', error)
            setLoading(false)
        }
    }
    const removeHashtagsAndUrlsFromContent = (content) => {
        // Regex để tìm kiếm ký tự # và URL
        const hashtagRegex = /#/g
        const urlRegex = /https?:\/\/[^\s]+/g

        // Thay thế tất cả các ký tự # bằng chuỗi trống
        const contentWithoutHashtags = content.replace(hashtagRegex, '')
        // Thay thế tất cả các URL bằng chuỗi trống
        const contentWithoutUrls = contentWithoutHashtags.replace(urlRegex, '')

        return contentWithoutUrls
    }
    function extractUrlsFromContent(content) {
        const urlRegex = /https?:\/\/[^\s]+/g
        const urls = content.match(urlRegex)
        return urls || []
    }
    function formatDate(dateTimeString) {
        const date = new Date(dateTimeString)
        const day = date.getDate().toString().padStart(2, '0')
        const month = (date.getMonth() + 1).toString().padStart(2, '0')
        const year = date.getFullYear()
        return `${day}/${month}/${year}`
    }
    const sharePost = async (post) => {
        try {
            const cleanedContent = removeHashtagsAndUrlsFromContent(
                post.content
            )
            let mediaContent = ''

            // Duyệt qua mảng media và thêm từng URL vào nội dung chia sẻ
            post.media.forEach((mediaUrl, index) => {
                mediaContent += `Hình ${index + 1}: ${mediaUrl}\n`
            })
            const formattedDate = format(
                new Date(post.exprirationDate),
                'dd-MM-yyyy'
            )
            const result = await Share.share({
                message: `${cleanedContent} \n\nĐịa điểm: ${post.address}\nThời hạn: ${formattedDate}\nSố người tham gia: ${post.participants}`,
                url: extractUrlsFromContent(post.content),
            })
            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    console.log(
                        'Share with activity type: ',
                        result.activityType
                    )
                } else {
                    console.log('shared')
                }
            } else if (result.action === Share.dismissedAction) {
                console.log('dismissed')
            }
        } catch (error) {
            console.error('Error sharing post:', error.message)
        }
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
                marginVertical: 6,
            }}
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
        </View>
    )
    return (
        <View>
            <CommentModal
                visible={showComment}
                onRequestClose={() => setShowComment(false)}
                postId={postIdComment}
            />
            <LockModal
                visible={showBlock}
                onRequestClose={() => setShowBlock(false)}
                ownerId={ownerId}
                userId={orgId}
                type={typePost}
                donationId={donationId}
                token={token}
            />
            <ModalLoading visible={loading} />
            <FlatList
                data={posts}
                ListHeaderComponent={headers}
                showsVerticalScrollIndicator={false}
                onEndReached={fetchNextPage}
                onEndReachedThreshold={0.1}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
                ListFooterComponent={footer}
                renderItem={({ item, index }) => (
                    <View
                        key={index}
                        style={{
                            backgroundColor: '#fff',
                            flexDirection: 'column',
                            width: '100%',
                            borderWidth: 1,
                            borderTopColor: '#cccc',
                            borderColor: '#fff',
                            marginVertical: 12,
                        }}
                    >
                        {/* Post header */}
                        <View
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
                                onPress={
                                    item.ownerId === orgId
                                        ? () =>
                                              navigation.navigate(
                                                  'ProfileOrganisation'
                                              )
                                        : () => viewProfile(item.ownerId)
                                }
                            >
                                <Image
                                    source={item.ownerAvatar}
                                    style={{
                                        height: 52,
                                        width: 52,
                                        borderRadius: 26,
                                    }}
                                />

                                <View
                                    style={{
                                        marginLeft: 12,
                                        flexDirection: 'column',
                                        justifyContent: 'space-between',
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontSize: 16,
                                            fontWeight: 'bold',
                                            marginBottom: 5,
                                        }}
                                    >
                                        {item.ownerDisplayname}
                                    </Text>
                                    <Text
                                        style={{
                                            fontSize: 14,
                                            fontWeight: '500',
                                            marginBottom: 5,
                                        }}
                                    >
                                        {item.type === 'Donation'
                                            ? 'Đang kêu gọi quyên góp'
                                            : item.type === 'Activity'
                                            ? 'Đang kêu gọi tham gia'
                                            : 'Chia sẻ thông tin'}
                                    </Text>
                                    <Text
                                        style={{
                                            fontSize: 14,
                                            fontWeight: '500',
                                        }}
                                    >
                                        Đăng ngày:{' '}
                                        <Text
                                            style={{
                                                fontSize: 14,
                                                fontWeight: '500',
                                                color: COLORS.primary,
                                            }}
                                        >
                                            {formatDate(item.createdAt)}
                                        </Text>
                                    </Text>
                                </View>
                            </TouchableOpacity>

                            {!token ? (
                                <TouchableOpacity>
                                    <MaterialCommunityIcons
                                        name="dots-vertical"
                                        size={24}
                                        color={COLORS.black}
                                    />
                                </TouchableOpacity>
                            ) : item.donationId ? (
                                <TouchableOpacity
                                    onPress={() => {
                                        setShowBlock(true)
                                        setOwnerId(item.ownerId)
                                        setTypePost(item.type)
                                        setDonationId(item.donationId)
                                    }}
                                >
                                    <MaterialCommunityIcons
                                        name="dots-vertical"
                                        size={24}
                                        color={COLORS.black}
                                    />
                                </TouchableOpacity>
                            ) : (
                                <TouchableOpacity
                                    onPress={() => {
                                        setShowBlock(true)
                                        setOwnerId(item.ownerId)
                                        setTypePost(item.type)
                                        setActivityId(item.activityId)
                                    }}
                                >
                                    <MaterialCommunityIcons
                                        name="dots-vertical"
                                        size={24}
                                        color={COLORS.black}
                                    />
                                </TouchableOpacity>
                            )}
                        </View>
                        <View
                            style={{
                                marginHorizontal: 8,
                                marginVertical: 8,
                            }}
                        >
                            {item.content.length > 100 ? (
                                <LongText
                                    maxLength={150}
                                    content={item.content}
                                />
                            ) : (
                                <Text
                                    style={{
                                        fontSize: 16,
                                        textAlign: 'justify',
                                    }}
                                >
                                    {item.content}
                                </Text>
                            )}
                        </View>
                        <View>
                            <SliderBox
                                images={item.media}
                                paginationBoxVerticalPadding={5}
                                activeOpacity={1}
                                dotColor={COLORS.primary}
                                inactiveDotColor={COLORS.white}
                                sliderBoxHeight={500}
                                imageLoadingColor={'#ccc'}
                                dotStyle={{ width: 7, height: 7 }}
                                currentImageEmitter={(index) =>
                                    handleImageChange(item._id, index)
                                }
                            />
                            <View
                                style={{
                                    position: 'absolute',
                                    backgroundColor: '#F8F8F8',
                                    right: 5,
                                    bottom: 5,
                                    padding: 4,
                                    borderRadius: 5,
                                }}
                            >
                                <Text
                                    style={{
                                        fontSize: 13,
                                        fontWeight: '500',
                                    }}
                                >
                                    {currentImageIndices[item._id] + 1}/
                                    {item.media.length}
                                </Text>
                            </View>
                        </View>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => viewDetailPost(item._id)}
                        >
                            <View
                                style={{
                                    paddingLeft: 8,
                                }}
                            >
                                {item.donateItem ? (
                                    <View
                                        style={{
                                            paddingVertical: 10,
                                            marginTop: 10,
                                            flexDirection: 'column',
                                            justifyContent: 'space-between',
                                        }}
                                    >
                                        <Text
                                            style={{
                                                color: COLORS.black,
                                                fontSize: 17,
                                                marginBottom: 10,
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
                                            {item.donateItem
                                                .split(', ')
                                                .map((item, index) => (
                                                    <React.Fragment key={index}>
                                                        {renderItem(item)}
                                                    </React.Fragment>
                                                ))}
                                        </View>
                                    </View>
                                ) : item.type === 'Activity' ? (
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
                                                Đã tham gia:{' '}
                                                <Text
                                                    style={{
                                                        color: COLORS.primary,
                                                        fontSize: 15,
                                                        fontWeight: 'bold',
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
                                ) : null}
                                {item.type === 'Activity' ? (
                                    <Progress.Bar
                                        progress={
                                            item.totalUserJoin /
                                            item.participants
                                        }
                                        color="#FF493C"
                                        height={8}
                                        width={SIZES.width - 20}
                                        unfilledColor="#F5F5F5"
                                        borderColor="#F5F5F5"
                                        borderRadius={25}
                                    />
                                ) : null}
                            </View>
                            <View
                                style={{
                                    margin: 8,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    marginRight: 15,
                                }}
                            >
                                <Ionicons
                                    name="location-outline"
                                    size={22}
                                    color={COLORS.primary}
                                />
                                <Text
                                    style={{
                                        fontSize: 15,
                                        color: COLORS.primary,
                                        marginLeft: 4,
                                        marginRight: 10,
                                    }}
                                >
                                    {item.address}
                                </Text>
                            </View>

                            {item.type === 'normal' ? null : (
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
                            )}
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
                                {token ? (
                                    <View style={{ flexDirection: 'column' }}>
                                        <View
                                            style={{
                                                flexDirection: 'row',

                                                alignItems: 'center',
                                                marginRight: SIZES.padding2,
                                            }}
                                        >
                                            <TouchableOpacity
                                                onPress={() =>
                                                    handleLikeClick(item._id)
                                                }
                                            >
                                                {isLike.find(
                                                    (like) =>
                                                        like.postId ===
                                                            item._id &&
                                                        like.likeStatus === 1
                                                ) ? (
                                                    <FontAwesome
                                                        name="heart"
                                                        size={28}
                                                        color={COLORS.primary}
                                                    />
                                                ) : (
                                                    <Feather
                                                        name="heart"
                                                        size={28}
                                                        color={COLORS.black}
                                                    />
                                                )}
                                            </TouchableOpacity>

                                            <TouchableOpacity
                                                onPress={() => {
                                                    setShowComment(true)
                                                    setPostIdComment(item._id)
                                                }}
                                                style={{
                                                    flexDirection: 'row',
                                                    marginHorizontal: 8,
                                                    alignItems: 'center',
                                                }}
                                            >
                                                <MaterialCommunityIcons
                                                    name="comment-text-outline"
                                                    size={28}
                                                    color={COLORS.black}
                                                />
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                onPress={() => sharePost(item)}
                                                style={{
                                                    flexDirection: 'row',

                                                    alignItems: 'center',
                                                }}
                                            >
                                                <Feather
                                                    name="send"
                                                    size={28}
                                                    color={COLORS.black}
                                                />
                                            </TouchableOpacity>
                                        </View>
                                        <Text
                                            style={{
                                                fontWeight: '700',
                                                fontSize: 15,
                                                marginLeft: 5,
                                                marginTop: 8,
                                            }}
                                        >
                                            {postLikes[item._id] || 0} lượt
                                            thích
                                        </Text>
                                    </View>
                                ) : (
                                    <View style={{ flexDirection: 'column' }}>
                                        <View
                                            style={{
                                                flexDirection: 'row',

                                                alignItems: 'center',
                                                marginRight: SIZES.padding2,
                                            }}
                                        >
                                            <TouchableOpacity
                                                onPress={() =>
                                                    navigation.navigate(
                                                        'LoginScreen'
                                                    )
                                                }
                                            >
                                                <Feather
                                                    name="heart"
                                                    size={28}
                                                    color={COLORS.black}
                                                />
                                            </TouchableOpacity>

                                            <TouchableOpacity
                                                onPress={() => {
                                                    navigation.navigate(
                                                        'LoginScreen'
                                                    )
                                                }}
                                                style={{
                                                    flexDirection: 'row',
                                                    marginHorizontal: 8,
                                                    alignItems: 'center',
                                                }}
                                            >
                                                <MaterialCommunityIcons
                                                    name="comment-text-outline"
                                                    size={28}
                                                    color={COLORS.black}
                                                />
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                onPress={() => sharePost(item)}
                                                style={{
                                                    flexDirection: 'row',

                                                    alignItems: 'center',
                                                }}
                                            >
                                                <Feather
                                                    name="send"
                                                    size={28}
                                                    color={COLORS.black}
                                                />
                                            </TouchableOpacity>
                                        </View>
                                        <Text
                                            style={{
                                                fontSize: 15,
                                                fontWeight: '500',
                                                marginLeft: 5,
                                                marginTop: 8,
                                            }}
                                        >
                                            {postLikes[item._id] || 0} lượt
                                            thích
                                        </Text>
                                    </View>
                                )}
                            </View>

                            <View
                                style={{
                                    flexDirection: 'row',
                                }}
                            >
                                {item.type === 'normal' ? null : item.isLock ? (
                                    <View
                                        style={{
                                            backgroundColor: '#ccc',
                                            borderRadius: 10,
                                            padding: 5,
                                        }}
                                    >
                                        <Text
                                            style={{
                                                fontSize: 16,
                                                fontWeight: '500',
                                                color: 'black',
                                            }}
                                        >
                                            Hoạt động đã đóng
                                        </Text>
                                    </View>
                                ) : type !==
                                  'User' ? null : !joinedPost ? null : joinedPost.includes(
                                      item._id
                                  ) ? (
                                    <View
                                        style={{
                                            backgroundColor: '#ccc',
                                            borderRadius: 10,
                                            padding: 5,
                                        }}
                                    >
                                        <Text
                                            style={{
                                                fontSize: 16,
                                                fontWeight: '500',
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
                                        }}
                                    >
                                        <Text
                                            style={{
                                                fontSize: 16,
                                                fontWeight: '500',
                                                color: 'black',
                                            }}
                                        >
                                            Đã hết hạn
                                        </Text>
                                    </View>
                                ) : (
                                    <TouchableOpacity
                                        activeOpacity={0.8}
                                        style={{
                                            backgroundColor: COLORS.primary,
                                            borderRadius: 10,
                                            padding: 6,
                                        }}
                                        onPress={() => viewDetailPost(item._id)}
                                    >
                                        <Text
                                            style={{
                                                fontSize: 16,
                                                fontWeight: '500',
                                                color: 'white',
                                            }}
                                        >
                                            {item.type === 'Donation'
                                                ? 'Quyên góp'
                                                : 'Tham Gia'}
                                        </Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        </View>
                    </View>
                )}
            />
        </View>
    )
}

export default Post
