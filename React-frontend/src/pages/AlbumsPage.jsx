import { useState, useEffect } from "react"
import AlbumsCard from "../components/albumsComponents/AlbumsCard"

export default function AlbumsPage() {

    const base_api_url = import.meta.env.VITE_EXPRESS_API_SERVER
    const albums_api_url = base_api_url + '/albums'
    const [albums, setAlbums] = useState([])

    useEffect(() => {

        fetch(albums_api_url)
            .then(res => {
                if (!res.ok) {
                    throw new Error(`HTTP error! Status: ${res.status}`);
                }
                return res.json();
            })
            .then(data => {
                console.log(data);
                setAlbums(data);

            }).catch(err => console.log(err))
    }, [])


    return (

        <AlbumsCard albums={albums} />

    );

}