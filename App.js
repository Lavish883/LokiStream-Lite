import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { ScrollView, Text, View, FlatList, LogBox, ActivityIndicator, RefreshControl } from 'react-native';
import { styles } from './styles.js';
import { HeaderApp, renderListHorizantal, inBetweenListHor, renderListPopular, SearchApp, WatchAnimeApp, EpAnime, HeartedAnime, getStoredValues } from './otherComponets.js';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const serverLink = "https://takemyassm3u8maker.herokuapp.com/";

function Home({ navigation }) {
    const [EpData, SetData] = useState();
    const [isLoading, SetLoading] = useState(true);
    const [isRefreshing, setRefreshing] = useState(false);
    const [contuineWatching, setContuineWatching] = useState(null);

    async function fetchAnimes() {
        const data = await fetch(serverLink + 'typeAll');
        const data2 = await data.json();
        SetData(data2);
        const contuineWatchingData = await getStoredValues('continueWatching');
        setContuineWatching(contuineWatchingData);
        console.log('contuineWatchingData' , contuineWatchingData);
        SetLoading(false);
        //SetRefreshing(false);
    }
    async function onRefresh() {
        SetLoading(true);
        await fetchAnimes();
        SetLoading(false);
    }
    // Fetch Animes
    useEffect(() => {
        fetchAnimes()
    }, [])
    return (
    <View style={ styles.Android } >
        <View style={styles.container}>
            <StatusBar style="light" />    
                <HeaderApp navigation={ navigation } />
                {isLoading ? <ActivityIndicator color="white" size="large" style={styles.loading} /> :
            <ScrollView vertical={true} refreshControl ={ <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}>
                {contuineWatching === null ? <View></View> : 
                <View>
                    <Text style={styles.titles}>Continue Watching </Text>
                    <FlatList showsHorizontalScrollIndicator={false} horizontal={true} ItemSeparatorComponent={inBetweenListHor} data={contuineWatching} renderItem={item => renderListHorizantal(item, navigation)} keyExtractor={item => item.catLink}></FlatList>
                </View>
                }
                <Text style={styles.titles}>Recent Sub</Text> 
                <FlatList showsHorizontalScrollIndicator={false} horizontal={true} ItemSeparatorComponent={inBetweenListHor} data={EpData[0]} renderItem={item => renderListHorizantal(item, navigation)} keyExtractor={item => item.catLink}></FlatList>
                <Text style={styles.titles}>Recent Dub</Text>    
                <FlatList showsHorizontalScrollIndicator={false} horizontal={true} ItemSeparatorComponent={inBetweenListHor} data={EpData[1]} renderItem={item => renderListHorizantal(item, navigation)} keyExtractor={item => item.catLink}></FlatList>
                <Text style={styles.titles}>Recent Chinese</Text>    
                <FlatList showsHorizontalScrollIndicator={false} horizontal={true} ItemSeparatorComponent={inBetweenListHor} data={EpData[2]} renderItem={item => renderListHorizantal(item, navigation)} keyExtractor={item => item.catLink}></FlatList>
                <Text style={styles.titles}>New Season</Text>
                <FlatList showsHorizontalScrollIndicator={false} horizontal={true} ItemSeparatorComponent={inBetweenListHor} data={EpData[3]} renderItem={item => renderListHorizantal(item, navigation)} keyExtractor={item => item.catLink}></FlatList>
                <Text style={styles.titles}>Movies</Text>
                <FlatList showsHorizontalScrollIndicator={false} horizontal={true} ItemSeparatorComponent={inBetweenListHor} data={EpData[4]} renderItem={item => renderListHorizantal(item, navigation)} keyExtractor={item => item.catLink}></FlatList>
                <Text style={styles.titlesP}>Popular Anime</Text>
                <FlatList showsHorizontalScrollIndicator={false} horizontal={false} data={EpData[5]} renderItem={item => renderListPopular(item, navigation)} keyExtractor={item => item.link}></FlatList>
            </ScrollView>
            }
        </View>
    </View>
  );
}

const Stack = createNativeStackNavigator();

function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="Home" options={{ headerShown: false }} component={Home} />
                <Stack.Screen name="Search" options={{ headerShown: false }} component={SearchApp} />
                <Stack.Screen name="Watch" options={{ headerShown: false }} component={WatchAnimeApp} />
                <Stack.Screen name="EpAnime" options={{ headerShown: false }} component={EpAnime} />
                <Stack.Screen name="Hearted" options={{ headerShown: false }} component={HeartedAnime} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default App;

LogBox.ignoreLogs(['VirtualizedLists should never be nested inside plain ScrollViews with the same orientation - use another VirtualizedList-backed container instead.']);
LogBox.ignoreAllLogs()

