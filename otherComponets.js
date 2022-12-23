import React from 'react';
import { styles } from './styles.js';
import { WebView } from 'react-native-webview';
import { useState, useEffect } from 'react';
import * as ScreenOrientation from 'expo-screen-orientation';
import { Text, View, BackHandler , Image, Dimensions, FlatList, TouchableWithoutFeedback, TextInput, ActivityIndicator, ScrollView, Button  } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Linking from 'expo-linking';


const serverLink = "https://takemyassm3u8maker-lavish883.koyeb.app/";

// Async Storage Keys
// 'hearted' - for anime that are hearted needs, relased date, Title, Img,
// 'allWatched' - for all anime watched so it can show green if watched on anime needs link, epNumber
// 'continueWatching' - only last 10 watched , needs link, catLink , title, epNumber, Img
export async function getStoredValues(name) {
    try {
        const value = await AsyncStorage.getItem(name);
        if (value !== null) {
            return JSON.parse(value);
        } 
        return value;
    } catch (e) {
        console.log(err);
    }
}
async function addStoredValue(navigation, item, name) {
    console.log('adding');
    var alreadyInStorage = await getStoredValues(name);
    if (name === 'allWatched' || name === 'continueWatching') {
        try {
            if (alreadyInStorage !== null) {
                var allWatchArry = [];
                if (name === 'continueWatching') {
                    console.log(alreadyInStorage);
                }
                // Remove any duplicates
                for (var i = 0; i < alreadyInStorage.length; i++) {
                    if (name === 'allWatched' || name === 'continueWatching') {
                        if (alreadyInStorage[i].link !== item.link) {
                            allWatchArry.push(alreadyInStorage[i]);
                        }
                    }
                }
                allWatchArry.unshift(item);
                if (name === 'continueWatching') {
                    allWatchArry.slice(0, 20);
                }
                await AsyncStorage.setItem(name, JSON.stringify(allWatchArry));
                if (name === 'allWatched') {
                    // now add to contuine watching list
                    return addStoredValue(navigation, item, 'continueWatching');
                }
            } else {
                alreadyInStorage = [];
                alreadyInStorage.unshift(item);
                await AsyncStorage.setItem(name, JSON.stringify(alreadyInStorage));
            }
            navigation.navigate('Watch', { link: item.link, animeName: name });
        } catch (err) {
            console.log(err);
        }
    }
    if (name === 'hearted') {
        try {
            if (alreadyInStorage !== null && alreadyInStorage.length > 0) {
                var allHeartedArry = [];
                var wasBookMarked = false;
                // see if it was already bookmarked or not
                for (var i = 0; i < alreadyInStorage.length; i++) {
                    if (alreadyInStorage[i].title !== item.title) {
                        allHeartedArry.push(alreadyInStorage[i])
                    } else {
                        wasBookMarked = true;
                    }
                }
                if (wasBookMarked === false) {
                    allHeartedArry.unshift(item);
                }
                console.log(allHeartedArry, wasBookMarked)
                await AsyncStorage.setItem(name, JSON.stringify(allHeartedArry));
            } else {
                alreadyInStorage = [];
                alreadyInStorage.unshift(item);
                await AsyncStorage.setItem(name, JSON.stringify(alreadyInStorage));
            }
        } catch (err) {
            console.log(err);
        }
    }
}
// for my anime list authoriztion
function malAuth() {
    const url = Linking.useURL();

    if (url) {
        const { hostname, path, queryParams } = Linking.parse(url);

        console.log(
            `Linked to app with hostname: ${hostname}, path: ${path} and data: ${JSON.stringify(
                queryParams
            )}`
        );
    }

    return null;
}

