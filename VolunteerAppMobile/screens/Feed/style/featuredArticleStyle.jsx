import { StyleSheet, Dimensions } from 'react-native'
import COLORS from '../../../constants/colors'
const screenWidth = Dimensions.get('window').width
export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 13,
        paddingTop: 55,
        paddingBottom: 30,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 7,
        justifyContent: 'space-between',
    },
    textHeader: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 7,
    },
    searchInput: {
        flexDirection: 'row',
        borderRadius: 10,
        borderColor: '#cccc',
        borderWidth: 1,
        marginLeft: 15,
        marginRight: 8,
        flex: 1,
        padding: 7,
        alignItems: 'center',
    },
    viewItem: {
        flexDirection: 'row',
        backgroundColor: '#F0F0F0',
        width: screenWidth - 25,
        height: 130,
        marginHorizontal: 12,
        marginTop: 15,
        justifyContent: 'flex-start',
        borderRadius: 15,
        padding: 10,
    },
    imgItem: {
        width: 110,
        height: 110,
        borderRadius: 15,
    },
    owner: {
        marginLeft: 12,
        marginTop: 15,
        fontWeight: '700',
        color: COLORS.primary,
    },
})
