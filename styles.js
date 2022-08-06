import { StyleSheet, Platform, StatusBar } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingLeft: 15,
        paddingRight: 15,
    },
    flexRow: {
        flexDirection:'row'
    },
    Android: {
        flex: 1,
        backgroundColor: 'black',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0
    },
    heading: {
        color: 'white',
        fontSize: 22,
        fontWeight: "bold"
    },
    header: {
        flexDirection: "row",
        alignContent: 'center',
        justifyContent: 'space-between'
    },
    iconContanier: {
        flexDirection: "row",
        justifyContent: 'space-around'
    },
    iconSpace: {
        marginRight: 15
    },
    titles: {
        color: '#a0a0a0',
        fontSize: 18,
        marginTop: 20,
        marginBottom: 20
    },
    titlesP: {
        color: '#a0a0a0',
        fontSize: 18,
        marginTop: 20,
        marginBottom: 20,
        fontWeight: "bold"
    },
    animeTitle: {
        color: '#c9c9c9',
        fontSize: 13,
        textAlign: "center",
        backgroundColor: '#242424',
        paddingTop: 2.5
    },
    searchTitle: {
        color: 'white',
        fontSize: 15,
        textAlign: "center",
        backgroundColor: '#242424',
        paddingTop: 2.5
    },
    renderListHozView: {
        position: "absolute",
        zIndex: 10,
        justifyContent: "center",
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        width: 120,
        height: 166.8,
        borderTopLeftRadius: 4,
        borderTopRightRadius: 4
    },
    renderListHozViewPlay: {
        width: 40,
        height: 40,
        alignSelf: "center"
    },
    epNumber: {
        color: '#c9c9c9',
        fontSize: 12,
        textAlign: "center",
        backgroundColor: '#242424',
        borderBottomLeftRadius: 4,
        borderBottomRightRadius: 4,
        paddingTop: 2,
        paddingBottom: 3,
        flex: 1
    },
    loading: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
    },
    renderListPopularView: {
        marginBottom: 15,
        flexDirection: "row",
    },
    renderListPopularDetails: {
        marginLeft: 15,
        flex: 1,
    },
    renderListPopularHeading: {
        color: '#bdbdbd',
        fontSize: 15,
    },
    renderListPopularEp: {
        color: '#a0a0a0',
        fontSize: 13,
        marginTop:5
    },
    renderListPopularGenre: {
        color: '#bdbdbd',
        fontSize: 12,
        backgroundColor: '#393939',
        padding: 4,
        borderRadius: 6,
        marginRight: 5,
        marginBottom:5
    },
    SearchAnimeInput: {
        backgroundColor: '#333333',
        width: 250,
        borderRadius: 6,
        marginLeft: 15,
        paddingTop: 4,
        paddingBottom:4,
        paddingRight: 10,
        paddingLeft: 10,
        color: 'white',
        fontSize:15
    },
    SearchHeader: {
        flexDirection: 'row',
        paddingTop: 8,
    },
    CatAnimeTitle: {
        fontSize: 20.5,
        flexGrow: 1,
        flex: 1,
        alignSelf: 'center',
        color: 'white',
        marginLeft:10
    }
});