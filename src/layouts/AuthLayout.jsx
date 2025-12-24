import { Outlet } from "react-router";

export default function AuthLayout() {
  return (
    <div className="grid grid-cols-2 min-h-dvh items-center">
      <header className="text-center">
        <p className="text-2xl font-bold">
          Welcome to
          <span className="text-primary ms-2">SwiftParcel</span>
        </p>
      </header>
      <main className="bg-primary min-h-full flex items-center justify-center">
        <Outlet />
      </main>
    </div>
  );
}
