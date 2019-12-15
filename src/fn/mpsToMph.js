/**
 * Convert meters per second (mps) to miles per hour (mph)
 * @function
 * @public
 *
 * @param {Number} mps
 * @returns {Number}
 */

export default function getMph(mps) {
  return Math.round(mps * 2.237);
}
