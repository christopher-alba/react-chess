import { FC } from "react";
import OfflineChessBoard from "./OfflineChessBoard";
import Promotion from "../Promotion/Promotion";
import { useLocation } from "react-router-dom";

const OfflineChess: FC = () => {
  const location = useLocation();
  return (
    <>
      <Promotion online={false} />
      <OfflineChessBoard presetStates={location.state?.presetStates} />
    </>
  );
};

export default OfflineChess;
