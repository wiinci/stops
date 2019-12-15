/**
 * Convert Celsius temperature scale to Farenheit
 * @function
 * @public
 *
 * @param {Number} celsius
 * @returns {Number}
 */

export default function getCtoF(celsius) {
  return Math.round((celsius * 9) / 5 + 32);
}
