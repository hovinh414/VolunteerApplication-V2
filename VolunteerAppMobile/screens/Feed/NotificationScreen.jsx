import {
    View,
    Text,
    FlatList,
    ScrollView,
    TouchableOpacity,
    RefreshControl,
} from 'react-native'
import React, { useState, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { COLORS, FONTS, images } from '../../constants'
import {
    MaterialIcons,
    FontAwesome5,
    MaterialCommunityIcons,
    FontAwesome,
} from '@expo/vector-icons'
import { styles } from '../Chat/style/ChatStyle'
import { Image } from 'expo-image'
import ImageAvata from '../../assets/hero2.jpg'
import AsyncStoraged from '../../services/AsyncStoraged'
import axios from 'axios'
import API_URL from '../../config/config'
// import messaging from '@react-native-firebase/messaging';
import { LinearGradient } from 'expo-linear-gradient'
import ModalLoading from '../../components/modal/ModalLoading'
const NotificationScreen = ({ navigation }) => {
    useEffect(() => {
        const onFocus = () => {
            getNotis()
        }

        const unsubscribeFocus = navigation.addListener('focus', onFocus)
        return () => {
            unsubscribeFocus()
        }
    }, [navigation])
    const [token, setToken] = useState('')
    const [notis, setNotis] = useState([])
    const [loading, setLoading] = useState(false)
    const [refreshing, setRefreshing] = React.useState(false)
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
    // const requestUserPermission = async () => {
    //     const authStatus = await messaging().requestPermission()
    //     const enabled =
    //         authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    //         authStatus === messaging.AuthorizationStatus.PROVISIONAL

    //     if (enabled) {
    //         console.log('Authorization status:', authStatus)
    //     }
    // }
    // useEffect(() => {
    //     if (requestUserPermission()) {
    //         messaging()
    //             .getToken()
    //             .then((token) => {
    //                 console.log(token)
    //             })
    //     } else {
    //         console.log('Failed token status', authStatus)
    //     }

    //     messaging()
    //         .getInitialNotification()
    //         .then( async (remoteMessage) => {
    //             if (remoteMessage) {
    //                 console.log(
    //                     'Notification caused app to open from quit state:',
    //                     remoteMessage.notification
    //                 )
    //             }
    //         })
    //     // Assume a message-notification contains a "type" property in the data payload of the screen to open

    //     messaging().onNotificationOpenedApp((remoteMessage) => {
    //         console.log(
    //             'Notification caused app to open from background state:',
    //             remoteMessage.notification
    //         )
    //     })

    //     // Register background handler
    //     messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    //         console.log('Message handled in the background!', remoteMessage)
    //     })

    //     const unsubscribe = messaging().onMessage(async (remoteMessage) => {
    //         Alert.alert(
    //             'A new FCM message arrived!',
    //             JSON.stringify(remoteMessage)
    //         )
    //     })

    //     return unsubscribe
    // }, [])
    const getNotis = async () => {
        const config = {
            headers: {
                Authorization: token,
            },
        }
        try {
            const response = await axios.get(
                API_URL.API_URL + '/noties?page=1&limit=5',
                config
            )

            if (response.data.status === 'SUCCESS') {
                setNotis(response.data.data)
            }
        } catch (error) {
            console.log('API Error get noti:', error)
        }
    }
    useEffect(() => {
        getNotis()
    }, [token])
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
            <ModalLoading visible={loading} />
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <MaterialIcons
                        name="keyboard-arrow-left"
                        size={30}
                        color={COLORS.black}
                    />
                </TouchableOpacity>
                <Text
                    style={{ fontSize: 20, marginLeft: 8, fontWeight: 'bold' }}
                >
                    Thông báo
                </Text>
            </View>
            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={() => getNotis()}
                    />
                }
                style={{ flex: 1, backgroundColor: '#fff', padding: 12 }}
            >
                {/* Render notification data */}
                <Text
                    style={{
                        marginTop: 12,
                        color: COLORS.black,
                        fontWeight: '700',
                        fontSize: 16,
                    }}
                >
                    Các thông báo
                </Text>
                {notis.map((item, index) => (
                    <View key={index}>
                        <View
                            style={{
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                marginTop: 20,
                            }}
                        >
                            <View
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                }}
                            >
                                <View style={{ flex: 1, padding: 5 }}>
                                    <TouchableOpacity
                                        style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                        }}
                                        activeOpacity={0.8}
                                        onPress={() =>
                                            viewDetailPost(item.postId)
                                        }
                                    >
                                        <TouchableOpacity
                                            activeOpacity={0.8}
                                            onPress={() =>
                                                viewProfile(item.senderId)
                                            }
                                        >
                                            <Image
                                                style={{
                                                    width: 60,
                                                    height: 60,
                                                    borderRadius: 35,
                                                }}
                                                source={
                                                    item.senderAvt
                                                        ? item.senderAvt
                                                        : ImageAvata
                                                }
                                            />
                                            {item.type === 'comment' ? (
                                                <LinearGradient
                                                    colors={[
                                                        '#4facfe',
                                                        '#00f2fe',
                                                    ]}
                                                    style={{
                                                        position: 'absolute',
                                                        bottom: -5,
                                                        right: 0,
                                                        borderRadius: 12, // Bo tròn góc
                                                        padding: 5,
                                                    }}
                                                >
                                                    <MaterialCommunityIcons
                                                        name="message-text"
                                                        color={COLORS.white}
                                                        size={18}
                                                    />
                                                </LinearGradient>
                                            ) : item.type === 'block' ? (
                                                <LinearGradient
                                                    colors={[
                                                        '#FF0035',
                                                        '#FF0035',
                                                    ]}
                                                    style={{
                                                        position: 'absolute',
                                                        bottom: -5,
                                                        right: 0,
                                                        borderRadius: 12, // Bo tròn góc
                                                        padding: 5,
                                                    }}
                                                >
                                                    <FontAwesome
                                                        name="ban"
                                                        color={COLORS.white}
                                                        size={18}
                                                    />
                                                </LinearGradient>
                                            ) : (
                                                <LinearGradient
                                                    colors={[
                                                        '#fa709a',
                                                        '#fee140',
                                                    ]}
                                                    style={{
                                                        position: 'absolute',
                                                        bottom: -5,
                                                        right: 0,
                                                        borderRadius: 12, // Bo tròn góc
                                                        padding: 5,
                                                    }}
                                                >
                                                    <FontAwesome5
                                                        name="user-alt"
                                                        color={COLORS.white}
                                                        size={18}
                                                    />
                                                </LinearGradient>
                                            )}
                                        </TouchableOpacity>
                                        <View
                                            style={{
                                                flex: 1,
                                                flexDirection: 'row',
                                                marginLeft: 10,
                                                justifyContent: 'space-between',
                                            }}
                                        >
                                            <View
                                                style={{
                                                    flexDirection: 'row',
                                                }}
                                            >
                                                <Text
                                                    style={{
                                                        fontWeight: '500',
                                                        fontSize: 16,
                                                    }}
                                                >
                                                    {item.message}
                                                </Text>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                ))}
                
            </ScrollView>
        </SafeAreaView>
    )
}

export default NotificationScreen
