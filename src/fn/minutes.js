/**
 * Number of minutes between now and some time in the future
 * @function
 * @public
 *
 * @param {String} timeStr in hh:mm:ss format ("14:43:00")
 * @returns {Number}
 */

export default function minutes(timeStr, timeZone) {
  const now = Date.parse(new Date().toLocaleString('en-US', { timeZone }));
  const time = new Date();
  time.setHours(timeStr.split(':')[0]);
  time.setMinutes(timeStr.split(':')[1]);
  time.setSeconds(timeStr.split(':')[2]);
  return Math.floor((time - now) / (60 * 1000));
}
