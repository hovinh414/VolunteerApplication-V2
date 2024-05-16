import { View, Text, Linking } from 'react-native'
import React, { useState, useEffect } from 'react'

import AsyncStoraged from '../../../services/AsyncStoraged'
import CustomViewInfo from '../../../components/custom/CustomViewInfo'
const InfoRoute = ({ navigation }) => {
    const [address, setAddress] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const getUserStored = async () => {
        const userStored = await AsyncStoraged.getData()
        setAddress(userStored.address)
        setEmail(userStored.email)
        setPhone(userStored.phone)
    }
    useEffect(() => {
        getUserStored()
    }, [])
    const handleMap = () => {
        const mapAddress = encodeURIComponent(address)
        const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${mapAddress}`
        Linking.openURL(googleMapsUrl)
    }
    const handlePhone = () => {
        const phoneUrl = `tel:${phone}`
        Linking.openURL(phoneUrl)
    }
    const handleEmail = () => {
        const emailUrl = `mailto:${email}`
        Linking.openURL(emailUrl)
    }
    return (
        <View style={{ flex: 1, marginHorizontal: 22 }}>
            <View
                style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderBottomWidth: 1,
                    padding: 25,
                    borderBottomColor: '#cccc',
                    zIndex: 2,
                }}
            >
                <Text style={{ fontWeight: 'bold', fontSize: 20 }}>
                    Thông tin cá nhân
                </Text>
            </View>
            <View style={{ paddingTop: 20 }}>
                <CustomViewInfo
                    onPress={handleMap}
                    value={address}
                    icon={'location-outline'}
                    height={70}
                />
            </View>
            <View style={{ paddingTop: 20 }}>
                <CustomViewInfo
                    onPress={handleEmail}
                    value={email}
                    icon={'mail-outline'}
                    height={48}
                />
            </View>
            <View style={{ paddingTop: 20 }}>
                <CustomViewInfo
                    onPress={handlePhone}
                    value={phone}
                    icon={'call-outline'}
                    height={48}
                />
            </View>
        </View>
    )
}
export default InfoRoute
