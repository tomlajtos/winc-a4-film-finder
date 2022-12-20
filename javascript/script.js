//TODO
// - no need to rewrite filterMoviesByDate - only series have date as range (see next point)
// - change filter functions to omit "series" type from movies array --> DONE
// - implement search functionality
//     - add a function that returns the number of filtered movies,
//     - add function that displays a message if no search hit
//     - add search/filter result info in footer ?
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
 * - search field to search by movie name
 */

import { movies } from "./movie-database.js";

/* global variables for movie-gallery and search
 * to use with addPoster, clearGallery and
 * searchInMovieTitle functions
 */
const gallery = document.getElementById("movie-gallery");
const searchBar = document.getElementById("movie-search");
const searchButton = document.getElementById("search-button");
const currentYear = new Date().getFullYear();

// FUNCTIONS FOR FILTERING

/* function to create a .movie-poster element
 * @param {object} movie object from imported movies array
 * @return {object} html element, poster
 */
const createPoster = function(movie) {
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
  poster.classList.add("movie-poster", "gallery-item");
  return poster;
};

/* function to add poster to the #poster-gallery element
 * @param {object} movie object from imported movies array
 */
const addPoster = (movie) => gallery.appendChild(createPoster(movie));

/* function to clear the movie-gallery before a new filter is applied
 * removes each poster from  gallery if not empty
 */
const clearGallery = function(name) {
  const galleryItems = Array.from(
    document.getElementsByClassName("gallery-item")
  );
  console.log(galleryItems.length);

  galleryItems.length > 0
    ? galleryItems.forEach((item) => gallery.removeChild(item))
    : console.warn(
      `WARNING: (disregard if first call of clearGallery function)
       Cannot clear movie-gallery of ${name}-movies, there are no child-elements to remove`,
      gallery.children
    );
};

/* function to filter movies by date,
 * this can be used for the latest movies filter
 *
 * - filter array argument based on date arguments/ or defaults
 * - loop through the sorted array and call addPoster() on each element
 *
 * @param {array} - the imported movies array
 * @param {string or int} - date, from year (of release) default: 1890
 * @param {string, int or null} - date, until year (of release) default: current year
 *   OR null: only movies matching dateFrom are filtered
 * if no argument(s) provided for date(s), default values are used
 */
const filterMoviesByDate = (
  moviesArr,
  dateFrom = 1890,
  dateUntil = currentYear
) =>
  // if dateUntil is null, dateFrom serves as exact year and only movies
  // from that year will be added to the gallery
  dateUntil === null
    ? moviesArr
      .filter(
        (movie) =>
          Number(movie.year) === Number(dateFrom) && movie.type === "movie"
      )
      .forEach((movie) => addPoster(movie))
    : // otherwise adds movies within input/default range to gallery
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
 *
 * - filterMoviesByDate - with default params.
 * - show warning for dev purposes if no checked attr.
 *
 * IMPORTANT: call function in global context to have
 * movie finder show all movies by default
 */
const showAllMovies = (moviesArr) => {
  const filterForAll = document.getElementById("all-movies");

  filterForAll.checked
    ? filterMoviesByDate(moviesArr)
    : console.warn("showAllMovies:", filterForAll.checked);
};

/* function to add the posters of each movie
 * that fits the selected filter to the movie-gallery
 *
 * @param {array} - the imported movies array
 * @param {string} - phrase, value of selected radio input
 *
 * (called by the anonym event handler on radio-button
 * change event)
 */
const buildFilteredGallery = function(moviesArr, phrase) {
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
    case "all-movies":
      showAllMovies(moviesArr);
  }
};

//FUNCTIONS FOR SEARCH

/* function to search for movies by checking if
 * search bar input-value is part of the movie title
 * @param {array} - the imported movies array
 * @param {string} - user input from search
 *
 * - calls filterMoviesByName function
 * - calls showNoResultFeedback function
 */
const searchInMovieTitle = function(moviesArr, input) {
  clearGallery(input);

  filterMoviesByName(moviesArr, input.toLowerCase());
  showNoResultFeedback();
};

/* function to add feedback message to the gallery if no movie matches
 * the search terms
 *
 * - create feedback element
 * - check for gallery size
 * - if gallery is empty:
 *   show all movies and feedback message above posters grid
 */
const showNoResultFeedback = function() {
  // create feedback element with feedback message
  const noResultFeedback = document.createElement("p");
  const filterForAll = document.getElementById("all-movies");
  const galleryContent = document.getElementsByClassName("gallery-item");

  noResultFeedback.classList.add("feedback", "gallery-item");
  noResultFeedback.innerHTML = `Sorry, but no movie matches your search criteria.`;

  if (!galleryContent.length) {
    // show all movies if no movie matches search terms
    filterForAll.checked = true;
    showAllMovies(movies);

    // show feedback message
    gallery.prepend(noResultFeedback);
  }
};

/* function that calls the appropriate search function based on the
 * input type
 *
 * - check if search input is text
 * - check in case input is string of digits that if it is a valid date:
 *   if not, search in title (could be improved for movie titles which are
 *   valid as release date as well to filter for both title/date.
 *   i.e. "1984" - I didn't do it however...)
 *
 * this function handles key-press and click events on search
 */

const searchHandler = function() {
  const searchInput = searchBar.value.trim();
  const dateRegEx = /(\d{4})+/g; //to be used with date search function
  const textRegEx = /[a-z]+/gi;
  const inputHasText = textRegEx.test(searchInput);
  const notValidDate = searchInput
    .match(/\d+/g)
    .every((num) => num > currentYear || num < 1890);
  console.log("search input is not a movie date:", notValidDate);

  inputHasText || notValidDate
    ? searchInMovieTitle(movies, searchInput)
    : console.warn("search input is not for title");
};

// FUNCTIONS FOR EVENT LISTENERS

/* function to add event listener to each radio button
 * loop through an array of filter-radio-button elements
 * add change event to each
 * use buildFilteredGallery() as event handler */
const addListenerToFilterButtons = function() {
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
const addListenersToSearch = function() {
  searchBar.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      searchHandler();
    }
  });

  searchButton.addEventListener("click", searchHandler);
};

// CALL FUNCTIONS
showAllMovies(movies);
addListenerToFilterButtons();
addListenersToSearch();
