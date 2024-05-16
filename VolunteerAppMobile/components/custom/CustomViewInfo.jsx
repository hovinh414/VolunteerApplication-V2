import React from 'react'
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
} from 'react-native'
import { COLORS, SIZES } from '../../constants/theme'
import { Ionicons } from '@expo/vector-icons'

const CustomViewInfo = ({ value, placeholder,icon, height, onPress }) => {
    return (
        <React.Fragment>
            <TouchableOpacity
                onPress={onPress}
                style={{
                    width: '100%',
                    height: height,
                    borderColor: '#A9A9A9',
                    borderWidth: 1,
                    borderRadius: 16,
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingLeft: 35,
                    flexDirection: 'row',
                }}
            >
                <Ionicons name={icon} size={24} color={COLORS.primary} />
                <Text

                    style={{
                        paddingRight:30,
                        marginLeft:15,
                        width: "100%"
                    }}>{value}</Text>
            </TouchableOpacity>
        </React.Fragment>
    )
}

const styles = StyleSheet.create({
    errorMessage: {
        paddingTop: 4,
        marginHorizontal: 5,
        color: COLORS.primary,
    },
})
export default CustomViewInfo
