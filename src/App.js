import { useEffect, useState } from "react";
import myImage from "./assets/Logonetflix.png";

export default function App() {
  const [movies, setMovie] = useState([]);
  const [watched, setWatched] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const [myQuery, setMyQuery] = useState("");

  function handleSelectedID(id) {
    setSelectedId((selectedId) => (selectedId === id ? null : id));
  }

  function handleAdd(newWatchedMovie) {
    setWatched((watched) => [...watched, newWatchedMovie]);
  }

  function handleDelete(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }

  console.log(watched);
  useEffect(
    function () {
      try {
        async function fetchMovies() {
          setIsLoading(true);

          const res = await fetch(
            `http://www.omdbapi.com/?i=tt3896198&apikey=fe619927&s=${myQuery}`
          );
          const data = await res.json();

          if (!res.ok)
            throw new Error("Something went wrong with fetching movies");

          if (data.Response === "False") throw new Error("Movie not found");

          setMovie(data.Search);
          setIsLoading(false);
        }

        if (myQuery.length < 3) {
          setMovie([]);
          return;
        }

        fetchMovies();
      } catch (err) {
        console.log(err);
      }
    },
    [myQuery]
  );

  return (
    <div className="main-container">
      <Header />
      <LeftContainer
        movies={movies}
        onSelectedId={handleSelectedID}
        isLoading={isLoading}
        myQuery={myQuery}
        onSetMyQuery={setMyQuery}
      />
      <RightContainer
        selectedId={selectedId}
        onAddWatchedMovie={handleAdd}
        watched={watched}
        onDelete={handleDelete}
      />
    </div>
  );
}

function Header() {
  return (
    <div className="heading">
      <img src={myImage} className="logo" alt="Netflix Logo" />
      <h1 className="title">MY RECOS</h1>
    </div>
  );
}

function LeftContainer({
  movies,
  onSelectedId,
  isLoading,
  onSetMyQuery,
  myQuery,
}) {
  return (
    <div className="left-container">
      <input
        className="search-input"
        type="text"
        value={myQuery}
        onChange={(e) => onSetMyQuery(e.target.value)}
      />
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <div className="movie-lists-container">
            {movies.map((movie) => (
              <img
                movie={movie}
                key={movie.imdbID}
                className="img-movie"
                src={movie.Poster}
                alt={movie.Title}
                onClick={() => onSelectedId(movie.imdbID)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function RightContainer({ selectedId, onAddWatchedMovie, watched, onDelete }) {
  return (
    <div className="right-container">
      {selectedId ? (
        <MovieDetails
          selectedId={selectedId}
          onAddWatchedMovie={onAddWatchedMovie}
        />
      ) : (
        <>
          <div className="watched-details">
            <p>MOVIES WATCHED</p>
            <span>{watched.length} movies</span>
          </div>

          {watched.map((watchedMovie) => (
            <div className="watched-movie-item">
              <>
                <img
                  className="watched-movie-img"
                  key={watchedMovie.imdbID}
                  src={watchedMovie.poster}
                  alt={watchedMovie.poster}
                />
                <div className="watched-movie-infos">
                  {watchedMovie.title}
                  <br />
                  {watchedMovie.year}
                  <br />
                </div>
                <button
                  className="btn-delete"
                  onClick={() => onDelete(watchedMovie.imdbID)}
                >
                  ❌
                </button>
              </>
            </div>
          ))}
        </>
      )}
    </div>
  );
}

//this will show when a movie pic is clicked
function MovieDetails({ selectedId, onAddWatchedMovie }) {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const { Title: title, Year: year, Poster: poster } = movie;

  function handleAddNewWatchedMovie() {
    const newWatched = { imdbID: selectedId, title, year, poster };
    onAddWatchedMovie(newWatched);
    console.log("new watched:", newWatched);
  }

  //getting the movie details of the selected id
  useEffect(
    function () {
      async function getMovieDetails() {
        setIsLoading(true);
        const res = await fetch(
          `http://www.omdbapi.com/?i=${selectedId}&apikey=fe619927`
        );
        const data = await res.json();
        console.log(data);
        setMovie(data);
        setIsLoading(false);
      }
      getMovieDetails();
    },
    [selectedId]
  );

  return (
    <div className="clicked-movie-component">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <div className="clicked-main-details">
            <img className="clicked-movie-img" src={poster} alt={title} />
            <div className="clicked-movie-details">
              {title} <br />
              {year}
              <br />
            </div>
          </div>

          <button
            className="btn-add-to-list"
            onClick={handleAddNewWatchedMovie}
          >
            ADD TO LIST
          </button>

          <p>
            {" "}
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and.
          </p>
        </>
      )}
    </div>
  );
}

//this will show while fetching
function Loader() {
  return (
    <div>
      <p>Loading...</p>
    </div>
  );
}
