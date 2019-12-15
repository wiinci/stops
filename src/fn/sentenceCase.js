/**
 * Sentence cases a given string
 * @function
 * @public
 *
 * @param {String} str
 * @returns {String}
 */

export default function toSentenceCase(str) {
  return str.trim().replace(str[0], str[0].toUpperCase());
}
