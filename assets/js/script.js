const searchButton = document.querySelector('.search-button');
searchButton.addEventListener('click', async function () {
    try {
        const inputKeyword = document.querySelector('.input-keyword');
        const movies = await getMovies(inputKeyword.value);
        updateUI(movies);
    }catch(e){
        alert(e);
    }
});

function getMovies(keyword) {
    return fetch('http://www.omdbapi.com/?apikey=cfc98326&s=' + keyword)
        .then(response => {
            if(!response.ok) {
                throw new Error(response.statusText);
            }
            return response.json();
        })
        .then(response => {
            if (response.Response === "False") {
                throw new Error(response.Error);
            }
            return response.Search;
        });
}

function updateUI(movies) {
    let cards = '';
    movies.forEach(m => cards += showCards(m));
    const movieContainer = document.querySelector('.movie-container');
    const info = document.querySelector('.info');
    info.style.display='none';
    movieContainer.innerHTML = cards;
}

document.addEventListener('click', async function (e) {
    if (e.target.classList.contains('detail-button')) {
        const imdbid = e.target.dataset.imdbid;
        const movieDetail = await getMovieDetail(imdbid);
        updateUIDetail(movieDetail);
    }
});

function getMovieDetail(imdbid) {
    return fetch('http://www.omdbapi.com/?apikey=cfc98326&i=' + imdbid)
        .then(response => response.json())
        .then(m => m);
}

function updateUIDetail(m) {
    const movieDetail = showMovieDetail(m);
    const modalBody = document.querySelector('.modal-body');
    modalBody.innerHTML = movieDetail;
}


function showCards(m) {
    return `<div class="col-md-3 my-5 p-3">
                <div class="card">
                    <img src="${m.Poster}" class="card-img-top" height="auto">
                    <div class="card-body">
                        <h5 class="card-title">${m.Title}</h5>
                        <h6 class="card-subtitle text-muted">${m.Year}</h6>
                        <a href="#" class="btn btn-primary detail-button mt-2" data-bs-toggle="modal" data-bs-target="#movieDetail" data-imdbid="${m.imdbID}">Detail</a>
                    </div>
                </div>
            </div>`
}

function showMovieDetail(m) {
    return `<div class="modal-body">
                <div class="container-fluid">
                    <div class="row">
                        <div class="col-md-3">
                            <img src="${m.Poster}" alt="" class="img-fluid">
                        </div>
                        <div class="col-md">
                            <ul class="list-group">
                                <li class="list-group-item"><h4>${m.Title} (${m.Year})</h4></li>
                                <li class="list-group-item"><strong>Genre: </strong>${m.Genre}</li>
                                <li class="list-group-item"><strong>Director: </strong>${m.Director}</li>
                                <li class="list-group-item"><strong>Actors: </strong>${m.Actors}</li>
                                <li class="list-group-item"><strong>Witers: </strong>${m.Writer}</li>
                                <li class="list-group-item"><strong>Sinopsis: </strong>${m.Plot}</li>
                                <li class="list-group-item"><strong>Votes: </strong>${m.imdbVotes}</li>
                                <li class="list-group-item"><strong>Ratings: </strong>&#9734; ${m.imdbRating}</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>`
}