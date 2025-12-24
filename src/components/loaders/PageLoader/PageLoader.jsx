import "./PageLoader.css";
export default function PageLoader() {
  return (
    <div className="fixed top-0 left-0 h-dvh w-full flex items-center justify-center">
      <div className="loader"></div>
    </div>
  );
}
