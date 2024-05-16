import {
    View,
    Text,
    FlatList,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native'
import React, { useState, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { COLORS, FONTS, images } from '../../constants'
import { MaterialIcons, AntDesign } from '@expo/vector-icons'
import { styles } from './style/ChatStyle'
import { Image } from 'expo-image'
import axios from 'axios'
import AsyncStoraged from '../../services/AsyncStoraged'
import { IOChanel, SocketIOService } from '../../scripts/socket'
import API_URL from '../../config/config'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useFocusEffect } from '@react-navigation/native'

const Chat = ({ navigation, route }) => {
    const ioService = route.params
    const [isLoading, setIsLoading] = useState(true)
    const [showChat, setShowChat] = useState(false)
    useFocusEffect(
        React.useCallback(() => {
            getGroupChats()
        }, [])
    )
    const itemTest = {
        groupid: '00025ee3-e2da-4402-9489-186980c650e7',
        name: 'Áo ấm cho em 2023',
        avatar: 'https://firebasestorage.googleapis.com/v0/b/bhx-clone.appspot.com/o/compressed%2Fgroups%2Fcompressed_6563429665fafa12010524a2_IMG_9992.jpg?alt=media',
    }
    const joinRoom = (item) => {
        // if (username !== "" && room !== "") {
        const socket = ioService.reqConnection({
            roomId: item.groupid,
        })
        socket.emit('join_room', item.groupid)
        setShowChat(true)
        navigation.navigate('ChatDetail', {
            socket: socket,
            room: item.groupid,
            data: item,
        })
        // }
    }
    const [token, setToken] = useState('')
    const [filteredChat, setFilteredChat] = useState([])
    const [searchText, setSearchText] = useState('')
    const [latestMessages, setLatestMessages] = useState([])
    const [userId, setUserId] = useState()
    const getUserStored = async () => {
        const userStored = await AsyncStoraged.getData()
        setUserId(userStored._id)
    }
    const handleSearchTextChange = (text) => {
        setSearchText(text)
        // Lọc danh sách chat dựa trên tên tìm kiếm
        const filtered = filteredChat.filter((item) =>
            item.name.toLowerCase().includes(text.toLowerCase())
        )
        setFilteredChat(filtered)
    }
    const getToken = async () => {
        const token = await AsyncStoraged.getToken()
        setToken(token)
    }

    useEffect(() => {
        getToken()
        getUserStored()
    }, [])
    const getGroupChats = async () => {
        setIsLoading(true)
        const config = {
            headers: {
                Authorization: token,
            },
        }
        try {
            const response = await axios.get(
                API_URL.API_URL + '/groups/join',
                config
            )

            if (response.data.status === 'SUCCESS') {
                setFilteredChat(response.data.data)
            }
        } catch (error) {
            console.log('API Error get group:', error)
        }
    }
    useEffect(() => {
        getGroupChats()
    }, [token])
    useEffect(() => {
        getDataMessages()
    }, [filteredChat, token])
    const getLatestMessageByGroupId = async (groupId) => {
        try {
            const storedChatData = await AsyncStorage.getItem('chatData')
            if (storedChatData) {
                const parsedChatData = JSON.parse(storedChatData)

                // Tìm group chat có groupId tương ứng
                const groupChat = parsedChatData.find(
                    (item) => item.groupId === groupId
                )

                // Kiểm tra xem groupChat có tồn tại không
                if (groupChat) {
                    // Nếu tìm thấy group chat, lấy tin nhắn cuối cùng
                    const latestMessage =
                        groupChat.messages[groupChat.messages.length - 1]

                    return latestMessage
                } else {
                    // Xử lý khi groupChat không tồn tại (ví dụ: trả về giá trị mặc định)
                    return null
                }
            }
        } catch (error) {
            console.error('Error fetching chatData from AsyncStorage:', error)
        }

        return null // Trả về null nếu không tìm thấy tin nhắn
    }

    const getDataMessages = async () => {
        try {
            const messagesPromises = filteredChat.map(async (item) => {
                const latestMessage = await getLatestMessageByGroupId(
                    item.groupid
                )
                return { group: item, latestMessage }
            })

            const messages = await Promise.all(messagesPromises)

            // Cập nhật state với thông tin tin nhắn cuối cùng
            setLatestMessages(messages)
        } catch (error) {
            console.error('Error fetching chatData from AsyncStorage:', error)
        }
    }
    function extractName(fullname) {
        const lastSpaceIndex = fullname.lastIndexOf(' ')
        return lastSpaceIndex !== -1
            ? fullname.slice(lastSpaceIndex + 1)
            : fullname
    }
    function extractNameFromFullname(fullname) {
        const words = fullname.split(' ')

        if (words.length > 2) {
            // Lấy 3 từ cuối cùng
            return words.slice(-3).join(' ')
        } else {
            // Nếu từ cuối cùng chỉ có 1 hoặc 2 từ, trả về toàn bộ fullname
            return extractName(fullname)
        }
    }
    function formatTimeFromISOString(ISOString) {
        const date = new Date(ISOString)
        const hours = date.getHours().toString().padStart(2, '0')
        const minutes = date.getMinutes().toString().padStart(2, '0')

        return `${hours}:${minutes}`
    }
    return (
        <SafeAreaView style={styles.container}>
            <>
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => joinRoom(itemTest)}
                    style={{
                        zIndex: 999,
                        position: 'absolute',
                        bottom: 25,
                        right: 25,
                        width: 60,
                        height: 60,
                        borderRadius: 35,
                        backgroundColor: COLORS.primary,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        shadowColor: COLORS.primary,
                        shadowOffset: {
                            width: 0,
                            height: 2,
                        },
                        shadowOpacity: 0.75,
                        shadowRadius: 4,
                        elevation: 5,
                    }}
                >
                    <AntDesign name="message1" size={32} color={COLORS.white} />
                </TouchableOpacity>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <MaterialIcons
                            name="keyboard-arrow-left"
                            size={24}
                            color={COLORS.black}
                        />
                    </TouchableOpacity>
                    <Text style={{ ...FONTS.h4, marginLeft: 8 }}>Tin nhắn</Text>
                </View>
                <View style={styles.searchInput}>
                    <MaterialIcons
                        name="search"
                        size={20}
                        color={'#ccc'}
                        style={{ marginRight: 8 }}
                    />
                    <TextInput
                        style={styles.searchText}
                        placeholder="Tìm kiếm..."
                        value={searchText}
                        onChangeText={handleSearchTextChange}
                    />
                </View>
                {filteredChat.length === 0 ? (
                    <View
                        style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <Text style={{ fontWeight: 'bold', fontSize: 20 }}>
                            Bạn chưa tham gia nhóm trò chuyện nào!
                        </Text>
                    </View>
                ) : (
                    <FlatList
                        data={filteredChat}
                        renderItem={({ item, index }) => {
                            // Tìm tin nhắn cuối cùng tương ứng với groupid
                            const lastMessageItem = latestMessages.find(
                                (mess) => mess.group.groupid === item.groupid
                            )
                            return (
                                <TouchableOpacity
                                    style={styles.chat}
                                    key={index}
                                    onPress={() => joinRoom(item)}
                                >
                                    <View style={styles.viewChat}>
                                        <Image
                                            source={item.avatar}
                                            style={styles.avatar}
                                        />
                                        <View
                                            style={{
                                                marginLeft: 12,
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    ...FONTS.h3,
                                                    fontSize: 16,
                                                    marginBottom: 6,
                                                }}
                                            >
                                                {' '}
                                                {item.name}{' '}
                                            </Text>
                                            {!lastMessageItem ||
                                            !lastMessageItem.latestMessage ? null : (
                                                <View
                                                    style={{
                                                        flexDirection: 'row',
                                                        justifyContent:
                                                            'space-between',
                                                    }}
                                                >
                                                    <Text
                                                        style={{ fontSize: 14 }}
                                                        numberOfLines={1}
                                                        ellipsizeMode="tail"
                                                    >
                                                        {!lastMessageItem
                                                            ? 'Chưa có tin nhắn nào gần đây'
                                                            : lastMessageItem
                                                                  .latestMessage
                                                                  .userId ===
                                                              userId
                                                            ? `Bạn: ${lastMessageItem.latestMessage.message.slice(
                                                                  0,
                                                                  30
                                                              )}${
                                                                  lastMessageItem
                                                                      .latestMessage
                                                                      .message
                                                                      .length >
                                                                  30
                                                                      ? '...'
                                                                      : ''
                                                              }`
                                                            : `${extractNameFromFullname(
                                                                  lastMessageItem
                                                                      .latestMessage
                                                                      .fullname
                                                              )}: ${lastMessageItem.latestMessage.message.slice(
                                                                  0,
                                                                  30
                                                              )}${
                                                                  lastMessageItem
                                                                      .latestMessage
                                                                      .message
                                                                      .length >
                                                                  30
                                                                      ? '...'
                                                                      : ''
                                                              }`}
                                                    </Text>
                                                </View>
                                            )}
                                        </View>
                                    </View>
                                    <View
                                        style={{
                                            flexDirection: 'column',
                                            alignItems: 'flex-start',
                                        }}
                                    >
                                        {!lastMessageItem ||
                                        !lastMessageItem.latestMessage ? null : (
                                            <Text style={{ fontSize: 14 }}>
                                                {formatTimeFromISOString(
                                                    lastMessageItem
                                                        .latestMessage.time
                                                )}
                                            </Text>
                                        )}
                                    </View>
                                </TouchableOpacity>
                            )
                        }}
                    />
                )}
            </>
        </SafeAreaView>
    )
}
export default Chat
