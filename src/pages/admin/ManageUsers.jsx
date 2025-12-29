import { useQuery } from "@tanstack/react-query";
import useAxios from "../../hooks/useAxios";
import toast from "react-hot-toast";
import { useState } from "react";
import DbPageTitle from "../../components/dashboard/PageTitle";

export default function ManageUsersPage() {
  const axios = useAxios();
  const [isUpdating, setIsUpdating] = useState(false);
  const {
    data: users,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await axios.get("/users");
      return res.data;
    },
  });
  const updateStatus = async (user, status) => {
    setIsUpdating(true);
    const res = await axios.patch(`/users/${user._id}`, { status });
    toast.success(res?.data?.message || "Done!");
    refetch();
    setIsUpdating(false);
  };
  return (
    <>
      <DbPageTitle title={"Manage all users"} />
      <div className="overflow-x-auto rounded-box border border-base-content/5 bg-white shadow">
        <table className="table">
          <thead className="bg-base-200">
            <tr>
              <th>Sl No.</th>
              <th>Name</th>
              <th>Role</th>
              <th>Preferred City</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={5}>Loading...</td>
              </tr>
            ) : (
              users.map((u, i) => (
                <tr key={i}>
                  <td className="font-bold">{i + 1}</td>
                  <td>
                    <p className="font-medium">{u.name}</p>
                    <p className="text-neutral/70">{u.email}</p>
                  </td>
                  <td>
                    <span
                      className={`badge badge-sm capitalize font-semibold ${
                        u.role === "admin"
                          ? "badge-neutral"
                          : u.role === "agent"
                          ? "badge-secondary"
                          : "badge-primary"
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td>
                    <p className="text-neutral">{u.preferredCity}</p>
                  </td>
                  <td>
                    <span
                      className={`badge badge-sm font-semibold capitalize ${
                        u.status === "pending"
                          ? "badge-warning"
                          : u.status === "rejected"
                          ? "badge-error"
                          : "badge-success"
                      }`}
                    >
                      {u.status}
                    </span>
                  </td>
                  <td>
                    {u.role !== "admin" && (
                      <div className="flex gap-2">
                        {u.status === "approved" ? (
                          <button
                            disabled={isUpdating}
                            className="btn btn-sm btn-soft btn-error"
                            onClick={() => updateStatus(u, "rejected")}
                          >
                            Reject
                          </button>
                        ) : (
                          <button
                            disabled={isUpdating}
                            className="btn btn-sm btn-soft btn-success"
                            onClick={() => updateStatus(u, "approved")}
                          >
                            Approve
                          </button>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
