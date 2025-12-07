const API_URL = 'http://localhost:3000/movies';

const movieListDiv = document.getElementById('movie-list');
const searchInput = document.getElementById('search-input');
const form = document.getElementById('add-movie-form');

const editModal = document.getElementById('edit-modal');
const editForm = document.getElementById('edit-movie-form');
const editId = document.getElementById('edit-id');
const editTitle = document.getElementById('edit-title');
const editGenre = document.getElementById('edit-genre');
const editYear = document.getElementById('edit-year');
const closeModalBtn = document.getElementById('close-modal-btn');

const deleteModal = document.getElementById('delete-confirm-modal');
const deleteName = document.getElementById('delete-movie-name');
const deleteIdInput = document.getElementById('delete-id-input');
const cancelDeleteBtn = document.getElementById('cancel-delete-btn');
const confirmDeleteBtn = document.getElementById('confirm-delete-btn');

let allMovies = [];

function openEditModal(movie) {
    editId.value = movie.id;
    editTitle.value = movie.title;
    editGenre.value = movie.genre;
    editYear.value = movie.year;
    editModal.classList.remove('hidden');
}

closeModalBtn.addEventListener('click', () => {
    editModal.classList.add('hidden');
});

editForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const updatedMovie = {
        title: editTitle.value.trim(),
        genre: editGenre.value.trim(),
        year: parseInt(editYear.value)
    };

    fetch(`${API_URL}/${editId.value}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedMovie)
    })
    .then(() => {
        editModal.classList.add('hidden');
        fetchMovies();
    });
});

function openDeleteModal(movie) {
    deleteIdInput.value = movie.id;
    deleteName.textContent = `Are you sure you want to delete "${movie.title}"?`;
    deleteModal.classList.remove('hidden');
}

cancelDeleteBtn.addEventListener('click', () => {
    deleteModal.classList.add('hidden');
});

confirmDeleteBtn.addEventListener('click', () => {
    fetch(`${API_URL}/${deleteIdInput.value}`, {
        method: 'DELETE'
    })
    .then(() => {
        deleteModal.classList.add('hidden');
        fetchMovies();
    });
});

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
            openEditModal(movie);
        });

        movieElement.querySelector('.delete-btn').addEventListener('click', () => {
            openDeleteModal(movie);
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
        });
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
    .then(() => {
        form.reset();
        fetchMovies();
    });
});
