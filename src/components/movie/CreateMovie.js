import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {DEFAULT_POSTER, IMAGE_URL} from "../../constants/constants";
import * as PropTypes from "prop-types";
import {useEffect, useState} from "react";
import crewService from "../../services/crew-service";

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

    const [casts, setCasts] = useState([{ characterName: '', actorName: '', isMain: false }]);

    const handleAddCast = () => {
        setCasts([...casts, { characterName: '', actorName: '', isMain: false }]);
    };

    const handleInputChange = (index, field, value) => {
        const newCasts = [...casts];
        newCasts[index][field] = value;
        setCasts(newCasts);
    };

    const [crewPositions, setCrewPositions] = useState([]);
    const fetchCrewPositions = async () => {
        const res = await crewService.getCrewsPositions();
        setCrewPositions(res);
    }
    useEffect(() => {
        fetchCrewPositions();
    }, []);

    const [crewMembers, setCrewMembers] = useState([{ name: '', positionId: '' }]);

    const handleAddCrewMember = () => {
        setCrewMembers([...crewMembers, { name: '', positionId: '' }]);
    };

    const handleCrewChange = (index, field, value) => {
        const newCrewMembers = [...crewMembers];
        newCrewMembers[index][field] = value;
        setCrewMembers(newCrewMembers);
    };


    return (
        <div className={'container-xxl flex-grow-1 container-p-y'}>
            <div className="card">
                <div className="card-body p-4">
                    <h3 className={'text-primary mb-0'}>Create new movie</h3>
                </div>
            </div>
            <br/>
            <form action="" encType='multipart/form-data'>
                <div className="row">
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
                                    />
                                </div>
                                <div className={'mb-3'}>
                                    <label htmlFor="originalTitleInput" className="form-label">Original title</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="originalTitleInput"
                                        placeholder="Movie original title"
                                    />
                                </div>
                                <div className={'row'}>
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="releaseDateInput" className="form-label">Release date</label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            id="releaseDateInput"
                                        />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="durationInput" className="form-label">Duration</label>
                                        <div className="input-group input-group-merge">
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Duration"
                                            />
                                            <span className="input-group-text">minutes</span>
                                        </div>
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="countryInput" className="form-label">Origin country</label>
                                        <select className="form-select" id="countryInput">
                                            <option selected>Select a country</option>
                                            <option value="1">Vietnam</option>
                                            <option value="2">China</option>
                                            <option value="3">United States</option>
                                        </select>
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="studioInput" className="form-label">By studio</label>
                                        <select className="form-select" id="studioInput">
                                            <option selected>Select a studio</option>
                                            <option value="1">Warner Bros.</option>
                                            <option value="2">Universal Pictures</option>
                                            <option value="3">Walt Disney Studios</option>
                                        </select>
                                    </div>
                                </div>
                                <div className={'mb-3'}>
                                    <label htmlFor="stoylineInput" className="form-label">Storyline</label>
                                    <textarea className="form-control"
                                              id="stoylineInput"
                                              rows="5">
                                    </textarea>
                                </div>
                            </div>
                        </div>
                        <br/>
                        <div className="card">
                            <div className="card-header pb-0">
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
                    <div className="col-md-4">
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
                                        value={trailerLink}
                                        onChange={handleChangeTrailer}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default CreateMovie;
