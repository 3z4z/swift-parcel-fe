import "./PageLoader.css";
export default function PageLoader() {
  return (
    <div className="fixed top-0 left-0 h-dvh w-full flex items-center justify-center bg-primary/50 z-99">
      <div className="loader"></div>
    </div>
  );
}
