//TODO
// - no need to rewrite filterMoviesByDate - only series have date as range (see next point)
// - change filter functions to omit "series" type from movies array --> DONE
// - implement search functionality
// - add "show all movies" option to filtering --> DONE

/* eslint-disable no-unused-vars */

/* WINC FILM FINDER
 * Assignment film finder
 * Functionalities:
 * - display a movie poster as gallery
 * - filter movies (latest, avenger, x-men, princess, batman)
 *   1 category at a time with radio buttons
 *    As the requirements are about movies, series will not be
 *    included in the results.
 * - clicking the poster opens corresponding imdb page
 * BONUS feature(s):
 * - search field to search by movie name */

import { movies } from "./movie-database.js";

/* global variables for movie-gallery and search
 * to use with addPoster, clearGallery and
 * searchInMovieTitle functions */
const gallery = document.getElementById("movie-gallery");
const searchBar = document.getElementById("movie-search");
const searchButton = document.getElementById("search-button");

// FUNCTIONS FOR FILTERING

/* function to create a .movie-poster element
 * @param {object} movie object from imported movies array
 * @return {object} html element, poster
 */
const createPoster = function (movie) {
  const imdbLink = `https://www.imdb.com/title/${movie.imdbID}/`;
  //create elements
  const poster = document.createElement("div");
  const posterLink = document.createElement("a");
  const posterImage = document.createElement("img");
  // add "img" element to "a" element
  posterLink.appendChild(posterImage);
  // add "a" element (with nested img) to "div" element
  poster.appendChild(posterLink);

  //add attributes to elements
  posterLink.setAttribute("href", imdbLink);
  posterLink.setAttribute("target", "_blank");
  posterImage.setAttribute("src", movie.poster);

  // add .movie-poster class to poster-div
  poster.classList.add("movie-poster");
  return poster;
};

/* function to add poster to the #poster-gallery element
- * @param {object} movie object from imported movies array */
const addPoster = (movie) => gallery.appendChild(createPoster(movie));

/* function to clear the movie-gallery before a new filter is applied
 * removes each poster from  gallery if not empty */
const clearGallery = function (name) {
  const postersArr = Array.from(
    document.getElementsByClassName("movie-poster")
  );

  postersArr.length > 0
    ? postersArr.forEach((poster) => gallery.removeChild(poster))
    : console.warn(
        `WARNING: (disregard if first call of clearGallery function)
       Cannot clear movie-gallery of ${name}-movies, there are no child-elements to remove`,
        gallery.children
      );
};

/* function to filter movies by date,
 * this can be used for the latest movies filter
 * @param {array} - the imported movies array
 * @param {string or int} - date, from year (of release) default: 1890
 * @param {string or int} - date, until year (of release) default: current year
 * If no argument(s) provided for date(s), default values are used
 * steps:
 * - filter array argument based on date arguments/ or defaults
 * - loop through the sorted array and call addPoster() on each element */
const filterMoviesByDate = (
  moviesArr,
  dateFrom = 1890,
  dateUntil = new Date().getFullYear()
) =>
  moviesArr
    .filter(
      (movie) =>
        Number(movie.year) >= Number(dateFrom) &&
        Number(movie.year) <= Number(dateUntil) &&
        movie.type === "movie"
    )
    .forEach((movie) => addPoster(movie));

/* function to filter movies by name
 * this can be used for the other 4 filter options (avang.,X-m.,prin., batm.)
 * @param {array} - the imported movies array
 * @param {string} - phrase, value of selected radio input
 * - filter array argument based on phrase argument (radio-input value)
 * - loop through the sorted array and call addPoster() on each element */
const filterMoviesByName = (moviesArr, phrase) => {
  moviesArr
    .filter(
      (movie) =>
        movie.title.toLowerCase().includes(phrase) && movie.type === "movie"
    )
    .forEach((movie) => addPoster(movie));
};

/* function to show all movies (series are ignored)
 * if radio-input #all-movies has checked attr.:
 * -> filterMoviesByDate - with default params.
 * - show warning for dev purposes if no checked attr.
 * IMPORTANT: call function in global context to have
 * movie finder show all movies by default */
const showAllMovies = (moviesArr) => {
  const filterForAll = document.getElementById("all-movies");

  filterForAll.checked
    ? filterMoviesByDate(moviesArr)
    : console.warn("showAllMovies:", filterForAll.checked);
};

/* function to add the posters of each movie
 * that fits the selected filter to the movie-gallery
 * shows all movies as default option
 * @param {array} - the imported movies array
 * @param {string} - phrase, value of selected radio input
 * (called by the anonym event handler on radio-button
 * change event) */
const buildFilteredGallery = function (moviesArr, phrase) {
  clearGallery(phrase);
  // call filter functions based on input-value (phrase)
  switch (phrase) {
    case "latest":
      filterMoviesByDate(moviesArr, 2014);
      break;
    case "avenger":
      filterMoviesByName(moviesArr, "avenger");
      break;
    case "x-men":
      filterMoviesByName(moviesArr, "x-men");
      break;
    case "princess":
      filterMoviesByName(moviesArr, "princess");
      break;
    case "batman":
      filterMoviesByName(moviesArr, "batman");
      break;
    default:
      showAllMovies(moviesArr);
  }
};

//FUNCTIONS FOR SEARCH

/* function to search for movies by checking if
 * search bar input-value is part of the movie title
 * @param {array} - the imported movies array
 *  - gets searchBar value and passes it into
 *  filterMoviesByName function as arg.
 *  event handler for search-button click event */
const searchInMovieTitle = function (moviesArr) {
  clearGallery(searchBar.value);
  //console.log(searchBar.value);
  filterMoviesByName(moviesArr, searchBar.value);
};

// FUNCTIONS FOR EVENT LISTENERS

/* function to add event listener to each radio button
 * loop through an array of filter-radio-button elements
 * add change event to each
 * use buildFilteredGallery() as event handler */
const addListenerToFilterButtons = function () {
  const filterButtonArr = Array.from(
    document.getElementsByClassName("filter-button")
  );

  filterButtonArr.forEach(
    (input) =>
      input.addEventListener("change", (e) =>
        buildFilteredGallery(movies, e.target.value)
      ),
    false
  );
};

/* function to add event listener to search button ("click")
 * and search bar ("keypress") */
const addListenersToSearch = function () {
  searchBar.addEventListener("keypress", (e) => {
    e.key === "Enter" ? searchInMovieTitle(movies) : e.key;
  });
  searchButton.addEventListener("click", () => {
    searchInMovieTitle(movies);
  });
};

// CALL FUNCTIONS
showAllMovies(movies);
addListenerToFilterButtons();
addListenersToSearch();
