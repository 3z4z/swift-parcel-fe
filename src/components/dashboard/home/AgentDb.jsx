import { useAuthStore } from "../../../stores/useAuthStore";

export default function AgentDbHome() {
  const { user } = useAuthStore();
  return (
    <>
      <h1 className="text-xl">
        Good Morning Agent!{" "}
        <span className="font-semibold">{user?.displayName}</span>
      </h1>
    </>
  );
}
