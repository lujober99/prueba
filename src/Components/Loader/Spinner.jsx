import ClipLoader from "react-spinners/ClipLoader";

const Spinner = () => (
  <div style={{
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#fff"
  }}>
    <ClipLoader color="#ff3d00" size={60} />
  </div>
);

export default Spinner;