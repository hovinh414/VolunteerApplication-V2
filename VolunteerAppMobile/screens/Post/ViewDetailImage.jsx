import React, { useState, useEffect } from 'react'
import { View, Text, Image, TouchableOpacity, Linking } from 'react-native'
import {
    MaterialIcons,
    Feather,
    Ionicons,
    FontAwesome,
} from '@expo/vector-icons'
import COLOR from '../../constants/colors'
import { COLORS } from '../../constants'
import * as FileSystem from 'expo-file-system'
import { shareAsync } from 'expo-sharing';
import moment from 'moment';

const ViewDetailImage = ({ route, navigation }) => {
    const content = route.params

    const downloadFromUrl = async (_imageUrl) => {
        let date = moment().format('YYYYMMDDhhmmss')
        const filename = date + '.jpg'
        const result = await FileSystem.downloadAsync(
            _imageUrl,
            FileSystem.documentDirectory + filename
        )
        console.log(result)

        save(result.uri, filename, result.headers['Content-Type'])
    }
    const save = async (uri, filename, mimetype) => {
        if (Platform.OS === 'android') {
            const permissions =
                await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync()
            if (permissions.granted) {
                const base64 = await FileSystem.readAsStringAsync(uri, {
                    encoding: FileSystem.EncodingType.Base64,
                })
                await FileSystem.StorageAccessFramework.createFileAsync(
                    permissions.directoryUri,
                    filename,
                    mimetype
                )
                    .then(async (uri) => {
                        await FileSystem.writeAsStringAsync(uri, base64, {
                            encoding: FileSystem.EncodingType.Base64,
                        })
                    })
                    .catch((e) => console.log(e))
            } else {
                shareAsync(uri)
            }
        } else {
            shareAsync(uri)
        }
    }

    return (
        <View style={{ flex: 1 }}>
            {/* Nút "Go Back" */}
            <TouchableOpacity
                style={{
                    position: 'absolute',
                    top: 60,
                    left: 15,
                    zIndex: 1,
                }}
                onPress={() => navigation.goBack()}
            >
                <MaterialIcons
                    name="keyboard-arrow-left"
                    size={35}
                    color={COLORS.black}
                />
            </TouchableOpacity>
            <TouchableOpacity
                style={{
                    position: 'absolute',
                    top: 60,
                    right: 15,
                    zIndex: 1,
                }}
                onPress={() => downloadFromUrl(content)}
            >
                <Feather name="download" size={28} color={COLORS.black} />
            </TouchableOpacity>

            {/* Hiển thị ảnh */}
            <Image
                source={{ uri: content }}
                style={{
                    flex: 1,
                    resizeMode: 'contain',
                }}
            />
        </View>
    )
}

export default ViewDetailImage
