// Desc: This file contains the custom hook for fetching images

import { useEffect, useState } from "react";
import { getDefaultImages, searchImages } from "../../../Services/apiServices";

export const useGetImages = (query = "", currPage, setCurrPage) => {

    // images is an array of objects, each object is an image
    const [images, setImages] = useState([]);

    // isLoading is a boolean, true if the images are being fetched
    const [isLoading, setIsLoading] = useState(true);

    // refresh is a boolean, true if the images need to be fetched again
    const [refresh, setRefresh] = useState(false);

    // error is a boolean, true if there was an error fetching the images
    const [error, setError] = useState(false);

    // if the query changes, reset the images and currPage
    useEffect(() => {
        setImages([]);
        setCurrPage(1);
        if (refresh) setRefresh(false);
        else setRefresh(true);
        // eslint-disable-next-line
    }, [query]);

    // if the currPage changes, fetch more images images
    useEffect(() => {
        // set loading to true, fetch images, set loading to false
        setIsLoading(true);
        const fetchData = async () => {
            try {
                let imageData;
                // if the query is empty, get the default images
                if (query === "") {
                    // getDefaultImages returns an array of objects, each object is an image
                    imageData = await getDefaultImages(currPage);
                }
                // else, search for images
                else {
                    // searchImages returns an array of objects, each object is an image
                    imageData = await searchImages(query, currPage);
                }
                // appending the new images to the old images
                setImages([...images, ...imageData]);
                setIsLoading(false);
            } catch (err) {
                setError(true);
            }
        }
        fetchData();
        // eslint-disable-next-line
    }, [refresh, currPage])

    return [images, isLoading, error];
}