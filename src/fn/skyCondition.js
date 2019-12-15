/**
 * AirVisual API weather icon index
 * @type Object[]
 * @constant
 * @private
 */

const skies = [
  { identifier: '01d', condition: 'Clear' },
  { identifier: '01n', condition: 'Clear' },
  { identifier: '02d', condition: 'Partly cloudy' },
  { identifier: '02n', condition: 'Partly cloudy' },
  { identifier: '03d', condition: 'Cloudy' },
  { identifier: '03n', condition: 'Cloudy' },
  { identifier: '04d', condition: 'Mostly cloudy' },
  { identifier: '04n', condition: 'Mostly cloudy' },
  { identifier: '09d', condition: 'Showers' },
  { identifier: '09n', condition: 'Showers' },
  { identifier: '10d', condition: 'Showers' },
  { identifier: '10n', condition: 'Showers' },
  { identifier: '11d', condition: 'Thunderstorms' },
  { identifier: '11n', condition: 'Thunderstorms' },
  { identifier: '13d', condition: 'Snow' },
  { identifier: '13n', condition: 'Snow' },
  { identifier: '50d', condition: 'Mist' },
  { identifier: '50n', condition: 'Mist' },
];

/**
 * Obtain sky condition for a given weather data icon in AirVisual API
 * @function
 * @public
 * @see https://api-docs.airvisual.com/?version=latest#detailed-response-example
 *
 * @param {String} icon
 * @returns {String}
 */

export default function skyCondition(icon) {
  return skies.filter(sky => icon === sky.identifier)[0].condition;
}
