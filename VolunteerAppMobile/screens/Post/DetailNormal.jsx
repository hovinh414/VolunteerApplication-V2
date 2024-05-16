import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Alert,
    Dimensions,
    Image,
    FlatList,
    Linking,
} from 'react-native'
import React, { useState, useEffect } from 'react'
import { COLORS, FONTS, SIZES } from '../../constants/theme'
import PopupMenu from '../../components/menu/PopupMenu'
import {
    MaterialIcons,
    Feather,
    Ionicons,
    FontAwesome,
} from '@expo/vector-icons'
import { SliderBox } from 'react-native-image-slider-box'
import AsyncStoraged from '../../services/AsyncStoraged'
import { getStatusBarHeight } from 'react-native-status-bar-height'
import { styles } from './style/detailStyle'

const DetailNormal = ({ navigation, route }) => {
    const [items, setItems] = useState(route.params)
    function LongText({ content, maxLength }) {
        const [isFullTextVisible, setIsFullTextVisible] = useState(false)

        // Hàm này được gọi khi người dùng bấm vào nút "Xem thêm" hoặc "Thu gọn"
        const toggleTextVisibility = () => {
            setIsFullTextVisible(!isFullTextVisible)
        }

        // Hiển thị nội dung đầy đủ hoặc ngắn gọn tùy thuộc vào trạng thái
        const displayText = isFullTextVisible
            ? content
            : content.slice(0, maxLength)

        return (
            <View>
                {content.length > maxLength && (
                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={toggleTextVisibility}
                    >
                        <Text style={{ fontSize: 16, textAlign: 'justify' }}>
                            {displayText}
                        </Text>
                        <Text
                            style={{ fontWeight: '500', color: COLORS.primary }}
                        >
                            {isFullTextVisible ? '...Thu gọn' : '...Xem thêm'}
                        </Text>
                    </TouchableOpacity>
                )}
            </View>
        )
    }
    const handleNavigate = (data) => {
        // console.log(item)
        navigation.navigate('ViewDetailImage', data)
    }
    const handleMap = (_address) => {
        const mapAddress = encodeURIComponent(_address)
        const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${mapAddress}`
        Linking.openURL(googleMapsUrl)
    }

    return (
        <View style={{ flex: 1, marginTop: 12 }}>
            <TouchableOpacity
                style={styles.backBtn}
                onPress={() => navigation.goBack()}
            >
                <MaterialIcons
                    name="keyboard-arrow-left"
                    size={26}
                    color={COLORS.black}
                />
            </TouchableOpacity>
            <ScrollView
                style={{
                    backgroundColor: '#fff',
                }}
            >
                <View style={{ zIndex: 1 }}>
                    <View style={{ flex: 1, marginBottom: 15 }}>
                        <SliderBox
                            images={items.media}
                            paginationBoxVerticalPadding={5}
                            activeOpacity={1}
                            dotColor={COLORS.primary}
                            inactiveDotColor={COLORS.white}
                            sliderBoxHeight={250}
                            resizeMode={'contain'}
                            autoplay
                            dotStyle={{ width: 7, height: 7 }}
                        />
                    </View>
                    <View
                        style={{
                            flexDirection: 'row',
                            paddingHorizontal: 12,
                            marginBottom: 5,
                        }}
                    >
                        <TouchableOpacity
                            onPress={() => handleMap(items.address)}
                            activeOpacity={0.8}
                            style={styles.viewMap}
                        >
                            <Ionicons
                                name="location-outline"
                                size={22}
                                color="#696969"
                            />
                            <Text style={styles.textMap}>{items.address}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.ownerView}>
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'flex-start',
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 14,
                                    color: '#696969',
                                }}
                            >
                                Đăng bởi:
                            </Text>
                            <Text style={styles.ownerName}>
                                {items.ownerDisplayname}{' '}
                                <FontAwesome
                                    name="check-circle"
                                    size={15}
                                    color={COLORS.primary}
                                />
                            </Text>
                        </View>
                    </View>
                    <View
                        style={{
                            flexDirection: 'column',
                            paddingTop: 10,
                            paddingHorizontal: 12,
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 16,
                                fontWeight: 'bold',
                                marginBottom: 15,
                            }}
                        >
                            Câu chuyện
                        </Text>
                        {items.content.length > 100 ? (
                            <LongText maxLength={250} content={items.content} />
                        ) : (
                            <Text
                                style={{ fontSize: 16, textAlign: 'justify' }}
                            >
                                {items.content}
                            </Text>
                        )}
                    </View>
                    <View
                        style={{
                            flexDirection: 'column',
                            paddingTop: 25,
                            paddingHorizontal: 12,
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 16,
                                fontWeight: 'bold',
                                marginBottom: 15,
                            }}
                        >
                            Ảnh/Video
                        </Text>
                        <FlatList
                            style={{
                                marginBottom: 15,
                            }}
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                            data={items.media}
                            renderItem={({ item, index }) => (
                                <View
                                    key={index}
                                    style={{
                                        flexDirection: 'column',
                                        flex: 1,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <TouchableOpacity
                                        style={{
                                            paddingVertical: 4,
                                        }}
                                        onPress={() => handleNavigate(item)}
                                    >
                                        <Image
                                            source={{ uri: item }}
                                            style={styles.imgPost}
                                        />
                                    </TouchableOpacity>
                                </View>
                            )}
                        />
                    </View>
                </View>
            </ScrollView>
        </View>
    )
}

export default DetailNormal
