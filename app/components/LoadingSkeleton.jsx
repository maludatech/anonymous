import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

const LoadingSkeleton = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <h2 className="text-5xl animate-spin text-gray-500">
        <FontAwesomeIcon icon={faSpinner} />
      </h2>
    </div>
  );
};

export default LoadingSkeleton;
