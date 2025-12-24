import { useAuthStore } from "../../../stores/useAuthStore";

export default function UserDbHome() {
  const { user } = useAuthStore();
  return (
    <>
      <h1 className="text-xl">
        Good Morning user!{" "}
        <span className="font-semibold">{user?.displayName}</span>
      </h1>
    </>
  );
}
