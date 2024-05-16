import React, { useState, useEffect } from 'react'
import {
    View,
    Text,
    Dimensions,
    TouchableOpacity,
    FlatList,
    KeyboardAvoidingView,
    RefreshControl,
    SafeAreaView,
    TextInput, // Import TextInput
} from 'react-native'
import ModalLoading from '../../components/modal/ModalLoading'
import { MaterialIcons } from '@expo/vector-icons'
import { COLORS, FONTS } from '../../constants'
import AsyncStoraged from '../../services/AsyncStoraged'
import axios from 'axios'
import API_URL from '../../config/config'
import { Image } from 'expo-image'
const loading = '../../assets/loading.gif'
function ProductiveActivities({ navigation, route }) {
    const data = route.params
    const [showSearchInput, setShowSearchInput] = useState(false)
    const [token, setToken] = useState('')
    const [searchText, setSearchText] = useState('')
    const [orgId, setOrgId] = useState()
    const [loading, setLoading] = useState(false)
    const toggleSearchInput = () => {
        setShowSearchInput(!showSearchInput)
    }
    const getUserStored = async () => {
        const userStored = await AsyncStoraged.getData()
        if (userStored) {
            setOrgId(userStored._id)
        } else {
            setOrgId(null)
        }
    }
    useEffect(() => {
        getUserStored()
    }, [])
    const getToken = async () => {
        const token = await AsyncStoraged.getToken()
        setToken(token)
    }
    useEffect(() => {
        getToken()
    }, [])
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
    const [filteredData, setFilteredData] = useState(data)

    useEffect(() => {
        // Filter the data based on the searchText
        const filteredResults = data.filter((item) =>
            item.fullName.toLowerCase().includes(searchText.toLowerCase())
        )
        setFilteredData(filteredResults)
    }, [searchText])
    return (
        <KeyboardAvoidingView
            KeyboardAvoidingView
            style={{
                flex: 1,
                backgroundColor: '#fff',
                paddingHorizontal: 13,
                paddingTop: 55,
                paddingBottom: 30,
            }}
            behavior="height"
            enabled
        >
            <ModalLoading visible={loading} />
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingTop: 7,
                    justifyContent: 'space-between',
                }}
            >
                <TouchableOpacity
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        paddingVertical: 7,
                    }}
                    onPress={() => {
                        showSearchInput
                            ? setShowSearchInput(false)
                            : navigation.goBack()
                    }}
                >
                    {showSearchInput ? (
                        <MaterialIcons
                            name="keyboard-arrow-left"
                            size={30}
                            color={COLORS.black}
                        />
                    ) : (
                        <MaterialIcons
                            name="keyboard-arrow-left"
                            size={30}
                            color={COLORS.black}
                        />
                    )}
                    {showSearchInput ? null : (
                        <Text
                            style={{
                                ...FONTS.body5,
                                fontSize: 16,
                                marginLeft: 10,
                            }}
                        >
                            Tài khoản tích cực
                        </Text>
                    )}
                </TouchableOpacity>

                {showSearchInput ? (
                    <View
                        style={{
                            flexDirection: 'row',
                            borderRadius: 10,
                            borderColor: '#cccc',
                            borderWidth: 1,
                            marginLeft: 15,
                            marginRight: 8,
                            flex: 1,
                            padding: 7,
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
                            }}
                            onChangeText={(value) => setSearchText(value)}
                            // Xử lý sự kiện nhập liệu, tìm kiếm, vv.
                        />
                    </View>
                ) : (
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={toggleSearchInput}
                    >
                        <MaterialIcons
                            name="search"
                            size={30}
                            color={COLORS.black}
                            style={{ marginRight: 8 }}
                        />
                    </TouchableOpacity>
                )}
            </View>
            <View style={{ alignItems: 'center', flex: 1 }}>
                <FlatList
                    numColumns={3}
                    showsVerticalScrollIndicator={false}
                    data={filteredData}
                    renderItem={({ item, index }) => (
                        <TouchableOpacity
                            onPress={
                                item.userId === orgId
                                    ? () =>
                                          navigation.navigate(
                                              'ProfileOrganisation'
                                          )
                                    : () => viewProfile(item.userId)
                            }
                            style={{
                                paddingVertical: 4,
                                margin: 10,
                            }}
                        >
                            <View
                                style={{
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    width: 110,
                                }}
                            >
                                <Image
                                    source={item.avatar}
                                    style={{
                                        width: 100,
                                        height: 100,
                                        borderRadius: 80,
                                        borderWidth: 2,

                                        borderColor: '#FF493C',
                                    }}
                                />
                                <Text
                                    style={{ fontSize: 12, marginTop: 7 }}
                                    numberOfLines={1}
                                >
                                    {item.fullName}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    )}
                />
            </View>
        </KeyboardAvoidingView>
    )
}

export default ProductiveActivities
