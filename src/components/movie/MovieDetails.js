import {useLocation, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import movieServices from "../../services/movie-services";
import {useDispatch, useSelector} from "react-redux";
import {IMAGE_URL} from "../../constants/constants";


const MovieDetails = () => {
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

    const location = useLocation();
    const { movieId } = location.state || {};

    const [movie, setMovie] = useState({});
    const fetchMovie = async () => {
        const res = await movieServices.getMovieDetails(movieId, axiosConfig);
        setMovie(res);
        setTrailerLink(res.trailer);
    };
    useEffect(() => {
        fetchMovie();
    },[]);

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

    console.log(movie);

    return (
        <div className={'content-wrapper'}>
            <div className={'container-xxl flex-grow-1 container-p-y'}>
                <div className="card">
                    <div className="card-body p-4">
                        <div className="table-responsive text-nowrap">
                            <div className="row m-0">
                                <div className="col-md-4">
                                    <img src={imgUrl + movie.poster} alt={movie.title} className={'img-fluid mb-3'}/>
                                    {trailerId && (
                                        <div className="pb-0 mb-3">
                                            <h5>Trailer:</h5>
                                            <div className="video-preview"
                                                 style={{position: 'relative', paddingTop: '56.25%'}}>
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
                                    <h5>Others:</h5>
                                    <div className={'row'}>
                                        <div className="col-md-6 mb-3">
                                            <button className={'btn btn-warning w-100'}><span className="tf-icons bx bx-film"></span>&nbsp; Movie files</button>
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <button className={'btn btn-success w-100'}><span className="tf-icons bx bx-message-square-dots"></span>&nbsp; Movie reactions</button>
                                        </div>
                                        <div className="col-md-6">
                                            <button className={'btn btn-danger w-100'}><span className="tf-icons bx bx-star"></span>&nbsp; Casts</button>
                                        </div>
                                        <div className="col-md-6">
                                            <button className={'btn btn-secondary w-100'}><span className="tf-icons bx bx-group"></span>&nbsp; Crew</button>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-8">
                                    <h2 className={'text-primary'}>{movie.title}</h2>
                                    <h5 className={'text-info'}>Original title: {movie.originalTitle}</h5>
                                    <strong>Views: {movie.views}</strong><br/>
                                    <strong>Package: {movie.packageName}</strong><br/>
                                    {movie.canRent && movie.price !== null ?
                                        <strong>Can rent with price: $ {movie.price}</strong> : ''}
                                    <hr/>
                                    <div className="row">
                                        <div className="col-md-4">
                                            <p>Country</p>
                                        </div>
                                        <div className="col-md-8">
                                            <p>{movie.country}</p>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-4">
                                            <p>Studio</p>
                                        </div>
                                        <div className="col-md-8">
                                            <p>{movie.studio}</p>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-4">
                                            <p>Release year</p>
                                        </div>
                                        <div className="col-md-8">
                                            <p>{movie.releaseYear}</p>
                                        </div>
                                    </div>
                                    {Array.isArray(movie.genres) && movie.genres.length > 0 ? (
                                        <div className="row">
                                            <div className="col-md-4">
                                                <p>Genre(s)</p>
                                            </div>
                                            <div className="col-md-8">
                                                <p>{movie.genres.join(', ')}</p>
                                            </div>
                                        </div>
                                    ) : ''}
                                    {Array.isArray(movie.languages) && movie.languages.length > 0 ? (
                                        <div className="row">
                                            <div className="col-md-4">
                                                <p>Language(s)</p>
                                            </div>
                                            <div className="col-md-8">
                                                <p>{movie.languages.join(', ')}</p>
                                            </div>
                                        </div>
                                    ) : ''}
                                    <div className="row">
                                        <div className="col-md-4">
                                            <p>Classification</p>
                                        </div>
                                        <div className="col-md-8">
                                            <p>{movie.classification}</p>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-4">
                                            <p>Category</p>
                                        </div>
                                        <div className="col-md-8">
                                            <p>{movie.category}</p>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-4">
                                            <p>Duration</p>
                                        </div>
                                        <div className="col-md-8">
                                            <p>{movie.duration} minutes</p>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-4">
                                            <p>Video quality</p>
                                        </div>
                                        <div className="col-md-8">
                                            <p>{movie.videoMode}</p>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-4">
                                            <p>Story line</p>
                                        </div>
                                        <div className="col-md-8">
                                            <p style={{whiteSpace: 'normal', overflowWrap : 'break-word', maxWidth : '100%', textAlign : 'justify'}}>{movie.storyLine}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="card-footer text-end">
                        <button className={'btn btn-primary'} onClick={() => navigate(-1)}>Back</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MovieDetails;
