// Desc: This file contains the api services for the application

import axios from "axios";
import config from "../config.json";

// config.json contains the api key and the flickr api url
const { flickrApiUrl, api_key } = config;
console.log(flickrApiUrl, api_key);

// getImageObject returns an object with the image url and title
const getImageObject = (image) => {
    return {
        img: `https://farm${image.farm}.staticflickr.com/${image.server}/${image.id}_${image.secret}.jpg`,
        title: image.title
    }
}

// searchImages is used to call the seach api
export const searchImages = async (searchTerm, page = 0) => {
    const res = await axios.get(flickrApiUrl, {
        params: {
            method: 'flickr.photos.search',
            api_key: api_key,
            text: searchTerm,
            per_page: 9,
            page: page,
            format: 'json',
            nojsoncallback: 1,
            safe_search: 1
        }
    })
    const imageData = res.data.photos.photo.map((image) => {
        return getImageObject(image);
    })
    return imageData;
}

// getDefaultImages is used to call the getRecent api
export const getDefaultImages = async (page = 0) => {
    const res = await axios.get(flickrApiUrl, {
        params: {
            method: 'flickr.photos.getRecent',
            api_key: api_key,
            per_page: 9,
            page: page,
            format: 'json',
            nojsoncallback: 1,
            safety_level: 1
        }
    })
    const imageData = res.data.photos.photo.map((image) => {
        return getImageObject(image);
    })
    return imageData;
}