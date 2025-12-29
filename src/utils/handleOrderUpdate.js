import Swal from "sweetalert2";

export const handleOrderUpdate = async (
  axios,
  refetch,
  order,
  status,
  details,
  location
) => {
  // To get dynamic locations, this call is needed.
  // const { lat, lng } = await getGeoLocation();
  const filteredStatus = status?.split("-").join(" ");

  Swal.fire({
    title: `Mark as ${filteredStatus}?`,
    text: `This parcel will be marked as ${filteredStatus}!`,
    icon: "info",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Confirm",
  }).then(async (result) => {
    if (result.isConfirmed) {
      const updateOrder = {
        parcelMovementStatus: status,
        trackingId: order.trackingId,
        details,
        location: location || order.location,
      };
      await axios.patch(`/parcels/${order._id}`, updateOrder);
      refetch();
      Swal.fire({
        title: "Status updated!",
        text: `Parcel status changed to ${filteredStatus}.`,
        icon: "success",
      });
    }
  });
};
