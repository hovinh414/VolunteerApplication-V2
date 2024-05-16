import AsyncStorage from '@react-native-async-storage/async-storage';

class AsyncStoraged {
    storeData = async (value) => {
        try {
            const jsonValue = JSON.stringify(value)
            await AsyncStorage.setItem('Authorized', jsonValue);
        } catch (error) {
            console.error('Store' + error);
        }
    }

    getData = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem('Authorized')
            return jsonValue != null ? JSON.parse(jsonValue) : null;
        } catch (error) {
            console.error('get store', error);
        }
    }

    removeData = async () => {
        try {
            await AsyncStorage.removeItem('Authorized');
        } catch (e) {
            console.error(e);
        }
        console.log('Done.')
    }

    setToken = async (value) => {
        try {
            await AsyncStorage.setItem('Token', value);
        } catch (error) {
            console.error('Store' + error);
        }
    }
    removeToken = async () => {
        try {
            await AsyncStorage.removeItem('Token');
        } catch (e) {
            console.error(e);
        }
        console.log('Done.')
    }
    getToken = async () => {
        try {
            const value = await AsyncStorage.getItem('Token')
            return value;
        } catch (error) {
            console.error('get store', error);
        }
    }
    setIsActive = async (value) => {
        try {
            await AsyncStorage.setItem('isActive', value);
        } catch (error) {
            console.error('Store' + error);
        }
    }
    removeIsActive = async () => {
        try {
            await AsyncStorage.removeItem('isActive');
        } catch (e) {
            console.error(e);
        }
        console.log('Done.')
    }
    getIsActive = async () => {
        try {
            const value = await AsyncStorage.getItem('isActive')
            return value;
        } catch (error) {
            console.error('get store', error);
        }
    }
    setFollower = async (value) => {
        try {
            await AsyncStorage.setItem('Follower', value);
        } catch (error) {
            console.error('Store' + error);
        }
    }
    removeFollower = async () => {
        try {
            await AsyncStorage.removeItem('Follower');
        } catch (e) {
            console.error(e);
        }
        console.log('Done.')
    }
    getFollower = async () => {
        try {
            const value = await AsyncStorage.getItem('Follower')
            return value;
        } catch (error) {
            console.error('get store', error);
        }
    }
    storeDataBykey = async (key, value) => {
        try {
            const jsonValue = JSON.stringify(value)
            await AsyncStorage.setItem(key, jsonValue);
        } catch (error) {
            console.error('Store' + error);
        }
    }
    getDataByKey = async (postKey) => {
        try {
            const jsonValue = await AsyncStorage.getItem(postKey)
            return jsonValue != null ? JSON.parse(jsonValue) : null;
        } catch (error) {
            console.error('get store', error);
        }
    }
}
export default new AsyncStoraged();