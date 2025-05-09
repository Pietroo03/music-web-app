import { useState, useEffect } from "react"
import ArtistsCard from "../components/artistsComponents/ArtistsCard"

export default function ArtistsPage() {

    const base_api_url = import.meta.env.VITE_EXPRESS_API_SERVER
    const albums_api_url = base_api_url + '/artists'
    const [artists, setArtists] = useState([])

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
                setArtists(data);

            }).catch(err => console.log(err))
    }, [])


    return (

        <ArtistsCard artists={artists} />

    );

}