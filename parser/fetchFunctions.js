import { test } from './parser/parseFunctions.js';

export async function watchLink(link) {
    test()
    console.log(link);
    const urlData = await fetch(link);
    const urlDataResponse = await urlData.text();
    const iframeSrc = urlDataResponse.split('class="play-video"')[1].split(`<iframe src="`)[1].split(`" allow`)[0];
    const videoId = iframeSrc.split('?id=')[1].split('&title=')[0];
    const videoLink = process.env.animeLink + Buffer.from(videoId + "LTXs3GrU8we9O" + Buffer.from(videoId).toString('base64')).toString('base64');

}