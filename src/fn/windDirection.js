/**
 * Directions and angles dictionary
 * @type Object[]
 * @constant
 * @private
 */

const directions = [
  {
    angleMin: 0,
    angleMax: 90,
    direction: 'NE',
  },
  {
    angleMin: 90,
    angleMax: 180,
    direction: 'SE',
  },
  {
    angleMin: 180,
    angleMax: 270,
    direction: 'SW',
  },
  {
    angleMin: 270,
    angleMax: 360,
    direction: 'NW',
  },
];

/**
 * Obtain wind direction for a given angle
 * @function
 * @public
 * @see https://api-docs.airvisual.com/?version=latest#detailed-response-example
 *
 * @param {Number} angle
 * @returns {String}
 */

export default function windDirection(angle) {
  switch (angle) {
  case 0:
  case 360:
    return 'N';
  case 90:
    return 'E';
  case 180:
    return 'S';
  case 270:
    return 'W';
  default:
    return directions.filter(
      d => angle > d.angleMin && angle < d.angleMax
    )[0].direction;
  }
}