// Navigation for Homepage
export function HeaderApp({ navigation }) {
    return (
        <View style={ styles.header}>
            <Text style={styles.heading}>LokiStream</Text>
            <View style={styles.iconContanier}>
                <TouchableWithoutFeedback onPress={() => navigation.navigate("Hearted")}>
                    <Ionicons style={styles.iconSpace} name="md-heart" size={28} color="#e84f4f" />
                </TouchableWithoutFeedback >
                <TouchableWithoutFeedback onPress={() => navigation.navigate('Search')}>
                    <Ionicons name="md-search" size={28} color="white" />
                </TouchableWithoutFeedback >
            </View>
        </View>
        );
};
// Page for Searching
export function SearchApp({ navigation }) {
    // States
    const [searchValue, SetValue] = useState("");
    const [isSearching, setSearching] = useState(false);
    const [searchedItems, SetSearchItems] = useState();
    const [onPage, SetPage] = useState(1);
    const [isLoadingMore, setIsLoading] = useState(false);
    // Function to search Anime
    async function searchAnime(pageNumber) {
        if (pageNumber < 2) {
            setSearching(true);
        } else {
            setIsLoading(true);
        }
        const data = await fetch(serverLink + `search/${pageNumber}?` + searchValue);
        const response = await data.text();
        if (response !== "No results") {
            if (pageNumber > 1) {
                let allSearhResults = searchedItems.concat(JSON.parse(response));
                SetSearchItems(allSearhResults);
            } else {
                SetSearchItems(JSON.parse(response));
            }
        }
        setSearching(false);
        setIsLoading(false);
    }
    // Listen for SearhValue Change
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (searchValue.length >= 3) {
                SetPage(1);
                searchAnime(1);
            }
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [searchValue])
    useEffect(() => {
        console.log(onPage);
        if (onPage > 1) {
            searchAnime(onPage)
        }
    }, [onPage])
    // <Button title="try it out" onPress={() => Linking.openURL("https://myanimelist.net/v1/oauth2/authorize?response_type=code&client_id=acd730572f207d0eab8230a6bb7dac8c&code_challenge=NklUDX_CzS8qrMGWaDzgKs6VqrinuVFHa0xnpWPDy7_fggtM6kAar4jnTwOgzK7nPYfE9n60rsY4fhDExWzr5bf7sEimoqlkjsdaNZ8g&state=RequestID42&redirect_uri=")} />
    return (
        <View style={styles.Android}>
            <View style={styles.container}>
                <StatusBar style="light" />
                <View style={styles.SearchHeader}>
                    <TouchableWithoutFeedback onPress={() => navigation.goBack() }>
                        <Ionicons style={{marginTop:4}} name="arrow-back-outline" size={28} color="white" />
                    </TouchableWithoutFeedback>
                    <TextInput onChangeText={value => SetValue(value)} placeholder={'Search for Anime'} placeholderTextColor={'#bfbfbf'} style={styles.SearchAnimeInput}></TextInput>
                </View>
                {isSearching ? <ActivityIndicator color="white" size="large" style={styles.loading} /> :
                <View style={{paddingTop:10,paddingBottom:10,flex:1,paddingRight:5,paddingLeft:5}}>
                        <FlatList showsVerticalScrollIndicator={false} keyboardShouldPersistTaps={"always"} onEndReached={() => SetPage(onPage + 1)} columnWrapperStyle={{justifyContent:'space-between'}} ItemSeparatorComponent={item => inBetweenListHor(item, true)} numColumns={2} data={searchedItems} renderItem={item => renderListHorizantal(item, navigation , true, true)}></FlatList>
                </View>
                }
                {isLoadingMore ? <ActivityIndicator color="white" size="small" style={styles.loading} /> : <View></View> }
            </View>
        </View>
        )   
}
// Watch Video
export function WatchAnimeApp({ route, navigation }) {
    const { link, animeName } = route.params;
    const [iframeLink, setIframeLink] = useState('');
    const [isLoading, setLoading] = useState(true);

    async function getIframeLink() {
        let dataFetch = await fetch(serverLink + 'watch/' + link + '/' + animeName);
        let resp = await dataFetch.text();
        setIframeLink(resp);
        setLoading(false);
    }

    useEffect(() => {
        getIframeLink()
    })
    
    // Change Screen Orientation
    async function changeScreenOrientation() {
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT);
    }
    useEffect(() => {
        // Move to the Landscape Right
        changeScreenOrientation();
        // Listen if Back Butonn pressed Turn to portatit
        const backAction = () => {
            async function changeScreenOrientationPortait() {
                await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
            }
            changeScreenOrientationPortait();
            navigation.goBack();
            return true;
        };
        const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
        return () => backHandler.remove();

    }, []);
    
    return (
        <View style={{ flex: 1 }}>
            <StatusBar hidden={true} />
            <View style={{ backgroundColor: 'black', flex: 1 }}>
                { isLoading ? 
                    <ActivityIndicator color="white" size="large" style={styles.loading} />
                    :
                    <WebView
                        allowsFullscreenVideo={true}
                        source={{ uri: iframeLink}}
                    />
                }
            </View>    
        </View>
        )
}
// Anime Description and Episodes
export function EpAnime({ route, navigation }) {
    const { catLink } = route.params;
    const [isLoading, setLoading] = useState(true);
    const [catData, setData] = useState();
    const [isReadingMore, setReadingMore] = useState(false);
    const [backUpEpisodesList, setBackUpEpisodesList] = useState(null);
    const [episodes, setEp] = useState(null);
    const [valueEp, setValueEp] = useState(null);
    const [isBookmarked, setBookmarked] = useState(false);

    function filterEp() {
        console.log('filter')
        var filterarray = backUpEpisodesList.filter((itemInList) => { if (itemInList.epNumber.toString().includes(valueEp)) { return itemInList } else { } })
        setEp(filterarray);
        //SetEpisodesLoading(false);
    }
    async function getWatchedEp(allEpisodes, ImageEpLink, AnimeTitle) {
        const watchedEp = await getStoredValues('allWatched');
        if (watchedEp !== null) { 
            for (var i = 0; i < allEpisodes.length; i++) {
                allEpisodes[i].catLink = catLink;
                allEpisodes[i].img = ImageEpLink;
                allEpisodes[i].title = AnimeTitle;
                for (var l = 0; l < watchedEp.length; l++) {
                    if (watchedEp[l].link === allEpisodes[i].link) {
                        allEpisodes[i].watched = true;
                    }
                }
            }
        }
        setBackUpEpisodesList(allEpisodes);
        setEp(allEpisodes);
    }
    async function getCategory() {
        const fetchData = await fetch(serverLink + 'category?' + catLink);
        const response = await fetchData.json();
        setData(response);
        getWatchedEp(response.episodes, response.img, response.title);
        checkBookMarked(response.title)
        setLoading(false);
    }
    function renderEp({ item }, navigation) {
        return (
            <TouchableWithoutFeedback onPress={() => addStoredValue(navigation, item, 'allWatched')}>
                <View style={{ backgroundColor: item.watched === true ? '#07ab1d':'#242424', padding: 10, marginBottom: 15, justifyContent: 'center', borderRadius: 5 }}>
                    <Text style={{ color: 'white' }}>{item.epNumber.replace('Episode ', '')}</Text>
                </View>
            </TouchableWithoutFeedback>
        )
    }
    async function checkBookMarked(title) {
        const alreadyInStorage = await getStoredValues('hearted');
        var bookMarked = false;
        for (var i = 0; i < alreadyInStorage.length; i++) {
            if (alreadyInStorage[i].title === title) {
                bookMarked = true;
                break;
            }
        }
        setBookmarked(bookMarked);
    }
    function changeBookMarkStatus() {
        addStoredValue(navigation, { 'catLink': catLink, 'img': catData.img, 'title': catData.title, 'released': catData.types[3], 'epNumber':null }, 'hearted');
        setBookmarked(!isBookmarked);
    }
    useEffect(function () {
        if (valueEp !== null && valueEp.replace(/ /g, '').length !== 0) {
            //SetEpisodesLoading(true);
            const timeoutId = setTimeout(() => {
                console.log('huh')
                filterEp();
            }, 500);
            return () => clearTimeout(timeoutId);
        } else if (valueEp !== null) {
            setEp(backUpEpisodesList);
            //SetEpisodesLoading(false);
        }
    }, [valueEp])
    useEffect(() => {
        getCategory();
    }, [])
    return (
        <View style={styles.Android}>
            <View style={styles.container}>
            <StatusBar style="light" />
            <View style={[styles.SearchHeader,{justifyContent:'space-between'}]}>
                <TouchableWithoutFeedback onPress={() => navigation.goBack()}>
                    <Ionicons style={{ marginTop: 4 }} name="arrow-back-outline" size={28} color="white" />
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={() => isLoading === true ? console.log('ok') : changeBookMarkStatus() }>
                    <Ionicons style={{ marginTop:4}} name={isBookmarked ? "heart" : "heart-outline"} color={isBookmarked ? "#e84f4f" : "white"} size={28} />
                </TouchableWithoutFeedback>
            </View>
            {isLoading ? <ActivityIndicator color="white" size="large" style={styles.loading} /> :
                <ScrollView style={{flex:1}}>
                    <View style={{marginTop:10,flexDirection:'row'}}>
                        <Image source={{uri: catData.img}} style={{ width: 149.6, height: 220, borderRadius:10}} />
                        <Text numberOfLines={3} style={{color:'white',fontSize:25,marginRight:10,marginLeft:10,flex:1}}>{catData.title}</Text>
                    </View>
                    <Text numberOfLines={isReadingMore ? 1000 : 4} style={{'color':'white', fontSize:14,marginTop:10}}>{  
                       catData.types[1] === 'Plot Summary: ' ? 'Plot Summary: None' : catData.types[1]}
                       {"\n"}
                       {"\n"}
                       {catData.types[0]}
                       {"\n"}
                       {"\n"}
                       {catData.types[2]}
                       {"\n"}
                       {"\n"}
                       {catData.types[3]}
                       {"\n"}
                       {"\n"}
                       {catData.types[4]}
                       {"\n"}
                       {"\n"}
                       {catData.types[5]}
                    </Text>
                    <Text onPress={()=> setReadingMore(!isReadingMore) } style={{ color: '#0f88d9' }}>{isReadingMore ? "Read less": 'Read more'}</Text>
                    <View>
                        <Text style={{ color: 'white', fontSize: 25, marginBottom:7 , alignSelf: 'center' }}>Episodes:</Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', borderRadius: 8, backgroundColor: '#333333', alignSelf:'center', marginBottom:12}}>
                            <Ionicons style={{marginLeft:5}} name="search-sharp" color={'#bfbfbf'} size={16} />
                            <TextInput onChangeText={text => setValueEp(text)} placeholder={"Search for a episode"} placeholderTextColor={"#bfbfbf"} keyboardType={'number-pad'} maxLength={8} style={{paddingLeft:2,paddingRight:8,paddingTop:5,paddingBottom:5 ,alignSelf: 'center', color: 'white' }} />
                        </View>
                        <FlatList columnWrapperStyle={{ justifyContent: 'space-evenly' }} numColumns={5} data={episodes} renderItem={item => renderEp(item, navigation)} keyExtractor={item => item.link} />
                    </View>
                </ScrollView>
            }
            </View>
        </View>
        )
}
export function renderListHorizantal({ item }, navigation, double = false, search = false){
    // Width & Height for the Items
    var widthImage = 120;
    var heightImage = 166.8;
    if (double === true) {
        widthImage = Dimensions.get('window').width / 2 - 30
        heightImage = widthImage * 1.464
    }
    return (
    <TouchableWithoutFeedback onPress={() => navigation.navigate('EpAnime', {catLink: item.catLink}) }>
        <View style={{width:widthImage, borderRadius:4, overflow:"hidden",backgroundColor: '#242424'}}>
            { item.epNumber !== null ?
            <TouchableWithoutFeedback onPress={() => addStoredValue(navigation, item, 'allWatched')}>
                <View style={styles.renderListHozView}>
                    <Image style={styles.renderListHozViewPlay} source={require('./images/play.png')} />
                </View>
            </TouchableWithoutFeedback>: <View></View>
            }
            <Image source={{ uri: item.img, width: widthImage, height: heightImage }} />
            <Text ellipsizeMode={"tail"} numberOfLines={2} style={double ? styles.searchTitle : styles.animeTitle }>{item.title}</Text>
            { double ? <Text style={[styles.epNumber, {fontSize:12.5}]}>{ (search == true ? 'Released: ' : '' ) + (item.released == undefined ? 'None': item.released)}</Text> :
            <Text style={styles.epNumber}>{item.epNumber != null ? item.epNumber : item.epNumber}</Text>
        }
        </View>
    </TouchableWithoutFeedback>
        )
}
// Hearted Anime
export function HeartedAnime({ navigation }) {
    const [bookMarks, SetBookMarks] = useState([]);

    async function getBookMarks() {
        const items = await getStoredValues('hearted');
        SetBookMarks(items);
        console.log(items);
    }
    useEffect(() => {
        getBookMarks()
    }, [])
    return (
        <View style={styles.Android}>
            <View style={styles.container}>
                <StatusBar style="light" />
                <View style={[styles.SearchHeader]}>
                    <TouchableWithoutFeedback onPress={() => navigation.goBack()}>
                        <Ionicons style={{ marginTop: 4 }} name="arrow-back-outline" size={28} color="white" />
                    </TouchableWithoutFeedback>
                    <Text style={{color:'white', marginTop:4, fontSize:20, marginLeft:8}}>Favorited Anime</Text>
                </View>
                <View style={{ paddingTop: 10, paddingBottom: 10, flex: 1, paddingRight: 5, paddingLeft: 5 }}>
                    <FlatList keyboardShouldPersistTaps={"always"} columnWrapperStyle={{ justifyContent: 'space-between' }} ItemSeparatorComponent={item => inBetweenListHor(item, true)} numColumns={2} data={bookMarks} renderItem={item => renderListHorizantal(item, navigation, true)}></FlatList>
                </View>
            </View>
        </View>
        )
}
const genreProducer = ({ item }) => {
    return (
        <View style={{flexDirection:'row'}}>
            <Text style={styles.renderListPopularGenre}>{item}</Text>
        </View>
        )
}

export function renderListPopular({ item }, navigation) {
    var genresList1 = JSON.stringify(item.genres)
    var genresList2 = JSON.parse(genresList1).splice(0, 4)
    return (
        <TouchableWithoutFeedback onPress={() => navigation.navigate('EpAnime', { catLink: item.catLink })}>

    <View style={ styles.renderListPopularView }>
                <Image style={{ borderRadius: 4 }} source={{ uri: item.img, width: 105, height: 145.95 }} />
            <View style={ styles.renderListPopularDetails }>
                <Text style={ styles.renderListPopularHeading }>{item.title}</Text>
                <Text style={ styles.renderListPopularEp }>{item.epNumber}</Text>
                <View>
                    <FlatList ItemSeparatorComponent={inBetweenListHor} style={{ marginTop: 8}} data={genresList2} numColumns={2} keyExtractor={item => item} renderItem={genreProducer} />
                </View>
            </View>
            </View>
        </TouchableWithoutFeedback>
        )
}

export function inBetweenListHor({ item }, double = false) {
    var margB = 0;
    if (double === true) {
        margB = 15;
    }
    return (
        <View style={{marginRight: 15, marginBottom: margB}}></View>
        )
}