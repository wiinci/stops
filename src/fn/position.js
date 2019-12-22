export default function position() {
  const options = {
    enableHighAccuracy: false,
    timeout: 9 * 1000, // ms
    maximumAge: 2 * 60 * 1000, // ms
  };

  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported in your browser.'));
    } else {
      navigator.geolocation.getCurrentPosition(
        location => {
          resolve([location.coords.latitude, location.coords.longitude]);
        },
        error => {
          reject(
            new Error(`${error.message}: Unable to retrieve your location`)
          );
        },
        options
      );
    }
  });
}
