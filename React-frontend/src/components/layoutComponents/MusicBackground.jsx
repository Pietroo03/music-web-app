import { useEffect, useState } from "react";
import apiFetch from "../../utils/apiFetch";

// Elementi decorativi: i centri dei vinili usano copertine reali caricate dall'API pubblica.
const records = [
    "record-one",
    "record-two",
    "record-three",
    "record-four",
    "record-five",
    "record-six",
    "record-seven",
    "record-eight",
    "record-nine",
    "record-ten",
];

const notes = ["♪", "♫", "♬", "♪", "♫", "♩", "♪", "♬"];

export default function MusicBackground() {
    const [albumCovers, setAlbumCovers] = useState([]);

    useEffect(() => {
        // Le copertine vengono mescolate una volta; il flag impedisce aggiornamenti dopo lo smontaggio.
        const coversUrl = `${import.meta.env.VITE_EXPRESS_API_SERVER.trim()}/albums/covers`;
        let isCurrent = true;
        apiFetch(coversUrl)
            .then((response) => response.ok ? response.json() : [])
            .then((coverUrls) => {
                if (!isCurrent || !Array.isArray(coverUrls)) return;
                const covers = coverUrls.filter((coverUrl) => typeof coverUrl === "string" && coverUrl.trim());
                for (let index = covers.length - 1; index > 0; index -= 1) {
                    const randomIndex = Math.floor(Math.random() * (index + 1));
                    [covers[index], covers[randomIndex]] = [covers[randomIndex], covers[index]];
                }
                setAlbumCovers(covers);
            })
            .catch(() => {});
        return () => { isCurrent = false; };
    }, []);

    // aria-hidden evita che i lettori di schermo annuncino elementi soltanto decorativi.
    return (
        <div className="music-background" aria-hidden="true">
            <div className="record-field">
                {records.map((recordClass, index) => (
                    <div className={`record ${recordClass}`} key={recordClass}>
                        <span className="record-label">
                            {albumCovers.length > 0 && (
                                <img className="record-art" src={albumCovers[index % albumCovers.length]} alt="" />
                            )}
                        </span>
                    </div>
                ))}
            </div>
            <div className="music-notes">
                {notes.map((note, index) => (
                    <span key={`${note}-${index}`} style={{ "--note-index": index }}>{note}</span>
                ))}
            </div>
        </div>
    );
}
