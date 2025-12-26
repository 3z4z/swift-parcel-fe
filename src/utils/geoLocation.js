export const getGeoLocation = () => {
  return new Promise((res, rej) => {
    if (!navigator.geolocation) return rej(new Error("Geolocation not found"));

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        res({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      (err) => {
        rej(err);
      }
    );
  });
};
