import { View, Text } from 'react-native'
import React, { useState, useEffect } from 'react'
import AsyncStoraged from '../../../services/AsyncStoraged'
import axios from 'axios'
import API_URL from '../../../config/config'
import { Image } from 'expo-image'
import { useNavigation } from '@react-navigation/native'
import Post from '../../Feed/Post'
const loading = '../../../assets/loading.gif'
const PostsRoute = () => {
    const [orgId, setOrgId] = useState()
    const [isLoading, setIsLoading] = useState(false)
    const [posts, setPosts] = useState([])
    const [token, setToken] = useState('')
    const [type, setType] = useState('')
    const getToken = async () => {
        const token = await AsyncStoraged.getToken()
        setToken(token)
    }
    useEffect(() => {
        getToken()
    }, [])
    const getUserStored = async () => {
        const userStored = await AsyncStoraged.getData()
        setOrgId(userStored._id)
        setType(userStored.type)
    }
    useEffect(() => {
        getUserStored()
    }, [])

    const getPosts = async () => {
        axios
            .get(API_URL.API_URL + '/posts/' + orgId + '?page=1&limit=4')
            .then((response) => {
                if (response.data.status === 'SUCCESS') {
                    setPosts(response.data.data)
                }
            })
            .catch((error) => {
                console.log('API Error:', error)
            })
    }
    useEffect(() => {
        getPosts()
    }, [orgId]) // Ensure that orgId is updated as expected

    const [refreshing, setRefreshing] = useState(false)
    const onRefresh = () => {
        setRefreshing(true)
        getPosts().then(() => {
            setRefreshing(false)
        })
    }
    const [isFetchingNextPage, setIsFetchingNextPage] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const fetchNextPage = async () => {
        if (!isFetchingNextPage && currentPage < 10) {
            setIsFetchingNextPage(true)

            try {
                const response = await axios.get(
                    `${API_URL.API_URL}/posts/` +
                        orgId +
                        `?page=${currentPage + 1}&limit=4`
                )
                if (response.data.status === 'SUCCESS') {
                    setPosts([...posts, ...response.data.data])
                    setCurrentPage(currentPage + 1)
                } else {
                    setPosts([...posts, ...response.data.data])
                }
            } catch (error) {
                console.log('API Error:', error)
            } finally {
                setIsFetchingNextPage(false)
            }
        }
    }
    const navigation = useNavigation()
    const RenderLoader = () => {
        return (
            <View>
                {isLoading ? (
                    <View
                        style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <Image
                            source={require(loading)}
                            style={{ width: 50, height: 50 }}
                        />
                    </View>
                ) : null}
            </View>
        )
    }
    return (
        <View
            style={{
                flex: 1,
            }}
        >
            <Post
                posts={posts}
                fetchNextPage={fetchNextPage}
                refreshing={refreshing}
                onRefresh={onRefresh}
                headers={<ProfileCard />}
                footer={RenderLoader}
            />
        </View>
    )
}
export default PostsRoute
