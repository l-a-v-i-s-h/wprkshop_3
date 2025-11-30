const API_URL = 'http://localhost:3000/movies';

const movieListDiv = document.getElementById('movie-list');
const searchInput = document.getElementById('search-input');
const form = document.getElementById('add-movie-form');

let allMovies = [];

function renderMovies(moviesToDisplay) {
    movieListDiv.innerHTML = '';

    if (moviesToDisplay.length === 0) {
        movieListDiv.innerHTML = '<p>No movies found matching your criteria.</p>';
        return;
    }

    moviesToDisplay.forEach(movie => {
        const movieElement = document.createElement('div');
        movieElement.classList.add('movie-item');

        movieElement.innerHTML = `
            <p><strong>${movie.title}</strong> (${movie.year}) - ${movie.genre}</p>
            <button class="edit-btn">Edit</button>
            <button class="delete-btn">Delete</button>
        `;

        movieElement.querySelector('.edit-btn').addEventListener('click', () => {
            editMoviePrompt(movie.id, movie.title, movie.year, movie.genre);
        });

        movieElement.querySelector('.delete-btn').addEventListener('click', () => {
            deleteMovie(movie.id);
        });

        movieListDiv.appendChild(movieElement);
    });
}

function fetchMovies() {
    fetch(API_URL)
        .then(response => response.json())
        .then(movies => {
            allMovies = movies;
            renderMovies(allMovies);
        })
        .catch(error => console.error('Error fetching movies:', error));
}

fetchMovies();

searchInput.addEventListener('input', () => {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredMovies = allMovies.filter(movie => 
        movie.title.toLowerCase().includes(searchTerm) ||
        movie.genre.toLowerCase().includes(searchTerm)
    );
    renderMovies(filteredMovies);
});

form.addEventListener('submit', (event) => {
    event.preventDefault();

    const newMovie = {
        title: document.getElementById('title').value.trim(),
        genre: document.getElementById('genre').value.trim(),
        year: parseInt(document.getElementById('year').value)
    };

    fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMovie)
    })
    .then(response => {
        if (!response.ok) throw new Error('Failed to add movie');
        return response.json();
    })
    .then(() => {
        form.reset();
        fetchMovies();
    })
    .catch(error => console.error('Error adding movie:', error));
});

function editMoviePrompt(id, currentTitle, currentYear, currentGenre) {
    const newTitle = prompt('Enter new Title:', currentTitle);
    const newYearStr = prompt('Enter new Year:', currentYear);
    const newGenre = prompt('Enter new Genre:', currentGenre);

    if (newTitle && newYearStr && newGenre) {
        const updatedMovie = {
            title: newTitle.trim(),
            year: parseInt(newYearStr),
            genre: newGenre.trim()
        };
        updateMovie(id, updatedMovie);
    }
}

function updateMovie(movieId, updatedMovieData) {
    fetch(`${API_URL}/${movieId}`, {  
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedMovieData)
    })
    .then(response => {
        if (!response.ok) throw new Error('Failed to update movie');
        return response.json();
    })
    .then(() => {
        fetchMovies();
    })
    .catch(error => console.error('Error updating movie:', error));
}

function deleteMovie(movieId) {
    fetch(`${API_URL}/${movieId}`, {  
        method: 'DELETE'
    })
    .then(response => {
        if (!response.ok) throw new Error('Failed to delete movie');
        fetchMovies();
    })
    .catch(error => console.error('Error deleting movie:', error));
}
