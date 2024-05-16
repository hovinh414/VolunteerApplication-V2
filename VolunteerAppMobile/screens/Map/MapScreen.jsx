import React, { useEffect, useState, useRef } from 'react'
import MapView, { Marker } from 'react-native-maps'
import {
    Text,
    View,
    TouchableOpacity,
    FlatList,
    Dimensions,
    TouchableWithoutFeedback,
    StyleSheet,
    Linking,
} from 'react-native'
import * as Location from 'expo-location'
import {
    AntDesign,
    Ionicons,
    Feather,
    MaterialIcons,
    MaterialCommunityIcons,
    Entypo,
} from '@expo/vector-icons'
import axios from 'axios'
import AsyncStoraged from '../../services/AsyncStoraged'
import * as Progress from 'react-native-progress'
import API_URL from '../../config/config'
import Modal from 'react-native-modal'
import { COLORS, FONTS, SIZES, images } from '../../constants'
import { Image } from 'expo-image'
import ModalLoading from '../../components/modal/ModalLoading'
const maker = '../../assets/icon.png'
const MAPBOX_ACCESS_TOKEN =
    'pk.eyJ1IjoiaG92aW5oNDE0IiwiYSI6ImNscTgyNnc0ZjE0ZmcyaXNnNWk2Y2I3ZjYifQ.GnJmCU2qNgAWrFPABAu_hA'
