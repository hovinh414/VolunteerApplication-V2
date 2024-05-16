import { View, Text, Platform } from 'react-native'
import React, { useState, useEffect } from 'react'
import {
    Feather,
    Octicons,
    FontAwesome,
    Ionicons,
} from '@expo/vector-icons'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { COLORS } from '../constants'
import {
    Search,
    LoginScreen,
    MapScreen,
    Profile,
    Settings,
    ScanQR,
} from '../screens'
import Feed from '../screens/Feed'
import Create from '../screens/Post/Create'
import { LinearGradient } from 'expo-linear-gradient'
import AsyncStoraged from '../services/AsyncStoraged'
import ImageAvata from '../assets/hero2.jpg'

import ProfileOrganisation from '../screens/Profile/ProfileOrganisation'
import NotificationScreen from '../screens/Feed/NotificationScreen'
import { Image } from 'expo-image'
import { useFocusEffect } from '@react-navigation/native'
const Tab = createBottomTabNavigator()
const scan = '../assets/scan.gif'
const screenOptions = {
    tabBarShowLabel: false,
    headerShown: false,
    tabBarHideOnKeyboard: true,
    tabBarStyle: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        left: 0,
        elevation: 0,
        padding: 5,
        backgroundColor: '#fff',
        // borderTopLeftRadius: 20,
        // borderTopRightRadius: 20,
    },
}
const BottomTabNavigation = () => {
    const [type, setType] = useState('')
    const [avatar, setAvatar] = useState('')
    const [isActiveOrganization, setIsActiveOrganization] = useState(false)
    const getUserStored = async () => {
        const userStored = await AsyncStoraged.getData()
        if (userStored) {
            setAvatar(userStored.avatar)
            setType(userStored.type)
            setIsActiveOrganization(userStored.isActiveOrganization)
        } else {
            setAvatar(null)
            setType(null)
            setIsActiveOrganization(false)
        }
    }
    useEffect(() => {
        getUserStored()
    }, [])
    useFocusEffect(
        React.useCallback(() => {
            // Fetch data each time the screen comes into focus
            getUserStored()
        }, [])
    )
    return (
        <Tab.Navigator screenOptions={screenOptions}>
            <Tab.Screen
                name="Feed"
                component={Feed}
                options={{
                    tabBarIcon: ({ focused }) => {
                        return (
                            <View
                                style={{
                                    paddingVertical: 8,
                                    paddingHorizontal: 20,
                                    backgroundColor: COLORS.white,
                                    borderRadius: 8,
                                }}
                            >
                                <Octicons
                                    name="home"
                                    size={25}
                                    color={
                                        focused ? COLORS.primary : COLORS.black
                                    }
                                />
                            </View>
                        )
                    },
                }}
            />
            <Tab.Screen
                name="Search"
                component={Search}
                options={{
                    tabBarIcon: ({ focused }) => {
                        return (
                            <View
                                style={{
                                    paddingVertical: 8,
                                    paddingHorizontal: 20,
                                    backgroundColor: COLORS.white,
                                    borderRadius: 8,
                                }}
                            >
                                <Feather
                                    name="search"
                                    size={25}
                                    color={
                                        focused ? COLORS.primary : COLORS.black
                                    }
                                />
                            </View>
                        )
                    },
                }}
            />
            {!isActiveOrganization ? null : type === 'Organization' ? (
                <Tab.Screen
                    name="Create"
                    component={Create}
                    options={{
                        tabBarIcon: ({ focused }) => {
                            return (
                                <LinearGradient
                                    colors={['#D4145A', '#FBB03B']}
                                    style={{
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        width: Platform.OS == 'ios' ? 50 : 60,
                                        height: Platform.OS == 'ios' ? 50 : 60,
                                        borderRadius: 22,
                                        borderColor: '#fff',
                                        borderWidth: 3,
                                    }}
                                >
                                    <Feather
                                        name="plus-circle"
                                        size={25}
                                        color={'#fff'}
                                    />
                                </LinearGradient>
                            )
                        },
                    }}
                />
            ) : null}
            {type === 'User' || type === 'Admin' || type === 'user' ? (
                <Tab.Screen
                    name="ScanQR"
                    component={ScanQR}
                    options={{
                        tabBarIcon: ({ focused }) => {
                            return (
                                <LinearGradient
                                    colors={['#ffdccc', '#ffdccc']}
                                    style={{
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        width: Platform.OS == 'ios' ? 50 : 60,
                                        height: Platform.OS == 'ios' ? 50 : 60,
                                        borderRadius: 22,
                                        borderColor: '#fff',
                                        borderWidth: 6,
                                    }}
                                >
                                    <Image
                                        source={require(scan)}
                                        style={{
                                            height: 90,
                                            width: 90,
                                            // Các thiết lập khác của hình ảnh nếu cần
                                        }}
                                    />
                                </LinearGradient>
                            )
                        },
                    }}
                />
            ) : null}
            <Tab.Screen
                name="MapScreen"
                component={MapScreen}
                options={{
                    tabBarIcon: ({ focused }) => {
                        return (
                            <View
                                style={{
                                    paddingVertical: 8,
                                    paddingHorizontal: 20,
                                    backgroundColor: COLORS.white,
                                    borderRadius: 8,
                                }}
                            >
                                <Ionicons
                                    name="map-outline"
                                    size={25}
                                    color={
                                        focused ? COLORS.primary : COLORS.black
                                    }
                                />
                            </View>
                        )
                    },
                }}
            />
            {type === 'User' || type === 'Admin' || type === 'user' ? (
                <Tab.Screen
                    name="Profile"
                    component={Profile}
                    options={{
                        tabBarIcon: ({ focused }) => {
                            return (
                                <View
                                    style={{
                                        paddingVertical: 8,
                                        paddingHorizontal: 20,
                                        backgroundColor: COLORS.white,
                                        borderRadius: 8,
                                    }}
                                >
                                    <Image
                                        source={
                                            avatar
                                                ? { uri: avatar }
                                                : ImageAvata
                                        }
                                        style={{
                                            height: 25,
                                            width: 25,
                                            borderWidth: 1,
                                            borderRadius: 85,
                                            borderColor: focused
                                                ? COLORS.primary
                                                : COLORS.black,
                                        }}
                                    />
                                </View>
                            )
                        },
                    }}
                />
            ) : type === 'Organization' ? (
                <Tab.Screen
                    name="ProfileOrganisation"
                    component={ProfileOrganisation}
                    options={{
                        tabBarIcon: ({ focused }) => {
                            return (
                                <View
                                    style={{
                                        paddingVertical: 8,
                                        paddingHorizontal: 20,
                                        backgroundColor: COLORS.white,
                                        borderRadius: 8,
                                    }}
                                >
                                    <Image
                                        source={
                                            avatar
                                                ? { uri: avatar }
                                                : ImageAvata
                                        }
                                        style={{
                                            height: 25,
                                            width: 25,
                                            borderWidth: 1,
                                            borderRadius: 85,
                                            borderColor: focused
                                                ? COLORS.primary
                                                : COLORS.black,
                                        }}
                                    />
                                </View>
                            )
                        },
                    }}
                />
            ) : (
                <Tab.Screen
                    name="LoginScreen"
                    component={LoginScreen}
                    options={{
                        tabBarIcon: ({ focused }) => {
                            return (
                                <View
                                    style={{
                                        paddingVertical: 8,
                                        paddingHorizontal: 20,
                                        backgroundColor: COLORS.white,
                                        borderRadius: 8,
                                    }}
                                >
                                    <FontAwesome
                                        name="user-circle"
                                        size={25}
                                        color={
                                            focused
                                                ? COLORS.primary
                                                : COLORS.black
                                        }
                                    />
                                </View>
                            )
                        },
                    }}
                />
            )}
        </Tab.Navigator>
    )
}

export default BottomTabNavigation
