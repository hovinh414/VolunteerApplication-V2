import { StyleSheet, Dimensions } from 'react-native'
import COLORS from '../../../constants/colors'
const screenWidth = Dimensions.get('window').width
export const styles = StyleSheet.create({
    viewSearch: {
        marginTop: 25,
        justifyContent: 'center',
        alignItems: 'center',
        width: 210,
        height: 210,
        backgroundColor: '#F0F0F0',
        borderRadius: 105,
    },
    textUserNoJoin: {
        marginTop: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
    imgSearch: { width: 180, height: 180 },
    itemJoin: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 12,
    },
    viewItem: {
        flexDirection: 'column',
        backgroundColor: '#F0F0F0',
        width: screenWidth / 3 - 24,
        height: screenWidth / 3 - 24,
        margin: 6,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 15,
    },
    imgAvatar: {
        marginTop: 10,
        width: screenWidth / 3 - 64,
        height: screenWidth / 3 - 64,
        borderRadius: 20,
    },
    textName: {
        fontSize: 18,
        marginTop: 8,
        fontWeight: '700',
        color: COLORS.primary,
    },
})
