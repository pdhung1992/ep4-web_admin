import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {DEFAULT_POSTER, IMAGE_URL, MOVIES_LIST} from "../../constants/constants";
import {useEffect, useRef, useState} from "react";
import crewService from "../../services/crew-service";
import packageService from "../../services/package-services";
import languageServices from "../../services/language-services";
import genreServices from "../../services/genre-services";
import Select from "react-select";
import makeAnimated from 'react-select/animated';
import countryServices from "../../services/country-services";
import studioServices from "../../services/studio-services";
import classificationServices from "../../services/classification-services";
import videoModeServices from "../../services/video-mode-services";
import movieServices from "../../services/movie-services";

const CreateMovie = () => {
    const admin = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const imgUrl = IMAGE_URL;

    const token = admin.adminData.token;
    const axiosConfig = {
        headers: {
            Authorization: "Bearer " + token,
        },
        credentials: "true"
    }

    const animatedComponents = makeAnimated();

    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const closeToast = useRef(null);
    const [toastType, setToastType] = useState('');
    useEffect(() => {
        if (showToast) {
            const timer = setTimeout(() => {
                if (closeToast.current) {
                    closeToast.current.click();
                }
                setShowToast(false);
                setToastType('');
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [showToast]);

    const defaultPoster = DEFAULT_POSTER;
    const [selectedPoster, setSelectedPoster] = useState(null);
    const [previewPoster, setPreviewPoster] = useState(defaultPoster);

    const handlePosterChange = (e) => {
        const file = e.target.files[0];
        if (file){
            setSelectedPoster(file);
            setPreviewPoster(URL.createObjectURL(file));
        } else {
            setSelectedPoster(null);
            setPreviewPoster(defaultPoster);
        }
    };

    const [trailerLink, setTrailerLink] = useState('');
    const [trailerId, setTrailerId] = useState(null);

    useEffect(() => {
        const extractTrailerId = (url) => {
            const urlObj = new URL(url);
            return urlObj.searchParams.get('v');
        };

        if (trailerLink) {
            const id = extractTrailerId(trailerLink);
            setTrailerId(id);
        } else {
            setTrailerId(null);
        }
    }, [trailerLink]);

    const handleChangeTrailer = (e) => {
        setTrailerLink(e.target.value);
    };

    const [previewEpisodes, setPreviewEpisodes] = useState([]);
    const episodeRefs = useRef([]);
    const [thumbnails, setThumbnails] = useState([]);

    const handleEpisodeChange = (e, index) => {
        const file = e.target.files[0];
        if (file) {
            const url = URL.createObjectURL(file);
            const video = episodeRefs.current[index];

            video.src = url;
            video.load();

            video.onloadeddata = () => {
                video.currentTime = 1;
            };

            video.onseeked = () => {
                const canvas = document.createElement("canvas");
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                const ctx = canvas.getContext("2d");
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

                const imageUrl = canvas.toDataURL("image/png");

                const byteString = atob(imageUrl.split(',')[1]); // Lấy phần dữ liệu base64
                const mimeString = imageUrl.split(',')[0].split(':')[1].split(';')[0]; // Tách loại MIME

                const arrayBuffer = new Uint8Array(byteString.length);
                for (let i = 0; i < byteString.length; i++) {
                    arrayBuffer[i] = byteString.charCodeAt(i);
                }

                const blob = new Blob([arrayBuffer], { type: mimeString });

                const thumbnailFile = new File([blob], `${file.name}_thumbnail.png`, { type: "image/png" });

                thumbnails[index] = thumbnailFile;
                setThumbnails([...thumbnails]);

                setPreviewEpisodes((prev) => {
                    const newPreviews = [...prev];
                    newPreviews[index] = imageUrl;
                    return newPreviews;
                });

                URL.revokeObjectURL(url);
            };
        }
    };

    const [crewPositions, setCrewPositions] = useState([]);
    const fetchCrewPositions = async () => {
        const res = await crewService.getCrewsPositions();
        setCrewPositions(res);
    }

    const [packageList, setPackageList] = useState([]);
    const fetchPackages = async () => {
        const res = await packageService.getPackageSelect();
        setPackageList(res);
    }

    const [languages, setLanguages] = useState([]);
    const fetchLanguages = async () => {
        const res = await languageServices.getLanguages();
        setLanguages(res);
    }

    const [genres, setGenres] = useState([]);
    const fetchGenres = async () => {
        const res = await genreServices.getGenres();
        setGenres(res);
    }

    const [countries, setCountries] = useState([]);
    const fetchCountries = async () => {
        const res = await countryServices.getCountries();
        setCountries(res);
    }

    const [studios, setStudios] = useState([]);
    const fetchStudios = async () => {
        const res = await studioServices.getStudiosSelect();
        setStudios(res);
    }

    const [classifications, setClassifications] = useState([]);
    const fetchClassifications = async () => {
        const res = await classificationServices.getClassificationSelect();
        setClassifications(res);
    }

    const [videoModes, setVideoModes] = useState([]);
    const fetchVideoModes = async () => {
        const res = await videoModeServices.getVideoModes();
        setVideoModes(res);
    }

    useEffect(() => {
        fetchCrewPositions();
        fetchPackages();
        fetchLanguages();
        fetchGenres();
        fetchCountries();
        fetchStudios();
        fetchClassifications();
        fetchVideoModes();
    }, []);

    const [casts, setCasts] = useState([{ characterName: '', actorName: '', isMain: false }]);

    const handleAddCast = () => {
        setCasts([...casts, { characterName: '', actorName: '', isMain: false }]);
    };

    const handleInputChange = (index, field, value) => {
        const newCasts = [...casts];
        newCasts[index][field] = value;
        setCasts(newCasts);
    };

    const [crewMembers, setCrewMembers] = useState([{ name: '', positionId: '' }]);

    const handleAddCrewMember = () => {
        setCrewMembers([...crewMembers, { name: '', positionId: '' }]);
    };

    const handleCrewChange = (index, field, value) => {
        const newCrewMembers = [...crewMembers];
        newCrewMembers[index][field] = value;
        setCrewMembers(newCrewMembers);
    };

    const [canRent, setCanRent] = useState(true);

    const genresOptions = genres.map((genre) => ({
        value: genre.id,
        label: genre.name
    }));
    const [selectedGenres, setSelectedGenres] = useState([]);
    const handleGenreChange = (selectedGenre) => {
        setSelectedGenres(selectedGenre);
    }

    const languageOptions = languages.map((language) => ({
        value: language.id,
        label: language.name
    }));
    const [selectedLanguages, setSelectedLanguages] = useState([]);
    const handleLanguageChange = (selectedLanguages) => {
        setSelectedLanguages(selectedLanguages);
    }

    const [episodeQty, setEpisodeQty] = useState(0);
    const onChangeEpisodeQty = (e) => {
        setEpisodeQty(e.target.value);
    }

    const [isShow, setIsShow] = useState(true);
    const [isShowAtHome, setIsShowAtHome] = useState(false);

    const initMovie = {
        title: '',
        originalTitle: '',
        slug: '',
        price: '',
        packageId: '',
        storyline: '',
        trailer: '',
        duration: '',
        releaseYear: '',
        countryId: '',
        studioId: '',
        videoModeId: '',
        classificationId: '',
        isShow: false,
        isShowAtHome: false
    }

    const [newMovie, setNewMovie] = useState(initMovie);

    const onChangeMovie = (e) => {
        const {name, value} = e.target;
        setNewMovie(prevState => ({
            ...prevState,
            [name]: value
        }));
    }

    const handleCreateMovie = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', newMovie.title);
        formData.append('originalTitle', newMovie.originalTitle);
        formData.append('slug', newMovie.slug);
        formData.append('canRent', canRent);
        formData.append('price', newMovie.price);
        formData.append('packageId', newMovie.packageId);
        formData.append('storyline', newMovie.storyline);
        if (selectedPoster !== null) {
            formData.append('poster', selectedPoster);
        }
        formData.append('trailer', trailerLink);
        formData.append('duration', newMovie.duration);
        formData.append('releaseYear', newMovie.releaseYear);
        formData.append('countryId', newMovie.countryId);
        formData.append('studioId', newMovie.studioId);
        formData.append('videoModeId', newMovie.videoModeId);
        formData.append('classificationId', newMovie.classificationId);
        formData.append('isShow', isShow);
        formData.append('isShowAtHome', isShowAtHome);

        const genreIds = selectedGenres.map((genre) => genre.value);
        formData.append('genreIds', JSON.stringify(genreIds));

        const languageIds = selectedLanguages.map((language) => language.value);
        formData.append('languageIds', JSON.stringify(languageIds));

        if (episodeQty > 0) {
            for (let i = 0; i < episodeQty; i++) {
                const file = e.target[`file${i}`].files[0];
                const thumbnail = thumbnails[i];

                if (file) {
                    formData.append('movieFiles', file);
                    formData.append('thumbnails', thumbnail);
                }
            }
        }

        const castsData = casts.map((cast) => ({
            'characterName': cast.characterName,
            'actorName': cast.actorName,
            'isMain': cast.isMain
        }));
        formData.append('casts', JSON.stringify(castsData));

        const crewData = crewMembers.map((crew) => ({
            'name': crew.name,
            'crewPositionId': crew.positionId
        }));
        formData.append('crewMembers', JSON.stringify(crewData));

        const data = await movieServices.createMovie(formData, axiosConfig);
        if (data && data.responseCode === 201){
            setToastType('success');
            setToastMessage(data.responseMessage);
            setShowToast(true);
            setNewMovie(initMovie);
            setCanRent(true);
            setSelectedPoster(null);
            setPreviewPoster(defaultPoster);
            setTrailerLink('');
            setTrailerId(null);
            setPreviewEpisodes([]);
            episodeRefs.current = [];
            setThumbnails([]);
            setCasts([{ characterName: '', actorName: '', isMain: false }]);
            setCrewMembers([{ name: '', positionId: '' }]);
            setSelectedGenres([]);
            setSelectedLanguages([]);
            setEpisodeQty(0);
            setIsShow(true);
            setIsShowAtHome(false);
            navigate(MOVIES_LIST);
        }else {
            setToastType('danger');
            setToastMessage(data.responseMessage);
            setShowToast(true);
        }
    }

    return (
        <div className={'container-xxl flex-grow-1 container-p-y'}>
            <div className="card">
                <div className="card-body p-4">
                    <h3 className={'text-primary mb-0'}>Create new movie</h3>
                </div>
            </div>
            <br/>
            <form onSubmit={handleCreateMovie} encType='multipart/form-data'>
                <div className="row">
                    {/*Large content area*/}
                    <div className="col-md-8">
                        <div className="card">
                            <div className="card-header pb-0">
                                <h5>General information</h5>
                            </div>
                            <div className="card-body">
                                <div className={'mb-3'}>
                                    <label htmlFor="titleInput" className="form-label">Title</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="titleInput"
                                        placeholder="Movie title"
                                        name={'title'}
                                        value={newMovie.title}
                                        onChange={onChangeMovie}
                                    />
                                </div>
                                <div className={'mb-3'}>
                                    <label htmlFor="originalTitleInput" className="form-label">Original title</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="originalTitleInput"
                                        placeholder="Movie original title"
                                        name={'originalTitle'}
                                        value={newMovie.originalTitle}
                                        onChange={onChangeMovie}
                                    />
                                </div>
                                <div className="row">
                                    <div className="col-md-4 mb-3">
                                        <label htmlFor="releaseYearInput" className="form-label">Release year</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            id="releaseYearInput"
                                            placeholder={'Release year'}
                                            name={'releaseYear'}
                                            value={newMovie.releaseYear}
                                            onChange={onChangeMovie}
                                        />
                                    </div>
                                    <div className="col-md-4 mb-3">
                                        <label htmlFor="durationInput" className="form-label">Duration</label>
                                        <div className="input-group input-group-merge">
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Duration"
                                                name={'duration'}
                                                value={newMovie.duration}
                                                onChange={onChangeMovie}
                                            />
                                            <span className="input-group-text">minutes</span>
                                        </div>
                                    </div>
                                    <div className="col-md-4 mb-3">
                                        <label htmlFor="slugInput" className="form-label">Slug</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="slugInput"
                                            placeholder="Slug"
                                            name={'slug'}
                                            value={newMovie.slug}
                                            onChange={onChangeMovie}
                                        />
                                    </div>
                                </div>
                                <div className={'row'}>
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="countryIdInput" className="form-label">Origin country</label>
                                        <select
                                            className="form-select"
                                            id={'countryIdInput'}
                                            name={'countryId'}
                                            value={newMovie.countryId}
                                            onChange={onChangeMovie}
                                        >
                                            <option value="">Select a country</option>
                                            {Array.isArray(countries) && countries.map((country) => (
                                                <option key={country.id}
                                                        value={country.id}>{country.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="studioIdInput" className="form-label">By studio</label>
                                        <select
                                            className="form-select"
                                            id={'studioIdInput'}
                                            name={'studioId'}
                                            value={newMovie.studioId}
                                            onChange={onChangeMovie}
                                        >
                                            <option value="">Select a studio</option>
                                            {Array.isArray(studios) && studios.map((stu) => (
                                                <option key={stu.id}
                                                        value={stu.id}>{stu.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="classificationIdInput"
                                               className="form-label">Classification</label>
                                        <select
                                            className="form-select"
                                            id={'classificationIdInput'}
                                            name={'classificationId'}
                                            value={newMovie.classificationId}
                                            onChange={onChangeMovie}
                                        >
                                            <option value="">Select a Classification</option>
                                            {Array.isArray(classifications) && classifications.map((cls) => (
                                                <option key={cls.id}
                                                        value={cls.id}>[{cls.code}] {cls.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="videoModeInput" className="form-label">Video Quality</label>
                                        <select
                                            className="form-select"
                                            id={'countryIdInput'}
                                            name={'videoModeId'}
                                            value={newMovie.videoModeId}
                                            onChange={onChangeMovie}
                                        >
                                            <option value="">Select a video quality</option>
                                            {Array.isArray(videoModes) && videoModes.map((mode) => (
                                                <option key={mode.id}
                                                        value={mode.id}>{mode.name} [{mode.code}]</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="genresInput" className="form-label">Genres</label>
                                    <Select options={genresOptions}
                                            isMulti={true}
                                            components={animatedComponents}
                                            value={selectedGenres}
                                            onChange={handleGenreChange}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="languagesInput" className="form-label">Language</label>
                                    <Select options={languageOptions}
                                            isMulti={true}
                                            components={animatedComponents}
                                            value={selectedLanguages}
                                            onChange={handleLanguageChange}
                                    />
                                </div>
                                <div className={'mb-3'}>
                                    <label htmlFor="stoylineInput" className="form-label">Storyline</label>
                                    <textarea className="form-control"
                                              id="stoylineInput"
                                              rows="5"
                                                name={'storyline'}
                                                value={newMovie.storyline}
                                                onChange={onChangeMovie}
                                    >
                                    </textarea>
                                </div>
                            </div>
                        </div>
                        <br/>
                        <div className="card">
                            <div className="card-header pb-1">
                                <h5>Movie's content</h5>
                            </div>
                            <div className="card-body">
                                <div className="mb-3 row">
                                    <label htmlFor="html5-text-input" className="col-md-4 col-form-label">Number of episode</label>
                                    <div className="col-md-4">
                                        <div className="input-group input-group-merge">
                                            <input
                                                id="episodeQty"
                                                type="number"
                                                className="form-control"
                                                placeholder="Number of episode"
                                                onChange={onChangeEpisodeQty}
                                            />
                                            <span className="input-group-text">episodes</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="mb-3 row">
                                    {episodeQty > 0 ? (
                                        <div className={'mb-3'}>
                                            <label>Input file(s) for movie's episode(s):</label>
                                        </div>
                                    ) : null}
                                    {episodeQty > 0 ? (
                                        Array.from({ length: episodeQty }).map((_, index) => (
                                            <div className="col-md-6" key={index}>
                                                <div className="mb-3 row">
                                                    <label htmlFor={`episodeTitleInput${index}`}
                                                           className="col-md-4 col-form-label">Episode {index + 1}</label>
                                                    <div className="col-md-8">
                                                        <input
                                                            type="file"
                                                            accept="video/*"
                                                            className="form-control mb-3"
                                                            name={`file${index}`}
                                                            onChange={(e) => handleEpisodeChange(e, index)}
                                                        />
                                                        <video
                                                            ref={(el) => (episodeRefs.current[index] = el)}
                                                            style={{display: "none"}}
                                                        ></video>
                                                        <div>
                                                            {previewEpisodes[index] && (
                                                                <img
                                                                    src={previewEpisodes[index]}
                                                                    alt={`Episode ${index + 1} preview`}
                                                                    style={{width: "100%", height: "auto"}}
                                                                />
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : null}
                                </div>
                            </div>
                        </div>
                        <br/>
                        <div className="card">
                            <div className="card-header pb-1">
                                <h5>Casts and Crew</h5>
                            </div>
                            <div className="card-body">
                                <label htmlFor="castInput" className="form-label">Casts</label>
                                {casts.map((cast, index) => (
                                    <div className="row mb-3" key={index}>
                                        <div className="col-md-5">
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Character Name"
                                                value={cast.characterName}
                                                onChange={(e) => handleInputChange(index, 'characterName', e.target.value)}
                                            />
                                        </div>
                                        <div className="col-md-5">
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Actor Name"
                                                value={cast.actorName}
                                                onChange={(e) => handleInputChange(index, 'actorName', e.target.value)}
                                            />
                                        </div>
                                        <div className={'col-md-2'}>
                                            <div className={'d-flex align-items-center'}>
                                                <div className="form-check me-2">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        checked={cast.isMain}
                                                        onChange={(e) => handleInputChange(index, 'isMain', e.target.checked)}
                                                    />
                                                    <label className="form-check-label">Main</label>
                                                </div>
                                                {index === casts.length - 1 && (
                                                    <button
                                                        type="button"
                                                        className="btn btn-icon btn-primary"
                                                        onClick={handleAddCast}
                                                    >
                                                        <span className="tf-icons bx bx-plus"></span>
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <label htmlFor="crewInput" className="form-label">Crew</label>
                                <div id="crewInput">
                                    {crewMembers.map((crew, index) => (
                                        <div className="row d-flex mb-3" key={index}>
                                            <div className="col-md-5">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Member name"
                                                    value={crew.name}
                                                    onChange={(e) => handleCrewChange(index, 'name', e.target.value)}
                                                />
                                            </div>
                                            <div className="col-md-5">
                                                <select
                                                    className="form-select"
                                                    value={crew.positionId}
                                                    onChange={(e) => handleCrewChange(index, 'positionId', e.target.value)}
                                                >
                                                    <option value="">Select a position</option>
                                                    {Array.isArray(crewPositions) && crewPositions.map((position, posIndex) => (
                                                        <option key={posIndex}
                                                                value={position.id}>{position.name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            {index === crewMembers.length - 1 && (
                                                <div className="col-md-2">
                                                    <div className="text-center">
                                                        <button
                                                            type="button"
                                                            className="btn btn-icon btn-primary"
                                                            onClick={handleAddCrewMember}
                                                        >
                                                            <span className="tf-icons bx bx-plus"></span>
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    {/*Small content area*/}
                    <div className="col-md-4">
                        <div className="card">
                            <div className="card-header pb-0">
                                <h5>Pricing</h5>
                            </div>
                            <div className="card-body pb-0">
                                <div className={'mb-3'}>
                                    <label htmlFor="packageIdInput" className="form-label">Package</label>
                                    <select
                                        className="form-select"
                                        id={'packageIdInput'}
                                        name={'packageId'}
                                        value={newMovie.packageId}
                                        onChange={onChangeMovie}
                                    >
                                        <option value="">Select a package</option>
                                        {Array.isArray(packageList) && packageList.map((pkg) => (
                                            <option key={pkg.id}
                                                    value={pkg.id}>{pkg.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className={'mb-3'}>
                                    <div className="row align-items-center">
                                        <div className="col-md-3">
                                            <label htmlFor="canRentCheck" className="form-label">Can rent</label>
                                            <div className="form-check d-flex justify-content-center">
                                                <input
                                                    name="cantRent"
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    id="canRentCheck"
                                                    checked={canRent}
                                                    onChange={(e) => setCanRent(e.target.checked)}
                                                />
                                            </div>
                                        </div>
                                        {canRent ? (
                                            <div className="col-md-9">
                                                {/*<label htmlFor="priceInput" className="form-label">Price</label>*/}
                                                <div className="input-group input-group-merge">
                                                    <span className="input-group-text">$</span>
                                                    <input
                                                        type="number"
                                                        className="form-control"
                                                        placeholder="Price"
                                                        name={'price'}
                                                        value={newMovie.price}
                                                        onChange={onChangeMovie}
                                                    />
                                                </div>
                                            </div>
                                        ) : ([])}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <br/>
                        <div className="card">
                            <div className="card-header pb-0">
                                <h5>Upload movie's poster</h5>
                            </div>
                            <div className="card-body">
                                <img src={previewPoster} height={'auto'} alt=""
                                     className={'img-fluid mb-3'}/>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handlePosterChange}
                                    className="form-control"
                                />
                            </div>
                        </div>
                        <br/>
                        <div className="card">
                            <div className="card-header pb-0">
                                <h5>Movie's trailer</h5>
                            </div>
                            {trailerId && (
                                <div className="card-body ms-1 pb-0">
                                    <div className="video-preview" style={{position: 'relative', paddingTop: '56.25%'}}>
                                        <iframe
                                            style={{
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                width: '100%',
                                                height: '100%'
                                            }}
                                            src={`https://www.youtube.com/embed/${trailerId}`}
                                            title="YouTube video player"
                                            frameBorder="0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        ></iframe>
                                    </div>
                                </div>
                            )}
                            <div className="card-body">
                                <div className={'mb-3'}>
                                    <label htmlFor="trailerInput" className="form-label">Trailer link</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="trailerInput"
                                        placeholder="Movie's trailer"
                                        name={'trailer'}
                                        value={trailerLink}
                                        onChange={handleChangeTrailer}
                                    />
                                </div>
                            </div>
                        </div>
                        <br/>
                        <div className="card">
                            <div className="card-header pb-0">
                                <h5>Actions</h5>
                            </div>
                            <div className="card-body">
                                <div className="row mb-3">
                                    <div className="col-md-9">
                                        <label htmlFor="canRentCheck" className="form-label">Showing</label>
                                    </div>
                                    <div className="col-md-3">
                                        <input
                                            name="cantRent"
                                            className="form-check-input"
                                            type="checkbox"
                                            checked={isShow}
                                            id="canRentCheck"
                                            onChange={(e) => setIsShow(e.target.checked)}
                                        />
                                    </div>
                                </div>
                                <div className="row -mb-3">
                                    <div className="col-md-9">
                                        <label htmlFor="canRentCheck" className="form-label">Show on Home page</label>
                                    </div>
                                    <div className="col-md-3">
                                        <input
                                            name="cantRent"
                                            className="form-check-input"
                                            type="checkbox"
                                            checked={isShowAtHome}
                                            id="canRentCheck"
                                            onChange={(e) => setIsShowAtHome(e.target.checked)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <br/>
                <div className="card">
                    <div className="card-body">
                        <div className="d-flex justify-content-center">
                            <button type="submit"
                                    className="btn btn-success"
                            >
                                <span className="tf-icons bx bx-plus"></span>&nbsp; Create
                            </button>
                            <button type="button" className="btn btn-secondary ms-3" data-bs-dismiss="modal">
                                <span className="tf-icons bx bx-x"></span>&nbsp; Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </form>

            {/*Alert toast*/}
            <div
                className={`bs-toast toast toast-placement-ex m-3 fade bg-${toastType} top-0 end-0 ${showToast ? 'show' : ''}`}
                role="alert"
                aria-live="assertive"
                aria-atomic="true"
                data-bs-delay="3000"
            >
                <div className="toast-header">
                    <i className="bx bx-bell me-2"></i>
                    <div className="me-auto fw-semibold">Alert</div>
                    <button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close"
                            ref={closeToast}></button>
                </div>
                <div className="toast-body">
                    {toastMessage}
                </div>
            </div>
        </div>
    )
}

export default CreateMovie;
