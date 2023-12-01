const apiKey = 'dadd1e684048826da74d461c526f6075'; // Replace 'YOUR_API_KEY' with your TMDb API key

const options = { method: 'GET', headers: { accept: 'application/json' } };

// fetch('https://api.themoviedb.org/3/authentication', options)
//   .then(response => response.json())
//   .then(response => console.log(response))
//   .catch(err => console.error(err));

async function fetchMovies() {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}`);
        const data = await response.json();
        displayMovies(data.results);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

function displayMovies(movies) {
    const moviesGrid = document.getElementById('movies-grid');

    movies.forEach(movie => {
        const movieElement = document.createElement('div');
        movieElement.classList.add('movie');

        const imageUrl = `https://image.tmdb.org/t/p/w500/${movie.poster_path}`;

        const imgElement = document.createElement('img');
        imgElement.src = imageUrl;
        imgElement.alt = movie.title;

        const titleElement = document.createElement('div');
        titleElement.classList.add('movie-title');
        titleElement.textContent = movie.title;

        movieElement.appendChild(imgElement);
        movieElement.appendChild(titleElement);

        moviesGrid.appendChild(movieElement);
    });
}

fetchMovies();