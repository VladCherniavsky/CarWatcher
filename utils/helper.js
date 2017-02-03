/**
 * Created by vlad on 1/23/2017.
 */
/**
 * @module Utils: Helper
 */

/**
 * Convert object to array.
 * @param {Object} obj - The object to be converted.
 * @return {Array} Returns array.
 */
function convertToArray(obj) {
    return Array.prototype.slice.apply(obj);
}

/**
 * Return id from link.
 * Assume that link looks lie this: https://cars.av.by/hyundai/getz/12448300.
 * Last part of the link is id (12448300).
 * @param {String} url - Url.
 * @return {number} Returns id.
 */
function getIdFromUrl(url) {
    return parseInt(url.split('/').reverse()[0]);
}
export {convertToArray};
export {getIdFromUrl};
