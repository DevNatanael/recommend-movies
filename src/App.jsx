import { useEffect, useState } from "react";
import "./App.css";

const apiKey = "sua-api-key";

function App() {
  const [genres, setGenres] = useState([]);
  const [movie, setMovie] = useState(null);
  const [movieRecommendation, setMovieRecommendation] = useState("");

  function getRandomMoviesByGenres() {
    const promises = genres.map((genre) => {
      const url = `http://www.omdbapi.com/?apikey=${apiKey}&s=${genre}&type=movie`;
      return fetch(url).then((response) => response.json());
    });

    Promise.all(promises)
      .then((results) => {
        const movies = results.reduce((acc, data) => {
          if (data.Search) {
            acc = [...acc, ...data.Search];
          }
          return acc;
        }, []);

        if (movies.length > 0) {
          const randomIndex = Math.floor(Math.random() * movies.length);
          const randomMovie = movies[randomIndex];
          setMovieRecommendation(
            `Recomendamos o filme "${randomMovie.Title}"!`
          );

          const movieUrl = `http://www.omdbapi.com/?apikey=${apiKey}&i=${randomMovie.imdbID}`;
          fetch(movieUrl)
            .then((response) => response.json())
            .then((data) => {
              setMovie(data);
            })
            .catch((error) => console.log(error));
        } else {
          setMovieRecommendation(
            "Não encontramos filmes para os gêneros selecionados. Por favor, escolha outros gêneros."
          );
          setMovie(null);
        }
      })
      .catch((error) => console.log(error));
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (genres.length >= 3) {
      getRandomMoviesByGenres();
    } else {
      setMovieRecommendation("Por favor, escolha pelo menos 3 gêneros.");
      setMovie(null);
    }
  }

  function handleGenreChange(event) {
    const genre = event.target.value;
    if (!genres.includes(genre)) {
      setGenres([...genres, genre]);
    }
  }

  function handleRemoveGenre(genre) {
    setGenres(genres.filter((g) => g !== genre));
  }

  // useEffect(() => {
  //   console.log(movie, "aqqq");
  // }, [movie]);

  return (
    <div className="App">
      <form onSubmit={handleSubmit}>
        <div>
          <label>Escolha pelo menos 3 gêneros:</label>
          <br />
          <select onChange={handleGenreChange}>
            <option value="">-- Selecione um gênero --</option>
            <option value="action">Ação</option>
            <option value="comedy">Comédia</option>
            <option value="drama">Drama</option>
            <option value="horror">Terror</option>
            <option value="romance">Romance</option>
            <option value="sci-fi">Ficção científica</option>
          </select>
        </div>
        {genres.map((genre) => (
          <div key={genre}>
            <span>{genre}</span>
            <button type="button" onClick={() => handleRemoveGenre(genre)}>
              x
            </button>
          </div>
        ))}
        <br />
        <button type="submit">Recomendar filme</button>
      </form>
      <br />
      <p>{movieRecommendation}</p>
      {movie && (
        <div>
          <img src={movie.Poster} alt={movie.Title} />
          <p>Avaliação: {movie.imdbRating}</p>
          <p>Categoria: {movie.Genre}</p>
          <p>Resumo: {movie.Plot}</p>
        </div>
      )}
    </div>
  );
}

export default App;
