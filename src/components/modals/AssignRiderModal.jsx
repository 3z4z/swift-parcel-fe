import { useQuery } from "@tanstack/react-query";
import useAxios from "../../hooks/useAxios";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

export default function AssignRiderModal({
  locations,
  assignRiderModalRef,
  selectedParcel,
  refetch,
}) {
  const axios = useAxios();
  const [selectedAgent, setSelectedAgent] = useState(null);

  const { data: agents = [], isLoading } = useQuery({
    queryKey: ["users", "agent"],
    queryFn: async () => {
      const res = await axios.get("/users?role=agent");
      return res.data;
    },
  });

  const filteredAgents = agents.filter((agent) => {
    if (selectedParcel?.parcelMovementStatus === "accepted") {
      return agent.preferredCity === selectedParcel?.pickupDistrict;
    }

    if (selectedParcel?.parcelMovementStatus === "at-delivery-hub") {
      return agent.preferredCity === selectedParcel?.recipientDistrict;
    }

    return false;
  });

  useEffect(() => {
    if (filteredAgents.length > 0 && !selectedAgent) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedAgent(filteredAgents[0]);
    }
  }, [filteredAgents, selectedAgent]);

  const recipientLocation = (district) => {
    const result = locations.find((l) => l.district === district);
    return { lat: result?.latitude, lng: result?.longitude };
  };

  const handleAssignRider = async (status, location, detailBite) => {
    if (!selectedAgent || !selectedParcel) return;

    try {
      const updateData = {
        parcelMovementStatus: status,
        trackingId: selectedParcel.trackingId,
        details: `Parcel has been assigned to ${selectedAgent.name} for ${detailBite}`,
        location: location || selectedParcel.location,
      };

      if (status === "assigned") {
        updateData.pickupRider = {
          riderName: selectedAgent.name,
          riderEmail: selectedAgent.email,
          riderId: selectedAgent._id,
        };
      }
      if (status === "assigned-to-deliver") {
        updateData.deliveryRider = {
          riderName: selectedAgent.name,
          riderEmail: selectedAgent.email,
          riderId: selectedAgent._id,
        };
      }

      console.log("updateData", updateData);

      const res = await axios.patch(
        `/parcels/${selectedParcel._id}`,
        updateData
      );

      if (res.data.modifiedCount === 1) {
        assignRiderModalRef.current.close();
        toast.success("Rider assigned successfully!");
        refetch();
      }
    } catch (err) {
      toast.success(err.response.data.message || "Something went wrong!");
      console.error(err);
    }
  };

  return (
    <dialog ref={assignRiderModalRef} className="modal">
      <div className="modal-box max-w-2xl">
        <h3 className="text-2xl font-bold mb-5">Agents available</h3>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <div className="grid grid-cols-2 gap-4 mt-3">
            {filteredAgents.map((agent) => (
              <label
                key={agent._id}
                className={`p-4 cursor-pointer rounded-2xl border transition-all flex flex-col gap-1
                  ${
                    selectedAgent?._id === agent._id
                      ? "bg-primary border-primary text-white shadow-lg"
                      : "bg-base-200 border-primary/10 text-base-content hover:border-primary/40"
                  }`}
              >
                <input
                  onChange={() => setSelectedAgent(agent)}
                  name="agents"
                  type="radio"
                  checked={selectedAgent?._id === agent._id}
                  value={agent._id}
                  className="hidden"
                />
                <p className="font-bold">{agent.name}</p>
                <p
                  className={`text-sm ${
                    selectedAgent?._id === agent._id
                      ? "text-white/80"
                      : "text-neutral/60"
                  }`}
                >
                  {agent.email}
                </p>
                <div className="mt-2 text-xs uppercase tracking-widest opacity-70">
                  {agent.preferredCity}
                </div>
              </label>
            ))}
            {filteredAgents.length === 0 && (
              <p className="col-span-2 text-center py-10 text-error">
                No agents available in {selectedParcel?.pickupDistrict}
              </p>
            )}
          </div>
        )}
        <div className="modal-action">
          {(() => {
            switch (selectedParcel?.parcelMovementStatus) {
              case "accepted":
                return (
                  <button
                    className="btn btn-primary px-8"
                    onClick={() =>
                      handleAssignRider("assigned", null, "pickup")
                    }
                    disabled={!selectedAgent}
                  >
                    Confirm Assignment
                  </button>
                );
              case "at-delivery-hub":
                return (
                  <button
                    className="btn btn-primary px-8"
                    onClick={() =>
                      handleAssignRider(
                        "assigned-to-deliver",
                        recipientLocation(selectedParcel.recipientDistrict),
                        "delivery"
                      )
                    }
                    disabled={!selectedAgent}
                  >
                    Confirm Assignment
                  </button>
                );
            }
          })()}
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={() => setSelectedAgent(null)}>close</button>
      </form>
    </dialog>
  );
}