const screenWidth = Dimensions.get('window').width
const MapScreen = ({ navigation }) => {
    const [initialRegion, setInitialRegion] = useState(null)
    const [posts, setPosts] = useState([])
    const [locationPost, setLocationPost] = useState([])
    const [token, setToken] = useState('')
    const [selectedPost, setSelectedPost] = useState(null)
    const mapViewRef = useRef(null)
    const [loading, setLoading] = useState(true)
    const handleMarkerPress = (post) => {
        setSelectedPost(post)
    }

    const handleCloseModal = () => {
        setSelectedPost(null)
    }
    const getToken = async () => {
        const token = await AsyncStoraged.getToken()
        setToken(token)
    }

    useEffect(() => {
        getToken()
    }, [])

    const getPosts = async () => {
        const config = {
            headers: {
                Authorization: token,
            },
        }

        try {
            const response = await axios.get(
                API_URL.API_URL + '/posts?page=1&limit=5',
                config
            )

            if (response.data.status === 'SUCCESS') {
                setPosts(response.data.data.posts)
            }
        } catch (error) {
            console.log('API Error get post:', error)
        }
    }

    useEffect(() => {
        getPosts()
    }, [token])

    const convertAddressToCoordinatesMapbox = async (address) => {
        try {
            const response = await fetch(
                `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
                    address
                )}.json?access_token=${MAPBOX_ACCESS_TOKEN}`
            )

            if (!response.ok) {
                throw new Error('Error fetching coordinates')
            }

            const data = await response.json()

            if (data.features.length > 0) {
                const location = data.features[0].geometry.coordinates
                return { latitude: location[1], longitude: location[0] }
            } else {
                throw new Error('No results found')
            }
        } catch (error) {
            console.error('Error converting address to coordinates', error)
            throw error
        }
    }

    useEffect(() => {
        // Convert addresses to coordinates when posts are updated
        const convertPosts = async () => {
            try {
                const updatedPosts = await Promise.all(
                    posts.map(async (post) => {
                        const coordinates =
                            await convertAddressToCoordinatesMapbox(
                                post.address
                            )
                        return { ...post, coordinates }
                    })
                )
                setLocationPost(updatedPosts)
            } catch (error) {
                console.error(
                    'Error converting addresses to coordinates',
                    error
                )
            }
        }

        convertPosts()
    }, [posts])

    useEffect(() => {
        const getLocation = async () => {
            try {
                let { status } =
                    await Location.requestForegroundPermissionsAsync()
                if (status !== 'granted') {
                    console.error('Permission to access location was denied')
                    return
                }

                let location = await Location.getCurrentPositionAsync({})
                const { latitude, longitude } = location.coords
                setInitialRegion({
                    latitude,
                    longitude,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                })
            } catch (error) {
                console.error('Error getting location', error)
            } finally {
                setLoading(false)
            }
        }

        getLocation()
    }, [])
    const calculateDaysDifference = (exprirationDate) => {
        const currentDate = new Date()
        const targetDate = new Date(exprirationDate)
        const timeDifference = targetDate - currentDate
        const daysDifference = Math.floor(
            timeDifference / (1000 * 60 * 60 * 24)
        )
        return daysDifference
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
            handleCloseModal()
            setLoading(false)
        }
    }
    const handleMap = (_address) => {
        const mapAddress = encodeURIComponent(_address)
        const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${mapAddress}`
        Linking.openURL(googleMapsUrl)
    }
    const moveToCurrentLocation = () => {
        if (mapViewRef.current && initialRegion) {
            mapViewRef.current.animateToRegion(initialRegion)
        }
    }

    return (
        <View style={styles.container}>
            <ModalLoading visible={loading} />
            {initialRegion && (
                <>
                    <MapView
                        ref={mapViewRef}
                        style={styles.maps}
                        initialRegion={initialRegion}
                        // provider="google"
                        customMapStyle={[]}
                        showsUserLocation={true}
                    >
                        {locationPost.map((item, index) => {
                            const offset = 0.0001 * index // Điều chỉnh giá trị offset tùy thuộc vào trường hợp của bạn

                            return (
                                <Marker
                                    key={item._id}
                                    coordinate={{
                                        latitude:
                                            item.coordinates.latitude + offset,
                                        longitude: item.coordinates.longitude,
                                    }}
                                    title={item.ownerDisplayname}
                                    description={item.content}
                                    onPress={() => handleMarkerPress(item)}
                                >
                                    <Image
                                        source={require(maker)}
                                        style={{
                                            width: 40,
                                            height: 40,
                                            borderRadius: 20,
                                        }}
                                    />
                                </Marker>
                            )
                        })}
                    </MapView>
                    <TouchableOpacity
                        style={{
                            position: 'absolute',
                            bottom: 100,
                            right: 16,
                            backgroundColor: '#fff',
                            padding: 5,
                            borderRadius: 25,
                        }}
                        onPress={moveToCurrentLocation}
                    >
                        <MaterialIcons
                            name="my-location"
                            size={30}
                            color={COLORS.primary}
                        />
                    </TouchableOpacity>
                </>
            )}
            <Modal
                animationType="slide"
                visible={selectedPost !== null}
                onRequestClose={handleCloseModal}
                customBackdrop={
                    <TouchableWithoutFeedback onPress={handleCloseModal}>
                        <View style={{ flex: 1 }} />
                    </TouchableWithoutFeedback>
                }
                avoidKeyboard={true}
                style={{
                    margin: 0,
                    justifyContent: 'flex-end',
                    flex: 1,
                    borderRadius: 25,
                }}
            >
                <View
                    style={{
                        width: '100%',
                        height: 300,
                        backgroundColor: '#fff',
                        borderTopLeftRadius: 25,
                        borderTopRightRadius: 25,
                        paddingBottom: 30,
                        shadowColor: COLORS.black,
                        shadowOffset: {
                            width: 0,
                            height: 4.5,
                        },
                        shadowOpacity: 0.5,
                        shadowRadius: 6.5,
                        elevation: 2,
                    }}
                >
                    {selectedPost && (
                        <View
                            style={{
                                flex: 1,
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                            activeOpacity={0.8}
                        >
                            <ModalLoading visible={loading} />
                            <View
                                style={{
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    backgroundColor: '#F0F0F0',
                                    borderRadius: 15,
                                    width: screenWidth - 25,
                                    paddingBottom: 15,
                                }}
                            >
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        backgroundColor: '#F0F0F0',
                                        width: screenWidth - 25,
                                        marginHorizontal: 12,
                                        marginTop: 15,
                                        justifyContent: 'flex-start',
                                        borderRadius: 15,
                                        padding: 10,
                                    }}
                                >
                                    {/* <View
                                        style={{
                                            position: 'absolute',
                                            zIndex: 3,
                                            top: 30,
                                            backgroundColor: '#EE6457',
                                            borderBottomRightRadius: 5,
                                            borderTopRightRadius: 5,
                                            width: 55,
                                            height: 24,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <Text
                                            style={{
                                                color: '#fff',
                                                fontSize: 12,
                                                fontWeight: 'bold',
                                            }}
                                        >
                                            {calculateDaysDifference(
                                                selectedPost.exprirationDate
                                            )}{' '}
                                            ngày
                                        </Text>
                                    </View> */}
                                    <Image
                                        source={selectedPost.media}
                                        style={{
                                            width: 110,
                                            height: 110,
                                            borderRadius: 15,
                                        }}
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
                                            {selectedPost.content.length > 22
                                                ? `${selectedPost.content.slice(
                                                      0,
                                                      22
                                                  )}...`
                                                : selectedPost.content}
                                        </Text>
                                        <Text
                                            style={{
                                                marginTop: 15,
                                                fontSize: 13,
                                            }}
                                        >
                                            Tạo bởi{' '}
                                            <Text
                                                style={{
                                                    marginLeft: 12,
                                                    marginTop: 15,
                                                    fontWeight: '700',
                                                    color: COLORS.primary,
                                                }}
                                            >
                                                {selectedPost.ownerDisplayname}
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
                                                    selectedPost.totalUserJoin /
                                                    selectedPost.participants
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
                                                        {
                                                            selectedPost.totalUserJoin
                                                        }{' '}
                                                        /{' '}
                                                        {
                                                            selectedPost.participants
                                                        }
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
                                                        (selectedPost.totalUserJoin /
                                                            selectedPost.participants) *
                                                        100
                                                    ).toFixed(0)}{' '}
                                                    %
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        marginTop: 10,
                                    }}
                                >
                                    <TouchableOpacity
                                        activeOpacity={0.8}
                                        onPress={() =>
                                            handleMap(selectedPost.address)
                                        }
                                        style={{
                                            backgroundColor: COLORS.white,
                                            height: 50,
                                            marginRight: 8,
                                            width: '45%',
                                            borderWidth: 2,
                                            borderColor: COLORS.primary,
                                            borderRadius: 16,
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            flexDirection: 'row',
                                            padding: 1,
                                        }}
                                    >
                                        <Text
                                            style={{
                                                fontFamily: 'monterrat',
                                                color: COLORS.primary,
                                                marginRight: 10,
                                            }}
                                        >
                                            CHỈ ĐƯỜNG
                                        </Text>
                                        <MaterialIcons
                                            name={'directions'}
                                            size={30}
                                            color={COLORS.primary}
                                        />
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() =>
                                            viewDetailPost(selectedPost._id)
                                        }
                                        activeOpacity={0.8}
                                        style={{
                                            backgroundColor: COLORS.primary,
                                            height: 50,
                                            width: '45%',
                                            marginLeft: 8,
                                            borderRadius: 16,
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            flexDirection: 'row',
                                        }}
                                    >
                                        <Text
                                            style={{
                                                fontFamily: 'monterrat',
                                                color: COLORS.white,
                                                marginRight: 10,
                                            }}
                                        >
                                            XEM CHI TIẾT
                                        </Text>
                                        <Ionicons
                                            name={'reader-outline'}
                                            size={30}
                                            color={COLORS.white}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    )}
                </View>
            </Modal>
        </View>
    )
}

export default MapScreen
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    maps: {
        flex: 1,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 8,
    },
})
