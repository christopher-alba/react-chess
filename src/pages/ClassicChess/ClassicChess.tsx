import { FC } from "react";
import OnlineChess from "./components/OnlineChess/OnlineChess";
import OfflineChess from "./components/OfflineChess/OfflineChess";

const ClassicChess: FC<{ onlineMode: boolean }> = ({ onlineMode }) => {
  return <>{onlineMode ? <OnlineChess /> : <OfflineChess />}</>;
};

export default ClassicChess;
