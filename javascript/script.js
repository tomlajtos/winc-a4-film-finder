//TODO
// - rewrite filterMoviesByDate function so it can use range input as well @param --> string + includes?
// - change movie to film in index styles and script
// - implement search functionality
// - add show all options to filtering

/* eslint-disable no-unused-vars */

/* WINC FILM FINDER
 * Assignment film finder
 * Functionalities:
 * - display a movie poster as gallery
 * - filter movies (latest, avenger, x-men, princess, batman)
 *   1 category at a time with radio buttons
 * - clicking the poster opens corresponding imdb page
 * BONUS feature(s):
 * - search field to search by movie name */

import { movies } from "./movie-database.js";

/* global variable for movie-gallery element
 * to use with addPoster and clearGallery functions */
const gallery = document.getElementById("movie-gallery");

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
  poster.classList.add("movie-poster");
  return poster;
};

/* function to add poster to the #poster-gallery element
- * @param {object} movie object from imported movies array */
const addPoster = (movie) => gallery.appendChild(createPoster(movie));
/* functions clear the movie-gallery before a new filter is applied
 * removes each poster from  gallery if not empty */
const clearGallery = function(name) {
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
        Number(movie.year) <= Number(dateUntil)
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
    .filter((movie) => movie.title.toLowerCase().includes(phrase))
    .forEach((movie) => addPoster(movie));
};

/* function to add the posters of each movie
 * that fits the selected filter to the movie-gallery
 * @param {array} - the imported movies array
 * @param {string} - phrase, value of selected radio input
 * (event handler on radio-button change event)
 * */
const buildFilteredGallery = function(moviesArr, phrase) {
  clearGallery(phrase);
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
    //   add "show all" option?
    //   default:
    //     filterMoviesByDate(moviesArr);
  }
};

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

addListenerToFilterButtons();
