import React, { useState, useEffect } from 'react'
import axios from 'axios'
import {
    Modal,
    StyleSheet,
    TouchableOpacity,
    Text,
    View,
    Dimensions,
    ScrollView,
    KeyboardAvoidingView,
} from 'react-native'
import CustomButton from '../../components/custom/CustomButton'
import { COLORS, FONTS } from '../../constants/theme'
import { MaterialIcons, Feather, Ionicons } from '@expo/vector-icons'
import { Dropdown } from 'react-native-element-dropdown'
import CustomInput from '../../components/custom/CustomInput'
import { useNavigation } from '@react-navigation/native'
import AsyncStoraged from '../../services/AsyncStoraged'
import API_URL from '../../config/config'
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message'
import ToastAlert from '../../components/modal/ToastAlert'

const ChangeAddress = () => {
    const screenWidth = Dimensions.get('window').width
    const [countryData, setCountryData] = useState([])
    const [stateData, setStateData] = useState([])
    const [cityData, setCityData] = useState([])
    const [country, setCountry] = useState(null)
    const [state, setState] = useState(null)
    const [city, setCity] = useState(null)
    const [countryName, setCountryName] = useState(null)
    const [stateName, setStateName] = useState(null)
    const [cityName, setCityName] = useState(null)
    const [isFocus, setIsFocus] = useState(false)
    const [address, setAddress] = useState(null)
    const [fullAddress, setFullAddress] = useState(null)
    const [ButtonPress, setButtonPress] = useState('')
    const [userId, setUserId] = useState()
    const [token, setToken] = useState()
    const [type, setType] = useState('')
    const navigation = useNavigation()

    const getToken = async () => {
        const token = await AsyncStoraged.getToken()
        setToken(token)
    }
    const getUserStored = async () => {
        const userStored = await AsyncStoraged.getData()
        setUserId(userStored._id)
        setType(userStored.type)
    }
    useEffect(() => {
        getUserStored()
    }, [])
    useEffect(() => {
        getToken()
    }, [])
    const onRefresh = () => {
        getToken()
        getUserStored()
    }
    useEffect(() => {
        var config = {
            method: 'get',
            url: 'https://provinces.open-api.vn/api/?depth=1',
        }

        axios(config)
            .then((response) => {
                var count = Object.keys(response.data).length
                let countryArray = []
                for (var i = 0; i < count; i++) {
                    countryArray.push({
                        value: response.data[i].code,
                        label: response.data[i].name,
                    })
                }
                setCountryData(countryArray)
            })
            .catch((error) => {
                console.log(error)
            })
    }, [])
    const handleState = (countryCode) => {
        var config = {
            method: 'get',
            url:
                'https://provinces.open-api.vn/api/p/' +
                countryCode +
                '/?depth=2',
        }

        axios(config)
            .then(function (response) {
                var count = Object.keys(response.data.districts).length
                let stateArray = []
                for (var i = 0; i < count; i++) {
                    stateArray.push({
                        value: response.data.districts[i].code,
                        label: response.data.districts[i].name,
                    })
                }
                setStateData(stateArray)
            })
            .catch((error) => {
                console.log('API Error:', error)
            })
    }

    const handleCity = (stateCode) => {
        var config = {
            method: 'get',
            url:
                'https://provinces.open-api.vn/api/d/' +
                stateCode +
                '/?depth=2',
        }

        axios(config)
            .then(function (response) {
                var count = Object.keys(response.data.wards).length
                let cityArray = []
                for (var i = 0; i < count; i++) {
                    cityArray.push({
                        value: response.data.wards[i].code,
                        label: response.data.wards[i].name,
                    })
                }
                setCityData(cityArray)
            })
            .catch(function (error) {
                console.log(error)
            })
    }
    const formData = new FormData()
    const handleUpdateAddress = async () => {
        if (!countryName || !cityName || !stateName || !address) {
            Toast.show({
                type: 'warning',
                text1: 'Cảnh báo',
                text2: 'Vui lòng nhập đầy đủ địa chỉ!',
                visibilityTime: 2500,
            })
            return
        }
        formData.append('address', fullAddress)

        setButtonPress(true)
        axios
            .put(API_URL.API_URL + '/user?userid=' + userId, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: token,
                },
            })
            .then((response) => {
                if (response.data.status === 'SUCCESS') {
                    AsyncStoraged.storeData(
                        response.data.data.userResultForUpdate
                    )
                    if (type === 'Organization') {
                        Toast.show({
                            type: 'success',
                            text1: 'Thành công',
                            text2: 'Thay đổi địa chỉ thành công',
                            visibilityTime: 2500,
                            autoHide: true,
                            onHide: () => {
                                navigation.navigate('ProfileOrganisation')
                            },
                        })
                    } else {
                        Toast.show({
                            type: 'success',
                            text1: 'Thành công',
                            text2: 'Thay đổi địa chỉ thành công',
                            visibilityTime: 2500,
                            autoHide: true,
                            onHide: () => {
                                navigation.navigate('Profile')
                            },
                        })
                    }
                    onRefresh()
                    setButtonPress(false)
                }
            })
            .catch((error) => {
                console.log(error)
                Toast.show({
                    type: 'error',
                    text1: 'Thất bại',
                    text2: 'Thay đổi địa chỉ thất bại!',
                    visibilityTime: 2500,
                })
                setButtonPress(false)
            })
    }
    return (
        <KeyboardAvoidingView
            style={{
                backgroundColor: '#fff',
                height: 1000,
            }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <ToastAlert/>
            <ScrollView style={{ zIndex: 1 }}>
                <View
                    style={{
                        flex: 1,
                    }}
                >
                    <View
                        style={{
                            width: screenWidth,
                            paddingBottom: 20,
                            paddingLeft: 20,
                            paddingRight: 20,
                        }}
                    >
                        <View
                            style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <Feather
                                name="minus"
                                size={50}
                                color={COLORS.black}
                            />
                        </View>
                        <View
                            style={{
                                flexDirection: 'row', // Đặt chiều dọc thành chiều ngang
                                alignItems: 'center', // Căn giữa theo chiều dọc
                                marginBottom: 15,
                            }}
                        >
                            <Text
                                style={{
                                    fontWeight: 'bold',
                                    fontSize: 20,
                                    flex: 1, // Để chữ căn giữa
                                    textAlign: 'center', // Để chữ căn giữa theo chiều ngang
                                }}
                            >
                                Cập nhật địa chỉ
                            </Text>
                            <TouchableOpacity
                                onPress={() => navigation.goBack()}
                                style={{
                                    position: 'absolute',
                                    right: 0, // Đặt biểu tượng bên phải
                                }}
                            >
                                <MaterialIcons
                                    name="close"
                                    size={25}
                                    color={COLORS.black}
                                />
                            </TouchableOpacity>
                        </View>

                        <Text
                            style={{
                                fontSize: 16,
                                fontWeight: 400,
                                marginVertical: 8,
                            }}
                        >
                            Tỉnh/Thành phố{' '}
                        </Text>
                        <Dropdown
                            style={[
                                styles.dropdown,
                                isFocus && { borderColor: COLORS.primary },
                            ]}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.selectedTextStyle}
                            inputSearchStyle={styles.inputSearchStyle}
                            iconStyle={styles.iconStyle}
                            data={countryData}
                            search
                            maxHeight={300}
                            labelField="label"
                            valueField="value"
                            placeholder={
                                !isFocus ? 'Chọn Tỉnh/Thành phố' : '...'
                            }
                            searchPlaceholder="Tìm Kiếm"
                            value={country}
                            onFocus={() => setIsFocus(true)}
                            onBlur={() => setIsFocus(false)}
                            onChange={(item) => {
                                setCountry(item.value)
                                handleState(item.value)
                                setCountryName(item.label)
                                setIsFocus(false)
                            }}
                        />
                        <Text
                            style={{
                                fontSize: 16,
                                fontWeight: 400,
                                marginVertical: 8,
                            }}
                        >
                            Quận/Huyện
                        </Text>
                        <Dropdown
                            style={[
                                styles.dropdown,
                                isFocus && { borderColor: COLORS.primary },
                            ]}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.selectedTextStyle}
                            inputSearchStyle={styles.inputSearchStyle}
                            iconStyle={styles.iconStyle}
                            data={stateData}
                            search
                            maxHeight={300}
                            labelField="label"
                            valueField="value"
                            placeholder={!isFocus ? 'Chọn Quận/Huyện' : '...'}
                            searchPlaceholder="Tìm Kiếm "
                            value={state}
                            onFocus={() => setIsFocus(true)}
                            onBlur={() => setIsFocus(false)}
                            onChange={(item) => {
                                setState(item.value)
                                handleCity(item.value)
                                setStateName(item.label)
                                setIsFocus(false)
                            }}
                        />
                        <Text
                            style={{
                                fontSize: 16,
                                fontWeight: 400,
                                marginVertical: 8,
                            }}
                        >
                            Phường/Xã
                        </Text>
                        <Dropdown
                            style={[
                                styles.dropdown,
                                isFocus && { borderColor: COLORS.primary },
                            ]}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.selectedTextStyle}
                            inputSearchStyle={styles.inputSearchStyle}
                            iconStyle={styles.iconStyle}
                            data={cityData}
                            search
                            maxHeight={300}
                            labelField="label"
                            valueField="value"
                            placeholder={!isFocus ? 'Chọn Phường/Xã' : '...'}
                            searchPlaceholder="Tìm Kiếm"
                            value={city}
                            onFocus={() => setIsFocus(true)}
                            onBlur={() => setIsFocus(false)}
                            onChange={(item) => {
                                setCity(item.value)
                                setCityName(item.label)
                                setIsFocus(false)
                            }}
                        />
                        <Text
                            style={{
                                fontSize: 16,
                                fontWeight: 400,
                                marginVertical: 8,
                            }}
                        >
                            Số nhà, tên đường ...{' '}
                        </Text>
                        <CustomInput
                            value={address}
                            placeholder="Số nhà, tên đường"
                            onChangeText={(address) => {
                                setFullAddress(null)
                                setAddress(address)
                                setFullAddress(
                                    address +
                                        ', ' +
                                        cityName +
                                        ', ' +
                                        stateName +
                                        ', ' +
                                        countryName
                                )
                            }}
                        />

                        <View
                            style={{
                                marginTop: 15,
                            }}
                        >
                            <CustomButton
                                onPress={() => handleUpdateAddress()}
                                title="CẬP NHẬT ĐỊA CHỈ"
                                isLoading={ButtonPress}
                            />
                        </View>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#533483',
        padding: 16,
        justifyContent: 'center',
        alignContent: 'center',
    },
    dropdown: {
        width: '100%',
        height: 48,
        borderColor: '#A9A9A9',
        borderWidth: 1,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: 22,
    },
    icon: {
        position: 'absolute',
        right: 12,
    },
    label: {
        position: 'absolute',
        backgroundColor: 'white',
        left: 22,
        top: 8,
        zIndex: 999,
        paddingHorizontal: 8,
        fontSize: 14,
    },
    placeholderStyle: {
        color: '#999',
        fontSize: 13,
    },
    selectedTextStyle: {
        fontSize: 16,
    },
    iconStyle: {
        marginRight: 12,
        width: 20,
        height: 20,
        tintColor: COLORS.primary,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
    },
})
export default ChangeAddress
