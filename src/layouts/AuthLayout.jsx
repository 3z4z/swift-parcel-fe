import { Outlet } from "react-router";

export default function AuthLayout() {
  return (
    <div className="grid lg:grid-cols-2 w-full items-center bg-white">
      <header className="text-center">
        <p className="text-2xl font-bold">
          Welcome to
          <span className="text-primary ms-2">SwiftParcel</span>
        </p>
      </header>
      <main className="bg-base-300 min-h-full flex items-center justify-center">
        <Outlet />
      </main>
    </div>
  );
}
