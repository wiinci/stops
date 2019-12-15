/**
 * Capitalize a given string
 * @function
 * @public
 *
 * @param {String} str
 * @returns {String}
 */

export default function capitalize(str) {
  return str
    .trim()
    .split(' ')
    .map(s => s.replace(s[0], s[0].toUpperCase()))
    .join(' ');
}
