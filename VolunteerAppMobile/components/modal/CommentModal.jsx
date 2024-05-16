import React, { useEffect, useState, useRef } from 'react'
import {
    Text,
    View,
    TouchableOpacity,
    FlatList,
    TextInput,
    TouchableWithoutFeedback,
} from 'react-native'
import Modal from 'react-native-modal'
import { Feather, Ionicons } from '@expo/vector-icons'
import { COLORS } from '../../constants'
import { Image } from 'expo-image'
import AsyncStoraged from '../../services/AsyncStoraged'
import axios from 'axios'
import API_URL from '../../config/config'
import ImageAvata from '../../assets/hero2.jpg'
const CommentModal = ({ visible, onRequestClose, postId }, ref) => {
    const [parentId, setParentId] = useState('')
    const [token, setToken] = useState('')
    const [comment, setComment] = useState([])
    const [text, setText] = useState('')
    const inputRef = useRef()
    const [placeholderText, setPlaceholderText] = useState('Thêm bình luận')
    const getToken = async () => {
        const token = await AsyncStoraged.getToken()
        setToken(token)
    }
    const handleButtonClick = () => {
        if (parentId) {
            const ownerDisplayName = comment.find(
                (item) => item._id === parentId
            )?.ownerDisplayname
            setPlaceholderText(`Trả lời ${ownerDisplayName}`)
        }
        inputRef.current.focus()
    }

    const handleBlur = () => {
        setPlaceholderText('Thêm bình luận')
        setParentId(null)
    }

    const handleFocus = () => {
        if (parentId) {
            const ownerDisplayName = comment.find(
                (item) => item._id === parentId
            )?.ownerDisplayname
            setPlaceholderText(`Trả lời ${ownerDisplayName}`)
        } else {
            setPlaceholderText('Thêm bình luận')
        }
    }
    useEffect(() => {
        getToken()
    }, [])
    const [avatar, setAvatar] = useState()
    const getUserStored = async () => {
        const userStored = await AsyncStoraged.getData()
        if (userStored) {
            setAvatar(userStored.avatar)
        } else {
            setAvatar(null)
        }
    }
    useEffect(() => {
        getUserStored()
    }, [])
    const getComments = async () => {
        const config = {
            headers: {
                Authorization: token,
            },
        }

        try {
            const response = await axios.get(
                API_URL.API_URL + '/post/' + postId + '/comments?page=1&limit=5'
            )

            if (response.data.status === 'SUCCESS') {
                setComment(response.data.data)
            }
        } catch (error) {
            console.log('API Error get comment:', error)
            setComment([])
        }
    }
    useEffect(() => {
        if (visible) {
            setCurrentPage(1)
            getComments()
        }
    }, [visible])
    const [loadingMore, setLoadingMore] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const fetchComment = async () => {
        if (!loadingMore) {
            setLoadingMore(true)
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token,
                },
            }

            try {
                const response = await axios.get(
                    `${API_URL.API_URL}/post/${postId}/comments?page=${
                        currentPage + 1
                    }&limit=5`
                )
                if (response.data.status === 'SUCCESS') {
                    setComment([...comment, ...response.data.data])
                    setCurrentPage(currentPage + 1)
                } else {
                    setComment([...comment, ...response.data.data])
                }
            } catch (error) {
                console.log('API Error get more comment:', error)
            } finally {
                setLoadingMore(false)
            }
        }
    }
    const comments = async () => {
        try {
            const res = await axios({
                method: 'post',
                url: API_URL.API_URL + '/post/comment',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token,
                },
                data: {
                    postId: postId,
                    content: text,
                    parentId: parentId,
                },
            })
            if (res.data.status === 'SUCCESS') {
                getComments()
                setText(null)
            }
        } catch (error) {
            if (error) {
                console.log(error)
            }
        }
    }
    const buildNestedComments = (comments, parentId = null) => {
        const nestedComments = []
        for (const comment of comments) {
            if (comment.parentId === parentId) {
                const nestedComment = {
                    ...comment,
                    replies: buildNestedComments(comments, comment._id),
                }
                nestedComments.push(nestedComment)
            }
        }
        return nestedComments
    }

    const renderCommentItem = ({ item }) => (
        <View style={{ paddingHorizontal: 15 }}>
            {!item.parentId ? (
                <View
                    style={{
                        flexDirection: 'row',
                        marginTop: 18,
                        marginLeft: 10,
                        marginRight: 40,
                    }}
                >
                    <Image
                        source={item.ownerAvatar}
                        style={{ width: 40, height: 40, borderRadius: 20 }}
                    />
                    <View
                        style={{
                            flexDirection: 'column',
                            justifyContent: 'center',
                            marginLeft: 10,
                        }}
                    >
                        <Text style={{ fontWeight: '800', marginBottom: 3 }}>
                            {item.ownerDisplayname}
                        </Text>
                        <Text style={{ color: '#696969' }}>{item.content}</Text>
                        <TouchableOpacity
                            onPress={() => {
                                setParentId(item._id)
                                handleButtonClick()
                            }}
                            style={{ marginTop: 5 }}
                        >
                            <Text
                                style={{ color: '#696969', fontWeight: '500' }}
                            >
                                Trả lời
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            ) : (
                <View
                    style={{
                        flexDirection: 'row',
                        marginTop: 18,
                        marginHorizontal: 40,
                    }}
                >
                    <Image
                        source={item.ownerAvatar}
                        style={{ width: 30, height: 30, borderRadius: 20 }}
                    />
                    <View
                        style={{
                            flexDirection: 'column',
                            justifyContent: 'center',
                            marginLeft: 10,
                        }}
                    >
                        <Text
                            style={{
                                fontWeight: '800',
                                marginBottom: 3,
                                fontSize: 13,
                            }}
                        >
                            {item.ownerDisplayname}
                        </Text>
                        <Text style={{ color: '#696969' }}>{item.content}</Text>
                        {/* <TouchableOpacity
                            onPress={() => {
                                setParentId(item._id)
                                handleButtonClick()
                            }}
                            style={{ marginTop: 5 }}
                        >
                            <Text
                                style={{ color: '#696969', fontWeight: '500' }}
                            >
                                Trả lời
                            </Text>
                        </TouchableOpacity> */}
                    </View>
                </View>
            )}

            {/* Render nested replies */}
            {item.replies && item.replies.length > 0 && (
                <FlatList
                    data={item.replies}
                    renderItem={renderCommentItem}
                    showsVerticalScrollIndicator={false}
                    onEndReached={fetchComment}
                    onEndReachedThreshold={0.4}
                />
            )}
        </View>
    )
    const handleScroll = (event) => {
        // Check if the user is scrolling down
        if (event.nativeEvent.contentOffset.y > 0) {
            alert('hell')
        }
    }
    const handleRequestClose = () => {
        setComment([])
        onRequestClose()
    }
    return (
        <Modal
            animationType="slide"
            visible={visible}
            onRequestClose={handleRequestClose}
            customBackdrop={
                <TouchableWithoutFeedback onPress={handleRequestClose}>
                    <View style={{ flex: 1 }} />
                </TouchableWithoutFeedback>
            }
            avoidKeyboard={true}
            style={{
                margin: 0,
                justifyContent: 'flex-end',
                flex: 1,
                backgroundColor: 'rgba(0, 0, 0, 0.1)',
                borderRadius: 25,
            }}
        >
            <View
                style={{
                    width: '100%',
                    height: '85%',
                    backgroundColor: '#fff',
                    borderTopLeftRadius: 25,
                    borderTopRightRadius: 25,
                    paddingBottom: 30,
                }}
            >
                <TouchableOpacity
                    onPress={handleRequestClose}
                    style={{
                        position: 'absolute',
                        top: 10,
                        right: 10,
                        zIndex: 3,
                    }}
                >
                    <Feather name="x" size={26} color={COLORS.black} />
                </TouchableOpacity>
                <View
                    style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderBottomWidth: 1,
                        padding: 30,
                        borderBottomColor: '#cccc',
                        zIndex: 2,
                    }}
                >
                    <Text style={{ fontWeight: 'bold', fontSize: 20 }}>
                        Bình luận
                    </Text>
                </View>
                {comment.length === 0 ? (
                    <View
                        style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <Text style={{ fontWeight: 'bold', fontSize: 20 }}>
                            Chưa có bình luận nào
                        </Text>
                    </View>
                ) : (
                    <FlatList
                        data={buildNestedComments(comment)}
                        renderItem={renderCommentItem}
                        showsVerticalScrollIndicator={false}
                        onEndReached={fetchComment}
                        onEndReachedThreshold={0.1}
                        onScrollToTop={handleScroll}
                    />
                )}
                <View
                    style={{
                        flexDirection: 'row',
                        marginHorizontal: 8,
                        paddingTop: 18,
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
                            justifyContent: 'space-between',
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}
                    >
                        <TextInput
                            ref={inputRef}
                            style={{ height: '100%', width: '90%' }}
                            placeholder={placeholderText}
                            placeholderTextColor="#CCC"
                            value={text}
                            onChangeText={(text) => setText(text)}
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                        />
                        {text ? (
                            <TouchableOpacity onPress={comments}>
                                <Ionicons
                                    name="send"
                                    size={25}
                                    color={COLORS.primary}
                                    style={{ marginRight: 20 }}
                                />
                            </TouchableOpacity>
                        ) : null}
                    </View>
                </View>
            </View>
        </Modal>
    )
}

export default CommentModal
