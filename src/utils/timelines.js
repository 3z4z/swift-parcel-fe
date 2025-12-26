import acceptedImg from "../assets/order-timeline/accepted.png";
import pickedImg from "../assets/order-timeline/picked.png";
import transitImg from "../assets/order-timeline/transit.png";
import deliveryImg from "../assets/order-timeline/delivery.png";
import deliveredImg from "../assets/order-timeline/delivered.png";

export const timeLines = [
  { key: "accepted", icon: acceptedImg, title: "Accepted" },
  { key: "picked", icon: pickedImg, title: "Picked" },
  { key: "transit", icon: transitImg, title: "In Transit" },
  { key: "delivery", icon: deliveryImg, title: "Out for delivery" },
  { key: "delivered", icon: deliveredImg, title: "Delivered" },
];
