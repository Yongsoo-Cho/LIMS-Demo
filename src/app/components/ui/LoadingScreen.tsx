import { GridLoader } from "react-spinners";

export default function LoadingScreen(props: { message: string }) {
  const override = {
    display: "block",
    margin: "0 auto",
    //color: '#155dfc',
  };

  return (
    // <div className="flex justify-center items-center h-screen w-screen bg-white text-gray-600 text-lg">
    //   Loading...
    // </div>
    <div className="z-999 fixed top-0 left-0 h-screen w-screen backdrop-blur-lg flex flex-col justify-center items-center">
      <GridLoader cssOverride={override} />
      <span className="p-4">{props.message}</span>
    </div>
  );
}
