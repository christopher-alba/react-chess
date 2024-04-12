import { FC, useEffect, useState } from "react";
import { MongoDBMatches } from "../../types/gameTypes";
import { getSavedGames } from "../../api/savedGames";
import { useAuth0 } from "@auth0/auth0-react";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import OfflineChessBoard from "../ClassicChess/components/OfflineChess/OfflineChessBoard";
import SpectatorBoard from "../ClassicChess/components/OfflineChess/SpectatorBoard";
import { Container } from "../../components/container";
import { SaveWrapper } from "./styled";

const MySaves: FC = () => {
  const [savedGames, setSavedGames] = useState<MongoDBMatches>();
  const { getIdTokenClaims, getAccessTokenSilently } = useAuth0();
  const navigate = useNavigate();
  const getGames = async () => {
    const token = await getAccessTokenSilently();
    const tokenClaims = await getIdTokenClaims();
    const savedGames = await getSavedGames(tokenClaims?.sub, token);
    if (savedGames) {
      setSavedGames(savedGames.data);
    }
  };
  useEffect(() => {
    getGames();
  }, []);
  return (
    <Container style={{ display: "flex", flexWrap: "wrap" }}>
      {savedGames?.map((x, index) => (
        <SaveWrapper
          onClick={() => {
            navigate("/offline", {
              state: {
                presetStates: JSON.parse(x.gameStatesJson),
              },
            });
          }}
        >
          <div>{moment(x.modifiedOn).local().format("LLL")}</div>
          <hr />
          <div>
            <SpectatorBoard
              key={index}
              presetStates={JSON.parse(x.gameStatesJson)}
            />
          </div>
        </SaveWrapper>
      ))}
    </Container>
  );
};

export default MySaves;
