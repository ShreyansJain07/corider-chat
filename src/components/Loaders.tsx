import { SyncLoader } from "react-spinners"; // Assuming you're using react-spinners library

const loaderStyle = {
    borderColor: "lightgray",
    margin:"10px 0"
  };

  const Loader = () => <SyncLoader style={loaderStyle} color="#007bff" />;
  
export default Loader;