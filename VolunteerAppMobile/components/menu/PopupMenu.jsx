import {
    View,
    Text,
    TouchableOpacity,
    Modal,
    SafeAreaView,
    StyleSheet,
    Animated,
    Easing,
    Dimensions,
} from 'react-native'
import React, { useState, useRef, useEffect } from 'react'
import { COLORS } from '../../constants'
import {
    MaterialIcons,
    Feather,
    Ionicons,
    FontAwesome,
} from '@expo/vector-icons'
import { getStatusBarHeight } from 'react-native-status-bar-height'
const screenHeight = Dimensions.get('window').height
const statusBarHeight = getStatusBarHeight()
const PopupMenu = ({options}) => {
    const [visible, setVisible] = useState(false)
    const scale = useRef(new Animated.Value(0)).current
    
    function resizeBox(to) {
        to === 1 && setVisible(true)
        Animated.timing(scale, {
            toValue: to,
            useNativeDriver: true,
            duration: 200,
            easing: Easing.linear,
        }).start(() => to === 0 && setVisible(false))
    }
    return (
        <>
            <TouchableOpacity
                onPress={() => resizeBox(1)}
                style={{
                    position: 'absolute',
                    bottom:
                        Platform.OS == 'ios'
                            ? screenHeight - statusBarHeight - 50
                            : screenHeight - 50,
                    right: 20,
                    borderRadius: 50,
                    backgroundColor: '#cccc',
                    zIndex: 3,
                    padding: 4,
                }}
            >
                <Ionicons
                    name="ellipsis-horizontal"
                    size={26}
                    color={COLORS.black}
                />
            </TouchableOpacity>
            <Modal transparent visible={visible}>
                <SafeAreaView
                    style={{ flex: 1 }}
                    onTouchStart={() => resizeBox(0)}
                >
                    <Animated.View
                        style={[styles.popup, { transform: [{ scale }] }]}
                    >
                        {options.map((item, index) => (
                            <TouchableOpacity
                                style={[
                                    styles.option,
                                    {
                                        opacity: scale.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: [0, 1],
                                        }),
                                    },
                                    {
                                        borderBottomWidth:
                                            index === options.length - 1
                                                ? 0
                                                : 1,
                                    },
                                ]}
                                key={index}
                                onPress={item.action}
                            >
                                <Text>{item.title}</Text>
                                <Ionicons
                                    name={item.icon}
                                    size={26}
                                    color={'#212121'}
                                    style={{ marginLeft: 10 }}
                                />
                            </TouchableOpacity>
                        ))}
                    </Animated.View>
                </SafeAreaView>
            </Modal>
        </>
    )
}
const styles = StyleSheet.create({
    popup: {
        borderRadius: 8,
        backgroundColor: '#fff',
        paddingHorizontal: 10,
        position: 'absolute',
        bottom:
            Platform.OS == 'ios'
                ? screenHeight - statusBarHeight - 180
                : screenHeight -180,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.5,
        shadowRadius: 4,
        elevation: 5,
        right: 20,
    },
    option: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 7,
        borderBottomColor: '#ccc',
    },
})
export default PopupMenu
