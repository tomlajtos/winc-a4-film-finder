/* WINC FILM FINDER
 * Assignment film finder
 * Functionalities:
 * - display a movie poster as gallery
 * - filter movies (latest, avanger, x-men, princess, batman)
 *   1 category at a time with radio buttons
 * - clicking the poster opens coresponding imdb page
 * BONUS feature(s):
 * - search field to search by movie name */

import { movies } from "./movie-database.js";

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

/* function to add poster to the #poster-galery element
 * @param {object} movie object from imported movies array */
const addPoster = function(movie) {
  const galery = document.getElementById("movie-galery");
  galery.appendChild(createPoster(movie));
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
 * If no argument(s) provided for date(s), default values are used
 * steps:
 * - filter array argument based on date arguments/ or defaults
 * - loop through the sorted array and call addPoster() on each element */
const filterMoviesByName = (moviesArr, phrase) =>
  moviesArr
    .filter((movie) => movie.title.includes(phrase))
    .forEach((movie) => addPoster(movie));
