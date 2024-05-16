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
import * as Progress from 'react-native-progress'
import { Image } from 'expo-image'
import { styles } from './style/featuredArticleStyle'

const loading = '../../assets/loading.gif'
function FeaturedArticle({ navigation, route }) {
    const screenWidth = Dimensions.get('window').width
    const data = route.params
    const [posts, setPosts] = useState(data)
    const [token, setToken] = useState('')
    const [showSearchInput, setShowSearchInput] = useState(false)
    const [loading, setLoading] = useState(false)
    const [searchText, setSearchText] = useState('')
    function removeAccents(str) {
        return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    }

    useEffect(() => {
        // Filter the data based on the searchText
        const searchTextWithoutAccents = removeAccents(searchText)

        const filteredResults = data.filter((item) => {
            const contentWithoutAccents = removeAccents(item.content)
            return contentWithoutAccents
                .toLowerCase()
                .includes(searchTextWithoutAccents.toLowerCase())
        })

        setPosts(filteredResults)
    }, [searchText])
    useEffect(() => {
        getToken()
    }, [])

    const getToken = async () => {
        const token = await AsyncStoraged.getToken()
        setToken(token)
    }
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

    const toggleSearchInput = () => {
        setShowSearchInput(!showSearchInput)
    }

    return (
        <KeyboardAvoidingView
            KeyboardAvoidingView
            style={styles.container}
            behavior="height"
            enabled
        >
            <ModalLoading visible={loading} />
            <View
                style={styles.header}
            >
                <TouchableOpacity
                    style={styles.textHeader}
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
                            Chiến dịch nổi bật
                        </Text>
                    )}
                </TouchableOpacity>

                {showSearchInput ? (
                    <View
                        style={styles.searchInput}
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
                            style={styles.viewItem}
                        >
                            <Image
                                source={item.media}
                                style={styles.imgItem}
                            />
                            <View
                                style={{
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    marginLeft: 12,
                                }}
                            >
                                <Text
                                    style={{
                                        marginTop: 15,
                                        ...FONTS.body5,
                                    }}
                                >
                                    {item.content.length > 22
                                        ? `${item.content.slice(0, 22)}...`
                                        : item.content}
                                </Text>
                                <Text
                                    style={{
                                        marginTop: 15,
                                        fontSize: 13,
                                    }}
                                >
                                    Tạo bởi{' '}
                                    <Text
                                        style={styles.owner}
                                    >
                                        {item.ownerInfo.fullName}
                                    </Text>
                                </Text>
                                <View
                                    style={{
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        marginTop: 12,
                                    }}
                                >
                                    <Progress.Bar
                                        progress={
                                            item.numOfPeopleParticipated /
                                            item.participants
                                        }
                                        color="#FF493C"
                                        height={8}
                                        width={screenWidth - 167}
                                        unfilledColor="#cccc"
                                        borderColor="#cccc"
                                        borderRadius={25}
                                    />
                                </View>
                                <View
                                    style={{
                                        marginTop: 8,
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
                                                fontSize: 14,
                                                marginLeft: 5,
                                            }}
                                        >
                                            Đã tham gia:{' '}
                                            <Text
                                                style={{
                                                    color: COLORS.primary,
                                                    fontSize: 14,
                                                    fontWeight: 'bold',
                                                }}
                                            >
                                                {item.numOfPeopleParticipated} /{' '}
                                                {item.participants}
                                            </Text>
                                        </Text>
                                    </View>
                                    <TouchableOpacity
                                        activeOpacity={0.8}
                                        style={{
                                            flexDirection: 'row',
                                        }}
                                    >
                                        <Text
                                            style={{
                                                color: COLORS.primary,
                                                fontSize: 14,
                                                marginLeft: 10,
                                            }}
                                        >
                                            {(
                                                (item.numOfPeopleParticipated /
                                                    item.participants) *
                                                100
                                            ).toFixed(0)}{' '}
                                            %
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </TouchableOpacity>
                )}
            />
        </KeyboardAvoidingView>
    )
}

export default FeaturedArticle
