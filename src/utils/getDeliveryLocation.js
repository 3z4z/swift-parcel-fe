export const deliveryLocation = (deliveryCity, locations) => {
  const deliveryHub = locations?.find((d) => d?.district === deliveryCity);
  console.log("locations", locations);
  return { lat: deliveryHub?.latitude, lng: deliveryHub?.longitude };
};
