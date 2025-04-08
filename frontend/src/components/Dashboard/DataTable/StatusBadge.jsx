import { FaRegCircleCheck } from "react-icons/fa6";
import { PiSpinnerBold } from "react-icons/pi";


const StatusBadge = ({ status }) => {
  const isDone = status === "Done";
  const isLoading = status === "In Process";

  return (
    <div className="inline-flex items-center gap-2 px-2 py-1 rounded-md text-xs font-bold border border-testingColorGrey text-testingColorSubtitle min-w-[100px]">
      {isDone && <FaRegCircleCheck className="text-green-500" />}
      {isLoading && <PiSpinnerBold className="text-yellow-300" />}
      <span>{status.charAt(0).toUpperCase() + status.slice(1)}</span>
    </div>
  );
};

export default StatusBadge;
