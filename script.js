// const apiKey = 'dadd1e684048826da74d461c526f6075'; // Replace 'YOUR_API_KEY' with your TMDb API key

// const options = { method: 'GET', headers: { accept: 'application/json' } };

// fetch('https://api.themoviedb.org/3/authentication', options)
//   .then(response => response.json())
//   .then(response => console.log(response))
//   .catch(err => console.error(err));

class TheMovieDBCommunicator {
    /**
     * @param {String} apiKey The accuired API key from TheMoviesDB API
     * @param {boolean} initSession If True, a new sessionId will be initilized in the constrcutor of the class
     */
    constructor(apiKey, initSession = false) {
        this.apiKey = apiKey;
        this.baseURL = 'https://api.themoviedb.org/3';
        this.sessionId = null;
        if (initSession)
            this.sessionId = this.createSession();
    }

    /**
     * Async function to get popular movies
     * @returns Void
     * 
     */
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

    /**
     * 
     * @returns Async function to create a new session
     */
    async createSession() {
        try {
            const response = await fetch(`${this.baseURL}/authentication/session/new?api_key=${this.apiKey}`, {
                method: 'POST',
            });
            const data = await response.json();
            this.sessionId = data.session_id;
            return true;
        } catch (error) {
            console.error('Error creating session:', error);
            return false;
        }
    }

    /**
     * Uses the movie ID as a string to add it to the watchlist associated with the current session IS
     * @param {String} movieId 
     * @returns Void
     */
    async addToWatchlist(movieId) {
        if (!this.sessionId) {
            const created = await this.createSession();
            if (!created) {
                console.error('Failed to create session. Cannot add to watchlist.');
                return false;
            }
        }

        try {
            const response = await fetch(`${this.baseURL}/account/{account_id}/watchlist?api_key=${this.apiKey}&session_id=${this.sessionId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8',
                },
                body: JSON.stringify({
                    media_type: 'movie',
                    media_id: movieId,
                    watchlist: true
                })
            });
            const data = await response.json();
            return data.success;
        } catch (error) {
            console.error('Error adding to watchlist:', error);
            return false;
        }
    }
}

const apiKey = 'dadd1e684048826da74d461c526f6075';
//Create a global instance of TheMovieDBCommunicator class
const movieDBCommunicator = new TheMovieDBCommunicator(apiKey);

// Async function to get and display popular movies
async function displayPopularMovies() {
    try {
        const movies = await movieDBCommunicator.fetchPopularMovies();
        displayMovies(movies);
    } catch (error) {
        console.error('Error displaying popular movies:', error);
    }
}

// Adds the list of movies to the main grid view
function displayMovies(movies) {
    const moviesGrid = document.getElementById('movies-grid');

    movies.forEach(movie => {
        //Creating the movie card view (this will be the grid view item in the main UI)
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

// Controls the sticky navbar behaviour
window.addEventListener('scroll', function () {
    const navbar = document.querySelector('#navbar');
    if (window.scrollY > 0) {
        navbar.classList.add('navbar-sticky');
    } else {
        navbar.classList.remove('navbar-sticky');
    }
});


// The event which is trigerred after the page loads completely.
window.addEventListener('DOMContentLoaded', () => {
    displayPopularMovies();
});