import { useContext, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import apiFetch from "../../utils/apiFetch";

const profileApiUrl = `${import.meta.env.VITE_EXPRESS_API_SERVER}/auth/profile`;

function PasswordVisibilityIcon({ visible }) {
    return (
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
            {visible ? (
                <>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18M10.6 10.6a2 2 0 002.8 2.8" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.9 5.2A10.8 10.8 0 0112 5c5 0 8.5 4.3 9.5 6-.4.7-1.3 1.9-2.8 3M6.2 6.2C4.3 7.4 3 9.2 2.5 11c1 1.7 4.5 6 9.5 6 1.1 0 2.1-.2 3-.6" />
                </>
            ) : (
                <>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.5 12S6 5 12 5s9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7z" />
                    <circle cx="12" cy="12" r="3" />
                </>
            )}
        </svg>
    );
}

export default function Header() {
    const location = useLocation();
    const navigate = useNavigate();
    const { userRole, setUserRole, loadUserRole } = useContext(AuthContext);
    const [profile, setProfile] = useState(null);
    const [profileError, setProfileError] = useState("");
    const [photoError, setPhotoError] = useState("");
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingUsername, setEditingUsername] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [visiblePasswords, setVisiblePasswords] = useState({ current: false, new: false, confirm: false });
    const [selectedPhoto, setSelectedPhoto] = useState(null);
    const [photoPreview, setPhotoPreview] = useState("");
    const [photoDimensions, setPhotoDimensions] = useState(null);
    const [cropX, setCropX] = useState(50);
    const [cropY, setCropY] = useState(50);
    const [cropZoom, setCropZoom] = useState(1);
    const [profileNotice, setProfileNotice] = useState("");
    const profileMenuRef = useRef(null);
    const photoInputRef = useRef(null);
    const cropImageRef = useRef(null);
    const cropDragRef = useRef(null);
    const cropImageWidthPercent = photoDimensions
        ? (photoDimensions.width / Math.min(photoDimensions.width, photoDimensions.height)) * 100 * cropZoom
        : 100;
    const cropImageHeightPercent = photoDimensions
        ? (photoDimensions.height / Math.min(photoDimensions.width, photoDimensions.height)) * 100 * cropZoom
        : 100;
    const cropImageLeftPercent = (100 - cropImageWidthPercent) * (cropX / 100);
    const cropImageTopPercent = (100 - cropImageHeightPercent) * (cropY / 100);

    useEffect(() => {
        if (!isProfileOpen) setIsEditing(false);
    }, [isProfileOpen]);

    useEffect(() => {
        if (!profileNotice) return undefined;
        const timeoutId = window.setTimeout(() => setProfileNotice(""), 4000);
        return () => window.clearTimeout(timeoutId);
    }, [profileNotice]);

    useEffect(() => {
        if (!userRole) {
            setProfile(null);
            setIsProfileOpen(false);
            return undefined;
        }

        let isCurrent = true;
        apiFetch(profileApiUrl)
            .then(async (response) => {
                const data = await response.json();
                if (!response.ok) throw new Error(data.error || "Impossibile caricare il profilo.");
                if (isCurrent) {
                    setProfile(data);
                    setEditingUsername(data.username);
                    setProfileError("");
                }
            })
            .catch((error) => {
                if (isCurrent) setProfileError(error.message || "Impossibile caricare il profilo.");
            });

        return () => {
            isCurrent = false;
        };
    }, [userRole]);

    useEffect(() => {
        function closeOnOutsideClick(event) {
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
        }

        function closeOnEscape(event) {
            if (event.key === "Escape") setIsProfileOpen(false);
        }

        document.addEventListener("mousedown", closeOnOutsideClick);
        document.addEventListener("keydown", closeOnEscape);
        return () => {
            document.removeEventListener("mousedown", closeOnOutsideClick);
            document.removeEventListener("keydown", closeOnEscape);
        };
    }, []);

    useEffect(() => {
        setIsProfileOpen(false);
    }, [location.pathname]);

    function handleLogout() {
        localStorage.removeItem("token");
        setUserRole(null);
        setIsProfileOpen(false);
        navigate("/");
    }

    function openPhotoPicker() {
        setIsEditing(true);
        window.setTimeout(() => photoInputRef.current?.click(), 0);
    }

    function handlePhotoChange(event) {
        const file = event.target.files?.[0];
        event.target.value = "";
        if (!file) return;

        setPhotoError("");
        setProfileError("");
        setProfileNotice("");
        if (!new Set(["image/png", "image/jpeg"]).has(file.type)) {
            setPhotoError("Scegli un'immagine PNG o JPEG.");
            return;
        }
        if (file.size > 2 * 1024 * 1024) {
            setPhotoError("L'immagine deve pesare al massimo 2 MB.");
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            setSelectedPhoto(file);
            setPhotoPreview(String(reader.result));
            const image = new Image();
            image.onload = () => setPhotoDimensions({ width: image.naturalWidth, height: image.naturalHeight });
            image.src = String(reader.result);
            setCropX(50);
            setCropY(50);
            setCropZoom(1);
        };
        reader.onerror = () => setPhotoError("Impossibile aprire l'immagine selezionata.");
        reader.readAsDataURL(file);
    }

    function handleCropPointerDown(event) {
        const image = cropImageRef.current;
        if (!image?.naturalWidth) return;

        const bounds = event.currentTarget.getBoundingClientRect();
        const scale = photoDimensions
            ? (Math.min(bounds.width, bounds.height) * cropZoom) / Math.min(photoDimensions.width, photoDimensions.height)
            : 1;
        cropDragRef.current = {
            pointerId: event.pointerId,
            startX: event.clientX,
            startY: event.clientY,
            cropX,
            cropY,
            overflowX: Math.max(0, image.naturalWidth * scale - bounds.width),
            overflowY: Math.max(0, image.naturalHeight * scale - bounds.height),
        };
        event.currentTarget.setPointerCapture(event.pointerId);
    }

    function handleCropPointerMove(event) {
        const drag = cropDragRef.current;
        if (!drag || drag.pointerId !== event.pointerId) return;

        if (drag.overflowX > 0) {
            setCropX(Math.max(0, Math.min(100, drag.cropX - ((event.clientX - drag.startX) / drag.overflowX) * 100)));
        }
        if (drag.overflowY > 0) {
            setCropY(Math.max(0, Math.min(100, drag.cropY - ((event.clientY - drag.startY) / drag.overflowY) * 100)));
        }
    }

    function handleCropPointerEnd(event) {
        if (cropDragRef.current?.pointerId !== event.pointerId) return;
        cropDragRef.current = null;
        if (event.currentTarget.hasPointerCapture(event.pointerId)) {
            event.currentTarget.releasePointerCapture(event.pointerId);
        }
    }

    function handleCropKeyDown(event) {
        const step = event.shiftKey ? 5 : 1;
        const adjustments = {
            ArrowLeft: [step, 0],
            ArrowRight: [-step, 0],
            ArrowUp: [0, step],
            ArrowDown: [0, -step],
        };
        const adjustment = adjustments[event.key];
        if (!adjustment) return;
        event.preventDefault();
        setCropX((value) => Math.max(0, Math.min(100, value + adjustment[0])));
        setCropY((value) => Math.max(0, Math.min(100, value + adjustment[1])));
    }

    async function refreshProfile() {
        const response = await apiFetch(profileApiUrl);
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Impossibile aggiornare il profilo.");
        setProfile(data);
        setEditingUsername(data.username);
    }

    async function handleSavePhoto() {
        if (!selectedPhoto || !photoPreview) return;
        setProfileError("");
        setProfileNotice("");
        setIsUploading(true);
        try {
            const image = new Image();
            image.src = photoPreview;
            await image.decode();
        const cropSize = Math.min(image.naturalWidth, image.naturalHeight) / cropZoom;
            const sourceX = (image.naturalWidth - cropSize) * (cropX / 100);
            const sourceY = (image.naturalHeight - cropSize) * (cropY / 100);
            const canvas = document.createElement("canvas");
            canvas.width = 512;
            canvas.height = 512;
            const context = canvas.getContext("2d");
            if (!context) throw new Error("Impossibile preparare il ritaglio dell'immagine.");
            context.drawImage(image, sourceX, sourceY, cropSize, cropSize, 0, 0, 512, 512);
            const croppedBlob = await new Promise((resolve) => canvas.toBlob(resolve, selectedPhoto.type, 0.92));
            if (!croppedBlob) throw new Error("Impossibile creare l'immagine ritagliata.");

            const formData = new FormData();
            formData.append("file", new File([croppedBlob], selectedPhoto.name, { type: selectedPhoto.type }));
            const response = await apiFetch(`${profileApiUrl}/photo`, { method: "POST", body: formData });
            const result = await response.json();
            if (!response.ok) throw new Error(result.error || "Caricamento non riuscito.");
            await refreshProfile();
            setSelectedPhoto(null);
            setPhotoPreview("");
            setProfileNotice(result.message || "Foto profilo aggiornata.");
        } catch (error) {
            setProfileError(error.message || "Impossibile salvare la foto profilo.");
        } finally {
            setIsUploading(false);
        }
    }

    async function handleUsernameSubmit(event) {
        event.preventDefault();
        setProfileError("");
        setProfileNotice("");
        try {
            const response = await apiFetch(`${profileApiUrl}/username`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username: editingUsername }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "Impossibile aggiornare lo username.");
            localStorage.setItem("token", data.token);
            loadUserRole();
            await refreshProfile();
            setProfileNotice(data.message);
        } catch (error) {
            setProfileError(error.message || "Impossibile aggiornare lo username.");
        }
    }

    async function handlePasswordSubmit(event) {
        event.preventDefault();
        setProfileError("");
        setProfileNotice("");
        if (newPassword !== confirmNewPassword) {
            setProfileError("Le nuove password non coincidono.");
            return;
        }
        try {
            const response = await apiFetch(`${profileApiUrl}/password`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ currentPassword, newPassword }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "Impossibile aggiornare la password.");
            localStorage.setItem("token", data.token);
            loadUserRole();
            setCurrentPassword("");
            setNewPassword("");
            setConfirmNewPassword("");
            setProfileNotice(data.message);
        } catch (error) {
            setProfileError(error.message || "Impossibile aggiornare la password.");
        }
    }

    const title = location.pathname.startsWith("/albums")
        ? <Link to="/albums"><h1 className="text-3xl font-bold">Albums &amp; Artists Collection</h1></Link>
        : location.pathname.startsWith("/artists")
            ? <Link to="/artists"><h1 className="text-3xl font-bold">Albums &amp; Artists Collection</h1></Link>
            : location.pathname.startsWith("/genres")
                ? <Link to="/genres"><h1 className="text-3xl font-bold">Albums &amp; Artists Collection</h1></Link>
                : <h1 className="text-3xl font-bold">Albums &amp; Artists Collection</h1>;

    return (
        <header className="sticky left-0 right-0 top-0 z-20 flex items-center justify-between bg-gray-800 p-6 text-white">
            {title}
            <div className="flex items-center gap-3">
                {location.pathname === "/albums" && (
                    <>
                        <Link to="/artists" className="rounded-md bg-blue-500 px-4 py-2 text-lg transition hover:bg-blue-600">Vedi Artisti</Link>
                        {userRole === "ADMIN" && (
                            <>
                                <Link to="/genres" className="ml-2 rounded-md bg-blue-500 px-4 py-2 text-lg transition hover:bg-blue-600">Vedi Generi</Link>
                                <Link to="/albums/create" className="rounded-md bg-green-500 px-4 py-2 text-lg transition hover:bg-green-600">Crea Album</Link>
                            </>
                        )}
                    </>
                )}
                {location.pathname === "/artists" && (
                    <>
                        <Link to="/albums" className="rounded-md bg-blue-500 px-4 py-2 text-lg transition hover:bg-blue-600">Vedi Album</Link>
                        {userRole === "ADMIN" && (
                            <>
                                <Link to="/genres" className="ml-2 rounded-md bg-blue-500 px-4 py-2 text-lg transition hover:bg-blue-600">Vedi Generi</Link>
                                <Link to="/artists/create" className="rounded-md bg-green-500 px-4 py-2 text-lg transition hover:bg-green-600">Crea Artista</Link>
                            </>
                        )}
                    </>
                )}
                {location.pathname === "/genres" && userRole === "ADMIN" && (
                    <>
                        <Link to="/albums" className="rounded-md bg-blue-500 px-4 py-2 text-lg transition hover:bg-blue-600">Vedi Album</Link>
                        <Link to="/artists" className="rounded-md bg-blue-500 px-4 py-2 text-lg transition hover:bg-blue-600">Vedi Artisti</Link>
                        <Link to="/genres/create" className="rounded-md bg-green-500 px-4 py-2 text-lg transition hover:bg-green-600">Crea Genere</Link>
                    </>
                )}

                {userRole && (
                    <div className="relative ml-2" ref={profileMenuRef}>
                        <button
                            type="button"
                            aria-expanded={isProfileOpen}
                            aria-controls="profile-menu"
                            onClick={() => setIsProfileOpen((isOpen) => !isOpen)}
                            className="flex items-center gap-2 rounded-full border border-white/30 bg-white/10 py-1.5 pl-1.5 pr-4 transition hover:bg-white/20"
                        >
                            {profile?.profileImage ? (
                                <img src={profile.profileImage} alt="" className="h-9 w-9 rounded-full object-cover" />
                            ) : (
                                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-500 text-lg font-bold">
                                    {profile?.username?.charAt(0)?.toUpperCase() || "?"}
                                </span>
                            )}
                            <span>Profilo</span>
                        </button>

                        {isProfileOpen && (
                            <section id="profile-menu" aria-label="Il tuo profilo" className="absolute right-0 top-full mt-3 max-h-[calc(100vh-6rem)] w-96 max-w-[calc(100vw-2rem)] overflow-y-auto rounded-2xl border border-gray-200 bg-white p-6 text-center text-gray-900 shadow-xl">
                                <h2 className="mb-4 text-lg font-semibold">Il tuo profilo</h2>
                                <button
                                    type="button"
                                    aria-label="Aggiungi o cambia foto profilo"
                                    onClick={openPhotoPicker}
                                    disabled={isUploading}
                                    className="group relative mx-auto mb-3 block h-24 w-24 overflow-hidden rounded-full bg-gray-200 focus:outline-none focus:ring-4 focus:ring-blue-300"
                                >
                                    {profile?.profileImage ? (
                                        <img src={profile.profileImage} alt="Foto profilo" className="h-full w-full object-cover" />
                                    ) : (
                                        <span className="flex h-full w-full items-center justify-center text-5xl font-light leading-none text-blue-700">
                                            +
                                        </span>
                                    )}
                                </button>
                                <input ref={photoInputRef} type="file" accept="image/png,image/jpeg" onChange={handlePhotoChange} className="hidden" />
                                <p className="break-words text-xl font-bold">{profile?.username || "Caricamento…"}</p>
                                <p className="mt-1 text-sm text-gray-600">
                                    {profile?.createdAt
                                        ? `Iscritto dal ${new Intl.DateTimeFormat("it-IT", { day: "numeric", month: "long", year: "numeric" }).format(new Date(profile.createdAt))}`
                                        : "Data di iscrizione non disponibile"}
                                </p>
                                <button type="button" aria-expanded={isEditing} onClick={() => setIsEditing((open) => !open)} className="mt-3 text-sm font-semibold text-blue-700 hover:underline">
                                    {isEditing ? "Chiudi modifica profilo" : "Modifica profilo"}
                                </button>

                                {isEditing && (
                                    <div className="mt-4 space-y-5 border-t border-gray-200 pt-4 text-left">
                                        <section aria-label="Modifica foto profilo" className="space-y-3">
                                            <h3 className="font-semibold">Foto profilo</h3>
                                            <button type="button" onClick={() => photoInputRef.current?.click()} className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium hover:bg-gray-50">
                                                Scegli immagine PNG o JPEG
                                            </button>
                                            {photoError && <p role="alert" className="text-sm text-red-700">{photoError}</p>}
                                            {photoPreview && (
                                                <>
                                                    <div
                                                        role="group"
                                                        aria-label="Inquadratura della foto profilo"
                                                        tabIndex={0}
                                                        onKeyDown={handleCropKeyDown}
                                                        onPointerDown={handleCropPointerDown}
                                                        onPointerMove={handleCropPointerMove}
                                                        onPointerUp={handleCropPointerEnd}
                                                        onPointerCancel={handleCropPointerEnd}
                                                        className="relative mx-auto h-36 w-36 touch-none cursor-grab overflow-hidden rounded-full border-2 border-gray-200 bg-gray-100 focus:outline-none focus:ring-4 focus:ring-blue-300 active:cursor-grabbing"
                                                    >
                                                        <img
                                                            ref={cropImageRef}
                                                            src={photoPreview}
                                                            alt="Trascina per scegliere l'inquadratura"
                                                            draggable="false"
                                                            className="pointer-events-none absolute max-w-none select-none"
                                                            style={{
                                                                width: `${cropImageWidthPercent}%`,
                                                                height: `${cropImageHeightPercent}%`,
                                                                left: `${cropImageLeftPercent}%`,
                                                                top: `${cropImageTopPercent}%`,
                                                            }}
                                                        />
                                                    </div>
                                                    <p className="text-center text-xs text-gray-600">Trascina l’immagine nel cerchio per scegliere il ritaglio. Usa le frecce della tastiera per spostarla con precisione.</p>
                                                    <label className="block text-sm text-gray-700">
                                                        Zoom: {cropZoom.toFixed(1)}×
                                                        <input
                                                            type="range"
                                                            min="1"
                                                            max="3"
                                                            step="0.05"
                                                            value={cropZoom}
                                                            onChange={(event) => setCropZoom(Number(event.target.value))}
                                                            aria-label="Ingrandimento della foto profilo"
                                                            className="mt-1 block w-full accent-blue-600"
                                                        />
                                                    </label>
                                                    <button type="button" onClick={handleSavePhoto} disabled={isUploading} className="w-full rounded-lg bg-blue-600 px-3 py-2 font-semibold text-white hover:bg-blue-700 disabled:opacity-60">
                                                        {isUploading ? "Salvataggio…" : "Salva immagine"}
                                                    </button>
                                                </>
                                            )}
                                        </section>

                                        <form onSubmit={handleUsernameSubmit} className="space-y-2 border-t border-gray-200 pt-4">
                                            <h3 className="font-semibold">Username</h3>
                                            <label className="sr-only" htmlFor="profile-username">Nuovo username</label>
                                            <input id="profile-username" type="text" required maxLength={50} value={editingUsername}
                                                onChange={(event) => setEditingUsername(event.target.value)}
                                                className="w-full rounded-lg border border-gray-300 px-3 py-2" />
                                            <button className="w-full rounded-lg bg-blue-600 px-3 py-2 font-semibold text-white hover:bg-blue-700">Salva username</button>
                                        </form>

                        <form onSubmit={handlePasswordSubmit} className="space-y-2 border-t border-gray-200 pt-4">
                            <h3 className="font-semibold">Reimposta password</h3>
                            <label className="sr-only" htmlFor="current-profile-password">Password attuale</label>
                            <div className="relative">
                                <input id="current-profile-password" type={visiblePasswords.current ? "text" : "password"} autoComplete="current-password" required placeholder="Password attuale" value={currentPassword}
                                    onChange={(event) => setCurrentPassword(event.target.value)}
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 pr-11" />
                                <button type="button" onClick={() => setVisiblePasswords((visible) => ({ ...visible, current: !visible.current }))} aria-label={visiblePasswords.current ? "Nascondi password attuale" : "Mostra password attuale"} aria-pressed={visiblePasswords.current} className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-gray-500 hover:text-gray-800">
                                    <PasswordVisibilityIcon visible={visiblePasswords.current} />
                                </button>
                            </div>
                            <label className="sr-only" htmlFor="new-profile-password">Nuova password</label>
                            <div className="relative">
                                <input id="new-profile-password" type={visiblePasswords.new ? "text" : "password"} autoComplete="new-password" required minLength={6} maxLength={72} placeholder="Nuova password" value={newPassword}
                                    onChange={(event) => setNewPassword(event.target.value)}
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 pr-11" />
                                <button type="button" onClick={() => setVisiblePasswords((visible) => ({ ...visible, new: !visible.new }))} aria-label={visiblePasswords.new ? "Nascondi nuova password" : "Mostra nuova password"} aria-pressed={visiblePasswords.new} className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-gray-500 hover:text-gray-800">
                                    <PasswordVisibilityIcon visible={visiblePasswords.new} />
                                </button>
                            </div>
                            <label className="sr-only" htmlFor="confirm-profile-password">Conferma nuova password</label>
                            <div className="relative">
                                <input id="confirm-profile-password" type={visiblePasswords.confirm ? "text" : "password"} autoComplete="new-password" required minLength={6} maxLength={72} placeholder="Conferma nuova password" value={confirmNewPassword}
                                    onChange={(event) => setConfirmNewPassword(event.target.value)}
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 pr-11" />
                                <button type="button" onClick={() => setVisiblePasswords((visible) => ({ ...visible, confirm: !visible.confirm }))} aria-label={visiblePasswords.confirm ? "Nascondi conferma password" : "Mostra conferma password"} aria-pressed={visiblePasswords.confirm} className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-gray-500 hover:text-gray-800">
                                    <PasswordVisibilityIcon visible={visiblePasswords.confirm} />
                                </button>
                            </div>
                                            <button className="w-full rounded-lg bg-blue-600 px-3 py-2 font-semibold text-white hover:bg-blue-700">Aggiorna password</button>
                                        </form>
                                    </div>
                                )}

                                {isUploading && <p role="status" className="mt-2 text-sm text-blue-700">Caricamento foto…</p>}
                                {profileNotice && <p role="status" className="mt-2 text-sm text-green-700">{profileNotice}</p>}
                                {profileError && <p role="alert" className="mt-2 text-sm text-red-700">{profileError}</p>}
                                <div className="mt-5 grid grid-cols-2 gap-2 border-t border-gray-200 pt-4">
                                    <button type="button" onClick={handleLogout} className="rounded-lg bg-gray-700 px-3 py-2 font-semibold text-white transition hover:bg-gray-800">Logout</button>
                                    <Link to="/account/delete" onClick={() => setIsProfileOpen(false)} className="rounded-lg bg-red-700 px-3 py-2 font-semibold text-white transition hover:bg-red-800">Elimina account</Link>
                                </div>
                            </section>
                        )}
                    </div>
                )}
            </div>
        </header>
    );
}
