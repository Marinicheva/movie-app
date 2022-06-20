document.addEventListener('DOMContentLoaded', () => {
    const BASE_URL = 'https://api.themoviedb.org/3';
    const API_KEY = '&api_key=ddb3c52ea825fd0edb7d0ca773a17712';
    const IMG_URL = 'https://image.tmdb.org/t/p/w1280';
    const START_PAGE_URL = BASE_URL + '/discover/movie?sort_by=popularity.desc' + API_KEY;

    const movieContainer = document.querySelector('.content-container');
    const searchBtn = document.querySelector('.search-input__send');
    const messageNotFound = document.querySelector('.not-found-title');

    let userRequest = document.querySelector('.search-input');


    function showMovie(data) {
        movieContainer.innerHTML = '';
        if (data.length > 0) {
            messageNotFound.classList.remove('not-found-title_active');
            data.forEach(movie => {
                let {title, overview, poster_path, vote_average} = movie;

                let src;
                if (!poster_path) {
                    src = 'assets/svg/bg-card-without-poster.svg';
                } else {
                    src = IMG_URL + poster_path;
                }
    
                let card = document.createElement('div');
                let classRate = getRate(vote_average);
    
                card.classList.add('movie-card');
                card.innerHTML = `<img
                src="${src}"
                alt="Movie ${title} poster"
                class="movie-card__img"
              />
              <div class="movie-card__descr movie-descr">
                <h3 class="movie-descr__title">${title}</h3>
                <div class="movie-descr__range range ${classRate}">${vote_average}</div>
              </div>
              <div class="movie-card__overview">
                <h3 class="overview-title">Overview</h3>
                ${overview}
              </div>`;
    
              movieContainer.append(card);
            });
        } else {
            messageNotFound.classList.add('not-found-title_active');
        }
        
    }

    function getRate(rate) {
        if(rate >= 8) {
            return 'range_good';
        } else if ( rate >= 5 ) {
            return 'range_medium';
        } else {
            return 'range_low';        
        }
    }

    function searchMovie() {
        let request = userRequest.value;
        let searchURL = BASE_URL + '/search/movie?query=' + request + API_KEY;

        getMovie(searchURL);
    }

    async function getMovie(url) {

        const res = await fetch(url);

        if (res['status'] != 200) {
            movieContainer.innerHTML = '';
            messageNotFound.classList.add('not-found-title_active');
            
        } else {
            const data = await res.json();
            showMovie(data.results);
        }
    }

    getMovie(START_PAGE_URL);

    document.addEventListener('keydown', (event) => {
        if (event.code === 'Enter' || event.code === 'NumpadEnter' ) {
            event.preventDefault();
            searchMovie();
        }
    });

    searchBtn.addEventListener('click', (event) => {
        event.preventDefault();
        searchMovie();
    });
});