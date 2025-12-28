export default function useParcelProgress(currentStatus) {
  const stages = {
    accepted: ["accepted", "assigned"],
    picked: ["picked"],
    transit: ["to-central", "in-central", "to-delivery-hub", "at-delivery-hub"],
    delivery: ["assigned-to-deliver", "going-to-receiver"],
    delivered: ["delivered"],
  };

  const checkStatus = (stage) => {
    const stageKeys = Object.keys(stages);
    const targetIndex = stageKeys.indexOf(stage);
    const currentIndex = stageKeys.findIndex((key) =>
      stages[key].includes(currentStatus)
    );

    return {
      isCompleted: currentIndex > targetIndex,
      isActive: currentIndex === targetIndex,
    };
  };

  return { checkStatus };
}
