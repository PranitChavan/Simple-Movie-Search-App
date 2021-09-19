'use strict';

const form = document.querySelector('.search');
const container = document.querySelector('.container');
const searchInput = document.querySelector('.search__input');

class getMovieData {
  #url =
    'https://api.themoviedb.org/3/search/movie?&api_key=04c35731a5ee918f014970082a0088b1&query=';

  imgPath = 'https://image.tmdb.org/t/p/w500/';
  constructor() {
    form.addEventListener('submit', this._search.bind(this));
  }

  _search(e) {
    e.preventDefault();
    container.innerHTML = '';

    const value = searchInput.value.toLowerCase();
    this._callApi(value);
  }

  async _callApi(input) {
    try {
      if (searchInput.value === '') {
        throw new Error('Enter the Movie Name.');
      }

      const url = this.#url + input;
      const response = await fetch(url);
      const data = await response.json();

      if (data.results.length == 0) {
        throw new Error(
          `No movie with the name ${searchInput.value} was found in our database. Please try with something different`
        );
      }

      this._displayData(data);
    } catch (err) {
      alert(err);
    }
  }

  _ratingColors(vote) {
    if (vote >= 8) {
      return 'movie__rating-green';
    } else if (vote >= 5) {
      return 'movie__rating-orange';
    } else {
      return 'movie__rating-red';
    }
  }

  _displayData(data) {
    const results = data.results;

    const resultsWithImages = results.filter((r) => {
      if (r.backdrop_path) {
        return r;
      }
    });

    resultsWithImages.forEach((r) => {
      const html = `
      <figure class="movie">
      <img src="${
        this.imgPath + r.poster_path
      }" alt="Image Not available :(" class="movie__img" />

      <div class="movie__details">
        <h3 class="movie__name">${r.original_title}</h3>
        <div class="movie__rating ${this._ratingColors(r.vote_average)}">${
        r.vote_average
      }</div>
      </div>

      <div class="movie__overview">
         <h3 class="movie__heading"> Overview </h3>
        ${r.overview}
    </div>
    </figure>
      `;

      container.insertAdjacentHTML('beforeend', html);

      searchInput.value = '';
    });
  }
}

const app = new getMovieData();
