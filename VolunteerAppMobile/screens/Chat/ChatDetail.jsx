import React, { useState, useRef, useEffect } from 'react'
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    KeyboardAvoidingView,
    ScrollView,
    SafeAreaView,
} from 'react-native'

import {
    MaterialIcons,
    FontAwesome,
    Feather,
    Ionicons,
} from '@expo/vector-icons'
import * as ImagePicker from 'expo-image-picker'
import { COLORS, FONTS, images } from '../../constants'
import * as DocumentPicker from 'expo-document-picker'
import { styles } from './style/ChatDetailStyle'
import { Image } from 'expo-image'
import AsyncStoraged from '../../services/AsyncStoraged'
import { io } from 'socket.io-client'
import AsyncStorage from '@react-native-async-storage/async-storage'

const file = '../../assets/file.png'
const video = '../../assets/video.png'
// const socket = SocketIOClient('http://192.168.1.10:3200', {
//   transports: ['websocket'] // you need to explicitly tell it to use websockets
// });
function ChatDetail({ route, navigation }) {
    const [message, setMessage] = useState('')
    const [messages, setMessages] = useState([])
    const [token, setToken] = useState('')
    const [avatar, setAvatar] = useState('')
    const [fullname, setFullname] = useState('')
    const [userId, setUserId] = useState()
    const [selectedImages, setSelectedImage] = useState([])
    let cameraRef = useRef()
    const [hasCameraPermission, setHasCameraPermission] = useState()
    const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState()
    const [photo, setPhoto] = useState([])
    const [selectedFiles, setSelectedFiles] = useState([])
    const { socket, room, data } = route.params
    const flatListRef = useRef()
    const getToken = async () => {
        const token = await AsyncStoraged.getToken()
        setToken(token)
    }
    useEffect(() => {
        getToken()
        getUserStored()
        // AsyncStorage.clear();
        console.log(`socket: ${socket}`)
        console.log(`room: ${room}`)
        fetchChatData()
    }, [])
    const getUserStored = async () => {
        const userStored = await AsyncStoraged.getData()
        setAvatar(userStored.avatar)
        setFullname(userStored.fullname)
        setUserId(userStored._id)
    }
    let takePic = async () => {
        let options = {
            quality: 1,
            base64: true,
            exif: false,
        }

        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: true,
            aspect: [5, 5],
            quality: 1,
        })
        delete result.cancelled
        if (!result.canceled) {
            if (!photo) {
                setPhoto(result.assets)
            } else {
                setPhoto([...photo, ...result.assets])
            }
        }
    }
    const fetchChatData = async () => {
        try {
            const storedChatData = await AsyncStorage.getItem('chatData')
            if (storedChatData) {
                const parsedChatData = JSON.parse(storedChatData)

                // Tìm xem có group chat có groupId tương ứng không
                const groupChat = parsedChatData.find(
                    (item) => item.groupId === room
                )

                if (groupChat) {
                    setMessages(groupChat.messages)
                }
            }
        } catch (error) {
            console.error('Error fetching chatData from AsyncStorage:', error)
        }
    }
    const updateMessages = (newMessage) => {
        setMessages((list) => [...list, newMessage])
    }

    const updateChatData = async () => {
        try {
            const storedChatData = await AsyncStorage.getItem('chatData')
            let chatDataArray = storedChatData ? JSON.parse(storedChatData) : []

            // Kiểm tra và khởi tạo mảng nếu cần
            if (!Array.isArray(chatDataArray)) {
                chatDataArray = []
            }

            // Tìm xem có group chat có groupId tương ứng không
            const existingGroupIndex = chatDataArray.findIndex(
                (item) => item.groupId === room
            )

            const updatedChatData = {
                groupId: room || '',
                messages: messages,
            }

            // Nếu tồn tại group chat, cập nhật thông tin, ngược lại thêm mới
            if (existingGroupIndex !== -1) {
                chatDataArray[existingGroupIndex] = updatedChatData
            } else {
                chatDataArray.push(updatedChatData)
            }

            const storedChatDataArray = JSON.stringify(chatDataArray)
            await AsyncStorage.setItem('chatData', storedChatDataArray)
        } catch (error) {
            console.error('Error updating chatDataArray:', error)
        }
    }

    const handleSendMessage = async () => {
        if (message !== '' && room && avatar && fullname && userId) {
            const newMessage = {
                avatar: avatar,
                fullname: fullname,
                message: message,
                time: new Date(),
                userId: userId,
            }

            // Gửi tin nhắn đến server qua socket
            await socket.emit('send_message', newMessage)

            // Cập nhật local state
            setMessages((list) => [...list, newMessage])

            // Đặt lại giá trị tin nhắn về rỗng
            setMessage('')
        } else {
            console.error('Missing required values for sending message.')
        }
    }

    useEffect(() => {
        socket.on('receive_message', (data) => {
            try {
                updateMessages(data)
                console.log(`Received data: ${JSON.stringify(data)}`)
            } catch (error) {
                console.error('Error handling received message:', error)
            }
        })
    }, [])

    const handleImageSelection = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: true,
            aspect: [5, 5],
            quality: 1,
        })
        delete result.cancelled
        console.log(result)
        if (!result.canceled) {
            if (!selectedImages) {
                setSelectedImage(result.assets)
            } else {
                setSelectedImage([...selectedImages, ...result.assets])
            }
        }
    }
    function removeItems(item) {
        const newList = selectedImages.filter((listItem) => listItem !== item)
        setSelectedImage(newList)
        const newPhoto = photo.filter((listItem) => listItem !== item)
        setPhoto(newPhoto)
        const file = selectedFiles.filter((listItem) => listItem !== item)
        setSelectedFiles(file)
    }
    const pickDocument = async () => {
        const result = await DocumentPicker.getDocumentAsync()
        console.log(result)
        if (!result.canceled) {
            if (!selectedFiles) {
                setSelectedFiles(result.assets)
            } else {
                setSelectedFiles([...selectedFiles, ...result.assets])
            }
        } else {
        }
    }
    useEffect(() => {
        // Auto scroll to bottom when component mounts or messages change
        flatListRef.current.scrollToEnd({ animated: true })
    }, [messages])
    const handleScrollToTop = () => {
        flatListRef.current.scrollToOffset({ animated: true, offset: 0 })
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
        <KeyboardAvoidingView
            KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            enabled
        >
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => {
                        updateChatData()
                        navigation.navigate("Chat")
                    }}
                >
                    <MaterialIcons
                        name="keyboard-arrow-left"
                        size={30}
                        color={COLORS.black}
                    />
                </TouchableOpacity>
                <Image source={data.avatar} style={styles.avatarDetail} />
                <Text style={{ ...FONTS.h4, marginLeft: 10 }}>{data.name}</Text>
            </View>

            <FlatList
                ref={flatListRef}
                showsVerticalScrollIndicator={false}
                onLayout={() => {
                    flatListRef.current.scrollToEnd({ animated: true })
                }}
                data={messages}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <View>
                        {item.userId === userId ? (
                            <View
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'flex-end',
                                    alignItems: 'center',
                                    marginHorizontal: 12,
                                    marginTop: 3,
                                }}
                            >
                                <View style={styles.myMessage}>
                                    <Text style={styles.messageMyText}>
                                        {item.message}
                                    </Text>
                                    <Text
                                        style={{
                                            fontSize: 10,
                                            color: COLORS.white,
                                            paddingHorizontal: 3,
                                        }}
                                    >
                                        {formatTimeFromISOString(item.time)}
                                    </Text>
                                </View>
                            </View>
                        ) : (
                            <View
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'flex-start',
                                    alignItems: 'center',
                                    marginHorizontal: 12,
                                    marginTop: 3,
                                }}
                            >
                                <Image
                                    source={item.avatar}
                                    style={{
                                        width: 30,
                                        height: 30,
                                        borderRadius: 20,
                                    }}
                                />
                                <View style={{ marginLeft: 15 }}>
                                    <Text
                                        style={{
                                            fontSize: 13,
                                            marginBottom: 2,
                                        }}
                                    >
                                        {item.fullname}
                                    </Text>
                                    <View style={styles.theirMessage}>
                                        <Text style={styles.messageTheirText}>
                                            {item.message}
                                        </Text>
                                        <Text
                                            style={{
                                                fontSize: 10,
                                                color: COLORS.black,
                                                paddingHorizontal: 3,
                                            }}
                                        >
                                            {formatTimeFromISOString(item.time)}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        )}
                    </View>
                )}
                onContentSizeChange={() =>
                    flatListRef.current.scrollToEnd({ animated: true })
                }
            />
            {/* <GiftedChat
                messages={messages}
                // onSend={text => onSendMessage(text)}
                user={{
                    _id: 1,
                }}
                renderComposer={renderComposer}
            /> */}
            <View style={styles.viewIcon}>
                <View style={styles.viewListImage}>
                    <FlatList
                        data={[...selectedImages, ...photo]}
                        horizontal={true}
                        renderItem={({ item, index }) => (
                            <View style={styles.viewImage} key={index}>
                                <Image
                                    source={{ uri: item.uri }}
                                    style={styles.image}
                                />
                                <TouchableOpacity
                                    onPress={() => removeItems(item)}
                                    style={styles.btnRemoveImage}
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

                    <FlatList
                        data={selectedFiles}
                        horizontal={true}
                        renderItem={({ item, index }) => (
                            <TouchableOpacity
                                style={styles.viewFile}
                                key={index}
                            >
                                <View style={styles.file}>
                                    {item.mimeType === 'video/mp4' ? (
                                        <Image
                                            source={require(video)}
                                            style={styles.fileIcon}
                                        />
                                    ) : item.mimeType === 'image/jpeg' ? (
                                        <Image
                                            source={{ uri: item.uri }}
                                            style={styles.fileIcon}
                                        />
                                    ) : (
                                        <Image
                                            source={require(file)}
                                            style={styles.fileIcon}
                                        />
                                    )}
                                    <Text style={styles.fileName}>
                                        {item.name}
                                    </Text>
                                </View>
                                <TouchableOpacity
                                    onPress={() => removeItems(item)}
                                    style={styles.btnRemoveFile}
                                >
                                    <MaterialIcons
                                        name="delete"
                                        size={15}
                                        color={COLORS.black}
                                    />
                                </TouchableOpacity>
                            </TouchableOpacity>
                        )}
                    />
                </View>
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginBottom: 15,
                    }}
                >
                    <TouchableOpacity
                        style={{
                            marginLeft: 10,
                        }}
                        onPress={takePic}
                    >
                        <Feather
                            name="camera"
                            size={25}
                            color={'#696969'}
                            style={{ marginRight: 5, marginLeft: 5 }} // Tạo khoảng cách giữa icon và TextInput
                        />
                    </TouchableOpacity>

                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Nhập nội dung tin nhắn"
                            value={message}
                            onChangeText={(text) => setMessage(text)}
                        />

                        {message ||
                        selectedImages.length !== 0 ||
                        photo.length !== 0 ? (
                            <TouchableOpacity onPress={handleSendMessage}>
                                <FontAwesome
                                    name="send"
                                    size={25}
                                    color={COLORS.primary}
                                    style={{ marginRight: 8 }} // Tạo khoảng cách giữa icon và TextInput
                                />
                            </TouchableOpacity>
                        ) : (
                            <View
                                style={{
                                    flexDirection: 'row',
                                }}
                            >
                                <TouchableOpacity
                                    onPress={handleImageSelection}
                                >
                                    <Ionicons
                                        name="image-outline"
                                        size={25}
                                        color={'#696969'}
                                        style={{ marginRight: 12 }} // Tạo khoảng cách giữa icon và TextInput
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={pickDocument}>
                                    <Feather
                                        name="paperclip"
                                        size={25}
                                        color={'#696969'}
                                        style={{ marginRight: 8 }} // Tạo khoảng cách giữa icon và TextInput
                                    />
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                </View>
            </View>
        </KeyboardAvoidingView>
    )
}

export default ChatDetail
