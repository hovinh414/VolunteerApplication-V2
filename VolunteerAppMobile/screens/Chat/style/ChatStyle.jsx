import { StyleSheet } from 'react-native'
import COLORS from '../../../constants/colors'
export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 13,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center', // Đảm bảo icon và văn bản nằm cùng hàng giữa
        paddingTop: 7,
    },
    searchInput: {
        flexDirection: 'row',
        alignItems: 'center',
        margin: 12,
        padding: 8,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        fontSize: 16,
        marginBottom: 15,
    },
    searchText: { flex: 1, height: 30 },
    chat: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#fff',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    viewChat: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent:"space-between"
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 30,
    },
    avatarDetail: {
        width: 40,
        height: 40,
        borderRadius: 30,
        marginLeft: 20,
        marginRight: 5,
    },
})
