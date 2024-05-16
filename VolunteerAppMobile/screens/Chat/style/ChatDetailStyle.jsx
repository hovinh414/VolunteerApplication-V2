import { StyleSheet } from 'react-native'
import COLORS from '../../../constants/colors'
export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 40,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        paddingRight: 12,
        paddingLeft: 12,
    },
    avatarDetail: {
        marginLeft: 10,
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    viewIcon: {
        borderTopWidth: 0.5,
        borderColor: '#ccc',
        flexDirection: 'column',
        marginTop: 10,
    },
    myMessage: {
        backgroundColor: COLORS.primary,
        alignSelf: 'flex-end',
        alignItems: 'flex-end',
        padding: 5,
        borderRadius: 10,
        marginLeft: 24,
    },
    theirMessage: {
        backgroundColor: '#D3D3D3',
        alignSelf: 'flex-start',
        padding: 5,
        borderRadius: 10,
        marginRight: 24,
    },
    messageMyText: {
        padding: 3,
        color: '#fff',
        fontSize: 16,
    },
    messageTheirText: {
        padding: 3,
        color: '#000',
        fontSize: 16,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 12,
        padding: 8,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 20,
        fontSize: 16,
        width: '85%',
    },
    input: {
        flex: 1,
        height: 25,
        margin: 5,
    },
    sendButton: {
        color: COLORS.primary,
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    viewListImage: {
        marginTop: 12,
        marginLeft: 20,
        marginRight: 20,
        marginBottom: 12,
    },
    viewNoListImage: {
        marginTop: 12,
    },
    viewImage: {
        position: 'relative',
        flexDirection: 'column',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        paddingVertical: 4,
        marginLeft: 12,
        width: 80,
        height: 80,
        borderRadius: 12,
    },
    btnRemoveImage: {
        position: 'absolute',
        top: 0,
        right: 0,
        backgroundColor: '#C5C7C7',
        borderRadius: 12, // Bo tròn góc
        padding: 5,
    },
    viewFile: {
        marginBottom: 20,
        position: 'relative',
        flexDirection: 'column',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: '#ddd',
        borderWidth: 1,
        paddingVertical: 5,
        borderRadius: 8,
        marginRight: 10,
    },
    file: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        alignSelf: 'flex-start',
    },
    fileIcon: {
        paddingVertical: 4,
        marginLeft: 12,
        width: 80,
        height: 80,
        borderRadius: 12,
        marginRight: 10,
    },
    fileName: {
        top: 30,
        color: '#000',
        marginRight: 10,
        fontSize: 16,
        fontWeight: '500',
    },
    btnRemoveFile: {
        position: 'absolute',
        top: 5,
        right: 5,
        backgroundColor: '#C5C7C7',
        borderRadius: 12,
        padding: 5,
    },
})
