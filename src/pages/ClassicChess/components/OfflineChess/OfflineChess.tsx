import { FC } from "react";
import OfflineChessBoard from "./OfflineChessBoard";
import Promotion from "../Promotion/Promotion";

const OfflineChess: FC = () => {
  return (
    <>
      <Promotion online={false} />
      <OfflineChessBoard />
    </>
  );
};

export default OfflineChess;
