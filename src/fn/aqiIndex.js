/**
 * Air Quality Index categories
 * @type Object{}
 * @constant
 * @private
 */

const categories = [
  {
    color: 'green',
    condition: 'Good',
    rangeMax: 50,
    rangeMin: 0,
  },
  {
    color: 'yellow',
    condition: 'Moderate',
    rangeMax: 100,
    rangeMin: 51,
  },
  {
    color: 'orange',
    condition: 'Unhealty for sensitive groups',
    rangeMax: 150,
    rangeMin: 101,
  },
  {
    color: 'red',
    condition: 'Unhealthy',
    rangeMax: 200,
    rangeMin: 151,
  },
  {
    color: 'purple',
    condition: 'Very unhealthy',
    rangeMax: 300,
    rangeMin: 201,
  },
  {
    color: 'maroon',
    condition: 'Hazardous',
    rangeMax: Infinity,
    rangeMin: 301,
  },
];

/**
 * Obtain AQI category for a given PM2.5 pollution value
 * @function
 * @public
 *
 * @param {Number} pollution
 * @returns {Object}
 */

export default function aqiIndex(pollution) {
  return categories.filter(
    category => pollution >= category.rangeMin && pollution < category.rangeMax
  )[0];
}
