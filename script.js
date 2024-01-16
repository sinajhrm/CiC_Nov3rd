class TheMovieDBCommunicator {
    /**
     * @param {String} apiKey The accuired API key from TheMoviesDB API
     */
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.baseURL = 'https://api.themoviedb.org/3';
        this.watchlist_endpoint = 'https://656d0381e1e03bfd572ee9ba.mockapi.io/ReactApp/watchlist'
        this.UserWatchList = [];
    }

    isMoveIdInWatchList(movieId) {
        if (this.UserWatchList.filter((watchlistItem => watchlistItem.movieid === movieId)).length > 0)
            return true;
        else
            return false;
    }

    /**
     * Async function to get popular movies
     * @returns list of popular movies on successful request, otherwise an empty list
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
     * Async function to get new movies
     * @returns list of popular movies on successful request, otherwise an empty list
     * 
     */
    async fetchNewMovies() {
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkYWRkMWU2ODQwNDg4MjZkYTc0ZDQ2MWM1MjZmNjA3NSIsInN1YiI6IjY1NjkzNWVlZDA0ZDFhMDEwZDYzN2NhNyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.VlXS40i7PLiJPMUyeI9BU7cX5fE4nZOUVsOVoCQ_Gsk'
            }
        };
        try {
            const response = await fetch('https://api.themoviedb.org/3/movie/upcoming?language=en-US&page=1', options);
            const data = await response.json();
            return data.results;
        } catch (error) {
            console.error('Error fetching popular movies:', error);
            return [];
        }
    }

    /**
     * Async function to get popular tv-shows
     * @returns list of popular tv-shows on successful request, otherwise an empty list
     * 
     */
    async fetchPopularTVShows() {
        try {
            const response = await fetch(`${this.baseURL}/tv/popular?api_key=${this.apiKey}`);
            const data = await response.json();
            return data.results;
        } catch (error) {
            console.error('Error fetching popular movies:', error);
            return [];
        }
    }

    /**
     * Uses the movie ID as a string to add it to the watchlist
     * @param {String} movieid 
     * @returns Void
     */
    async addToWatchlist(movieid) {
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ movieid: String(movieid) })
        };
        try {

            const response = await fetch(this.watchlist_endpoint, options)
            let addToWatchListResposne = (await response).json()
        }
        catch (err) {
            console.error(err)
        }
    }

    /**
     * Uses the movie ID as a string to remove it from the watchlist
     * @param {String} movieid 
     * @returns Void
     */
    async removeFromWatchlist(movieid) {

        const movieIdToRemove = this.UserWatchList.filter(watchListItem => watchListItem.movieid === movieid)[0].id;

        const options = {
            method: 'DELETE',
        };
        try {

            const response = await fetch(this.watchlist_endpoint + `/${String(movieIdToRemove)}`, options)
            let addToWatchListResposne = (await response).json()
            this.UserWatchList = this.UserWatchList.filter(watchListItem => watchListItem.movieid !== movieid);
        }
        catch (err) {
            console.error(err)
        }
    }

    async UpdateWatchList() {
        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        try {
            this.UserWatchList = [];
            const response = await fetch(this.watchlist_endpoint, options);
            const data = await response.json();
            this.UserWatchList = data;
            // for (let index = 0; index < data.length; index++) {
            //     this.UserWatchList.push(data[index].movieid);
            // }
            // this.UserWatchList = data;
        }
        catch (err) {
            console.error(err)
        }
    }
}

const apiKey = 'dadd1e684048826da74d461c526f6075';
//Create a global instance of TheMovieDBCommunicator class
const movieDBCommunicator = new TheMovieDBCommunicator(apiKey, true);


// Async function to get and display popular movies
async function displayPopularMovies() {
    try {
        const movies = await movieDBCommunicator.fetchPopularMovies();
        await movieDBCommunicator.UpdateWatchList();
        displayMovies(movies);
    } catch (error) {
        console.error('Error displaying popular movies:', error);
    }
}

// Async function to get and display new movies
async function displayNewMovies() {
    try {
        const movies = await movieDBCommunicator.fetchNewMovies();
        await movieDBCommunicator.UpdateWatchList();
        displayMovies(movies);
    } catch (error) {
        console.error('Error displaying popular movies:', error);
    }
}

// Async function to get and display popular tv shows
async function displayPopularTVShows() {
    try {
        const movies = await movieDBCommunicator.fetchPopularTVShows();
        await movieDBCommunicator.UpdateWatchList();
        displayMovies(movies);
    } catch (error) {
        console.error('Error displaying popular movies:', error);
    }
}

// Adds the list of movies to the main grid view
function displayMovies(movies) {
    const moviesGrid = document.getElementById('movies-grid');
    moviesGrid.innerHTML = "";

    movies.forEach(movie => {
        //Creating the movie card view (this will be the grid view item in the main UI)
        const movieElement = document.createElement('div');
        movieElement.id = movie.id;
        movieElement.classList.add('movie');
        movieElement.setAttribute('movie-tooltip', "Double click to add to watchlist!")
        if (movieDBCommunicator.isMoveIdInWatchList(String(movie.id))) {
            movieElement.classList.add('movie-watchlisted');
            movieElement.setAttribute('movie-tooltip', "Double click to remove from watchlist!")
        }

        movieElement.addEventListener("dblclick", (event) => { toggleMovieIdInWatchList(event.currentTarget, String(movie.id)) })

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
/**
 * Toggles movie by movieId in MockAPI's list and UI 
 * @param {HTMLElement} target 
 * @param {string} movieid 
 */
function toggleMovieIdInWatchList(target, movieid) {
    if (movieDBCommunicator.isMoveIdInWatchList(movieid)) {
        movieDBCommunicator.removeFromWatchlist(movieid);
        target.classList.remove('movie-watchlisted')
        target.setAttribute('movie-tooltip', "Double click to add to watchlist!")
    }
    else {
        movieDBCommunicator.addToWatchlist(movieid);
        target.classList.add('movie-watchlisted')
        target.setAttribute('movie-tooltip', "Double click to remove from watchlist!")
    }
    movieDBCommunicator.UpdateWatchList();
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

document.getElementById('btn-popmovies').addEventListener('click', displayPopularMovies);
document.getElementById('btn-poptvshows').addEventListener('click', displayPopularTVShows);
document.getElementById('btn-newmovies').addEventListener('click', displayNewMovies);


// The event which is trigerred after the page loads completely.
window.addEventListener('DOMContentLoaded', () => {
    displayPopularMovies();
});

// movieDBCommunicator.addToWatchlist("753342")