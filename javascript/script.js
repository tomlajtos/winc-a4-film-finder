//TODO
// - implement search functionality --> DONE
// - add search/filter result info in footer - only number of movies?
// - add "show all movies" option to filtering --> DONE

/* eslint-disable no-unused-vars */

/* WINC FILM FINDER
 * Assignment film finder
 * Functionalities:
 * - display movie posters as a gallery
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
const searchBar = document.getElementById("search-bar");
const searchButton = document.getElementById("search-button");
const filterButtons = document.getElementsByClassName("filter-button");
const filterForAll = document.getElementById("all-movies");
const currentYear = new Date().getFullYear();
const noResultMessage = "Sorry, but no movie is found based on your input.";
const noInputMessage = "Please provide some search criteria.";

// FUNCTIONS FOR FILTERING

/*
 * function to query the gallery element
 * (using function instead of an object+methods, because the dynamic nature of the
 * movie gallery)
 * @param {string} :
 *  "content" -> returns an array of children elements
 *  "size" -> returns the length of the HTMLCollection of children elements
 *  "movies" -> returns an array of the "movie-posters"
 *  "movieNum" -> returns the number of "movie-posters"
 */
const getMovieGallery = function(request) {
  const gallery = document.getElementById("movie-gallery");
  const movies = document.getElementsByClassName("movie-poster");

  switch (request) {
    case "content":
      return Array.from(gallery.children);
    case "size":
      return gallery.children.length;
    case "movies":
      return Array.from(movies);
    case "movieNum":
      return movies.length;
    default:
      return gallery;
  }
};

/* function to create a .movie-poster element
 * @param {object} movie object from imported movies array
 * @return {object} html element, poster
 */
const createPoster = function(movie) {
  const imdbLink = `https://www.imdb.com/title/${movie.imdbID}/`;
  //create elements
  const poster = document.createElement("li");
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
  posterImage.setAttribute("alt", `Movie Poster for: ${movie.title}`);

  // add .movie-poster class to poster-div
  poster.classList.add("movie-poster", "gallery-item");
  return poster;
};

/* function to add poster to the #poster-gallery element
 * @param {object} movie object from imported movies array
 */
const addPoster = (movie) => getMovieGallery().appendChild(createPoster(movie));

/* function to clear the movie-gallery before a new filter is applied
 * removes each poster from  gallery if not empty
 */
const clearGallery = function() {
  // empty?
  getMovieGallery("size")
    ? getMovieGallery("content").forEach((item) =>
      getMovieGallery().removeChild(item)
    )
    : console.warn(
      `WARNING: Cannot clear movie-gallery, there are no child-elements to remove`,
      getMovieGallery("content")
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
 *                          (no movie on IMDB is older than 1890)
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
  filterForAll.checked
    ? filterMoviesByDate(moviesArr)
    : console.warn("WARNING: showAllMovies checked -", filterForAll.checked);
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
  clearGallery();
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
      // clearGallery("buildFilteredGallery / case-all");
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
 * - calls showFeedbackMessage function
 */
const searchInMovieTitle = function(moviesArr, input) {
  clearGallery();

  filterMoviesByName(moviesArr, input.toLowerCase());

  // reset radio-buttons to unchecked
  Array.from(filterButtons).forEach((button) => (button.checked = false));

  showFeedbackMessage(noResultMessage, input);
};

/* function to search for movies based on their release date
 * @param {array} - the imported movies array
 * @param {string} - user input from search
 * - get search input
 *  - if no input -> show feedback
 * - remove duplicate dates
 *   sort dates
 * - if 2 or more dates and no "-": display movies released in those years
 * - if 2 dates with "-" in between: display movies in date-range
 * - if 1 date: display movies released that specific year
 * - if no result -> show feedback
 */
const searchMoviesByDate = function(moviesArr, input) {
  const dateRegEx = /(\d{4})+/g; // matches 4-digit numbers in search input

  clearGallery();

  // get rid of date duplicates [split]->{Set}->[Arr]
  const dateInputArr = Array.from(new Set(input.match(dateRegEx))).sort(
    (a, b) => a - b
  );

  // check if input is a time period (yyyy - yyyy)
  const isPeriodInput = input.includes("-");

  //filter movies based on input
  if (dateInputArr.length >= 2 && !isPeriodInput) {
    dateInputArr.forEach((date) => filterMoviesByDate(moviesArr, date, null));
  } else if (isPeriodInput) {
    filterMoviesByDate(moviesArr, dateInputArr[0], dateInputArr[1]);
  } else {
    filterMoviesByDate(moviesArr, dateInputArr[0], null);
  }

  // reset radio-buttons to unchecked
  Array.from(filterButtons).forEach((button) => (button.checked = false));

  showFeedbackMessage(noResultMessage, input);
};

/* function to add feedback message to the gallery if no movie matches
 * the search terms
 *
 * - create feedback element
 * - check for gallery size
 * - if gallery is empty:
 *   show all movies and feedback message above posters grid
 */
const showFeedbackMessage = function(message, input) {
  // create feedback element with feedback message
  const feedback = document.createElement("p");

  feedback.classList.add("feedback", "gallery-item");
  feedback.setAttribute("role", "alert");
  feedback.innerHTML = message;

  if (!getMovieGallery("size") || !input.length) {
    if (getMovieGallery("size")) {
      clearGallery();
    }

    // show all movies if no movie matches search terms
    filterForAll.checked = true;
    showAllMovies(movies);

    // show feedback message
    gallery.prepend(feedback);
  }
};

/* function that calls the appropriate search function based on the
 * input type
 *
 * - check if search input is text
 * - in case input is string of numbers, check if it is a valid release date:
 *   if not, search in title (could be improved for movie titles which are
 *   valid as release date as well to filter for both title/date.
 *   i.e. "1984" - I didn't do it however...)
 *
 * this function handles key-press and click events on search
 */
const searchHandler = function() {
  const searchInput = searchBar.value.trim();
  const textRegEx = /[a-z]+/gi;
  const numRegEx = /\d+/g;
  // variables for regex test (for readability and sanity (regex -g keeps state))
  const inputHasText = textRegEx.test(searchInput);
  const inputHasNum = numRegEx.test(searchInput);

  // input validation + function calls
  !searchInput.length // show feedback if no input
    ? showFeedbackMessage(noInputMessage, searchInput)
    : inputHasText
      ? searchInMovieTitle(movies, searchInput)
      : // if no text but numbers, check if it is not a valid release date
      inputHasNum &&
        searchInput
          .match(numRegEx)
          .every((elem) => Number(elem) > currentYear || Number(elem) < 1890)
        ? searchInMovieTitle(movies, searchInput)
        : // search by date if input is valid release date
        searchMoviesByDate(movies, searchInput);
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
