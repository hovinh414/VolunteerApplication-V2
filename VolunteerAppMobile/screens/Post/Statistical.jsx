import {
    View,
    Text,
    useWindowDimensions,
    FlatList,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    RefreshControl,
    TextInput,
} from 'react-native'
import React, { useState, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import * as Progress from 'react-native-progress'
import { COLORS, FONTS, SIZES, images } from '../../constants'
import {
    Feather,
    AntDesign,
    Ionicons,
    MaterialIcons,
    MaterialCommunityIcons,
} from '@expo/vector-icons'
import { TabView, SceneMap, TabBar } from 'react-native-tab-view'
import { Image } from 'expo-image'
import AsyncStoraged from '../../services/AsyncStoraged'
import axios from 'axios'
import API_URL from '../../config/config'
import { styles } from './style/statisticalStyle'
const search = '../../assets/search.png'
const loading = '../../assets/loading.gif'
const screenWidth = Dimensions.get('window').width
const JoinedUser = ({ activityId, setUserJoin }) => {
    const [usersJoin, setUsersJoin] = useState([])
    const [token, setToken] = useState('')
    const [refreshing, setRefreshing] = useState(false)
    const getToken = async () => {
        const token = await AsyncStoraged.getToken()
        setToken(token)
    }
    useEffect(() => {
        getToken()
    }, [])
    const getUsersJoin = async () => {
        const config = {
            headers: {
                Authorization: token,
            },
        }
        try {
            const response = await axios.get(
                API_URL.API_URL + '/activity/join/' + activityId,
                config
            )

            if (response.data.status === 'SUCCESS') {
                setUsersJoin(response.data.data)
                setUserJoin(response.data.data.length)
            }
        } catch (error) {
            console.log('API Error get users join:', error)
        }
    }
    useEffect(() => {
        getUsersJoin()
    }, [token])
    const onRefresh = () => {
        setRefreshing(true)
        getUsersJoin().then(() => {
            setRefreshing(false)
        })
    }
    return (
        <>
            {usersJoin.length === 0 ? (
                <View>
                    <View
                        style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <View
                            style={styles.viewSearch}
                        >
                            <Image
                                source={require(search)}
                                style={styles.imgSearch}
                            />
                        </View>
                    </View>
                    <View
                        style={styles.textUserNoJoin}
                    >
                        <Text style={{ fontSize: 15, color: '#696969' }}>
                            Chưa có người tham gia hoạt động
                        </Text>
                    </View>
                </View>
            ) : (
                <FlatList
                    numColumns={3}
                    data={usersJoin}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                        />
                    }
                    renderItem={({ item, index }) => (
                        <View
                            key={index}
                            style={styles.itemJoin}
                        >
                            <View
                                style={styles.viewItem}
                            >
                                <Image
                                    source={item.avatar}
                                    style={styles.imgAvatar}
                                />
                                <Text
                                    style={styles.textName}
                                >
                                    {item.username}
                                </Text>
                            </View>
                        </View>
                    )}
                />
            )}
        </>
    )
}

const AttendanceUser = ({ activityId, setUserAttendance }) => {
    const [attendanceUser, setAttendanceUser] = useState([])
    const [token, setToken] = useState('')
    const [refreshing, setRefreshing] = useState(false)
    const getToken = async () => {
        const token = await AsyncStoraged.getToken()
        setToken(token)
    }
    useEffect(() => {
        getToken()
    }, [])
    const getUserAttendance = async () => {
        const config = {
            headers: {
                Authorization: token,
            },
        }
        try {
            const response = await axios.get(
                API_URL.API_URL + '/activity/attendance/' + activityId,
                config
            )

            if (response.data.status === 'SUCCESS') {
                console.log(response.data.data)
                setAttendanceUser(response.data.data)
                setUserAttendance(response.data.data.length)
            }
        } catch (error) {
            console.log('API Error get users attendance:', error)
        }
    }
    useEffect(() => {
        getUserAttendance()
    }, [token])
    const onRefresh = () => {
        setRefreshing(true)
        getUsersJoin().then(() => {
            setRefreshing(false)
        })
    }
    return (
        <>
            {attendanceUser.length === 0 ? (
                <View>
                    <View
                        style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <View
                            style={styles.viewSearch}
                        >
                            <Image
                                source={require(search)}
                                style={styles.imgSearch}
                            />
                        </View>
                    </View>
                    <View
                        style={styles.textUserNoJoin}
                    >
                        <Text style={{ fontSize: 15, color: '#696969' }}>
                            Chưa có người điểm danh hoạt động
                        </Text>
                    </View>
                </View>
            ) : (
                <FlatList
                    data={attendanceUser}
                    numColumns={2}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                        />
                    }
                    renderItem={({ item, index }) => (
                        <View
                            key={index}
                            style={styles.itemJoin}
                        >
                            <View
                                style={styles.viewItem}
                            >
                                <Image
                                    source={item.avatar}
                                    style={styles.imgAvatar}
                                />
                                <Text
                                    style={styles.textName}
                                >
                                    {item.username}
                                </Text>
                            </View>
                        </View>
                    )}
                />
            )}
        </>
    )
}

const Statistical = ({ navigation, route }) => {
    const activityId = route.params
    const [userJoin, setUserJoin] = useState(0)
    const [userAttendance, setUserAttendance] = useState(0)
    console.log(userAttendance)
    const layout = useWindowDimensions()
    const [index, setIndex] = useState(0)
    useEffect(() => {
        const updatedRoutes = [
            { key: 'first', title: `Đã tham gia (${userJoin})`, icon: 'home' },
            {
                key: 'second',
                title: `Đã điểm danh (${userAttendance})`,
                icon: 'user',
            },
        ]

        setRoutes(updatedRoutes)
    }, [userJoin, userAttendance])

    const [routes, setRoutes] = useState([
        { key: 'first', title: `Đã tham gia (${userJoin})`, icon: 'home' },
        {
            key: 'second',
            title: `Đã điểm danh (${userAttendance})`,
            icon: 'user',
        },
    ])
    const renderScene = ({ route }) => {
        switch (route.key) {
            case 'first':
                return (
                    <JoinedUser
                        activityId={activityId}
                        setUserJoin={setUserJoin}
                    />
                )
            case 'second':
                return (
                    <AttendanceUser
                        activityId={activityId}
                        setUserAttendance={setUserAttendance}
                    />
                )
            default:
                return null
        }
    }
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
                <TouchableOpacity
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}
                    onPress={() => navigation.goBack()}
                >
                    <MaterialIcons
                        name="keyboard-arrow-left"
                        size={24}
                        color={COLORS.black}
                    />
                    <Text style={{ ...FONTS.h4, marginLeft: 8 }}>Thống kê</Text>
                </TouchableOpacity>
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

export default Statistical
