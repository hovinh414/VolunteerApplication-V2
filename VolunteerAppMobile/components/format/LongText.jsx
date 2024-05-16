import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    FlatList,
    TextInput,
    RefreshControl,
    Modal,
} from 'react-native'
import React, { useState, useEffect } from 'react'
import { COLORS, FONTS, SIZES, images } from '../../constants'
const LongText = ({ content, maxLength }) => {
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
                <TouchableOpacity activeOpacity={1} onPress={toggleTextVisibility}>
                    <Text style={{ fontSize: 16, textAlign: 'justify' }}>
                        {displayText}
                    </Text>
                    <Text style={{ fontWeight: '500', color: COLORS.primary }}>
                        {isFullTextVisible ? '...Thu gọn' : '...Xem thêm'}
                    </Text>
                </TouchableOpacity>
            )}
        </View>
    )
}
export default LongText
