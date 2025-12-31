export const deliveryLocation = (deliveryCity, locations) => {
  const deliveryHub = locations?.find((d) => d?.district === deliveryCity);
  return { lat: deliveryHub?.latitude, lng: deliveryHub?.longitude };
};
