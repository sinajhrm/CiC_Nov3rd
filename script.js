// const apiKey = 'dadd1e684048826da74d461c526f6075'; // Replace 'YOUR_API_KEY' with your TMDb API key

// const options = { method: 'GET', headers: { accept: 'application/json' } };

// fetch('https://api.themoviedb.org/3/authentication', options)
//   .then(response => response.json())
//   .then(response => console.log(response))
//   .catch(err => console.error(err));

class TheMovieDBCommunicator {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.baseURL = 'https://api.themoviedb.org/3';
    }

    async fetchPopularMovies() {
        try {
            const response = await fetch(`${this.baseURL}/movie/popular?api_key=${this.apiKey}`);
            const data = await response.json();
            return data.results;
        } catch (error) {
            console.error('Error fetching popular movies:', error);
            return [];
        }
    }
}

const apiKey = 'dadd1e684048826da74d461c526f6075';
const movieDBCommunicator = new TheMovieDBCommunicator(apiKey);

async function displayPopularMovies() {
    try {
        const movies = await movieDBCommunicator.fetchPopularMovies();
        displayMovies(movies);
    } catch (error) {
        console.error('Error displaying popular movies:', error);
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


window.addEventListener('DOMContentLoaded', () => {
    displayPopularMovies();
});

window.addEventListener('scroll', function () {
    const navbar = document.querySelector('#navbar');
    if (window.scrollY > 0) {
        navbar.classList.add('navbar-sticky');
    } else {
        navbar.classList.remove('navbar-sticky');
    }
});
