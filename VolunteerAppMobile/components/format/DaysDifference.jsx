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
const DaysDifference =({ exprirationDate }) => {
    const [daysDifference, setDaysDifference] = useState(null)

    useEffect(() => {
        const currentDate = new Date()
        const targetDate = new Date(exprirationDate)
        const timeDifference = targetDate - currentDate
        const daysDifference = Math.floor(
            timeDifference / (1000 * 60 * 60 * 24)
        )
        setDaysDifference(daysDifference)
    }, [exprirationDate])

    if (daysDifference === null) {
        return null // Hoặc thay thế bằng UI mặc định khác nếu cần
    }
    if (daysDifference <= 0) {
        return (
            <Text
                style={{
                    fontSize: 14,
                    color: COLORS.blue,
                    marginLeft: 4,
                }}
            >
                Đã hết hạn đăng ký
            </Text>
        )
    } else {
        return (
            <Text
                style={{
                    fontSize: 16,
                    color: COLORS.blue,
                    marginLeft: 4,
                }}
            >
                Còn lại: {daysDifference} ngày
            </Text>
        )
    }
}
export default DaysDifference