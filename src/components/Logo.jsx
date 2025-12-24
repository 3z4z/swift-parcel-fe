import logo from "../assets/box.png";

export default function LogoComponent() {
  return (
    <div className="flex gap-3 items-center">
      <figure className="w-8 h-8">
        <img src={logo} alt="" className="object-contain" />
      </figure>
      <p className="font-bold">
        Swift<span className="text-primary">Parcel</span>
      </p>
    </div>
  );
}
