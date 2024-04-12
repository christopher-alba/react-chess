import { FC, useContext, useEffect, useState } from "react";
import { MongoDBMatches } from "../../types/gameTypes";
import { deleteSavedGame, getSavedGames } from "../../api/savedGames";
import { useAuth0 } from "@auth0/auth0-react";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import SpectatorBoard from "../ClassicChess/components/OfflineChess/SpectatorBoard";
import { Container } from "../../components/container";
import { SaveWrapper } from "./styled";
import { Button } from "../../components/buttons";
import { ThemeContext } from "styled-components";

const MySaves: FC = () => {
  const [savedGames, setSavedGames] = useState<MongoDBMatches>();
  const { getIdTokenClaims, getAccessTokenSilently } = useAuth0();
  const theme = useContext(ThemeContext);
  const navigate = useNavigate();
  const getGames = async () => {
    const token = await getAccessTokenSilently();
    const tokenClaims = await getIdTokenClaims();
    const savedGames = await getSavedGames(tokenClaims?.sub, token);
    if (savedGames) {
      setSavedGames(savedGames.data);
    }
  };

  const deleteSave = async (matchId: string) => {
    const tokenClaims = await getIdTokenClaims();
    const token = await getAccessTokenSilently();
    await deleteSavedGame(matchId, token, tokenClaims?.sub);
    await getGames();
  };

  useEffect(() => {
    getGames();
  }, []);
  return (
    <Container style={{ display: "flex", flexWrap: "wrap" }}>
      {savedGames?.map((x, index) => (
        <SaveWrapper>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {moment(x.modifiedOn).local().format("LLL")}{" "}
            <Button
              $background={theme?.colors.secondary1}
              $textColor={theme?.colors.primary1}
              onClick={async () => await deleteSave(x.gameId)}
            >
              Delete
            </Button>
          </div>
          <hr />
          <div
            style={{ cursor: "pointer" }}
            onClick={() => {
              navigate("/offline", {
                state: {
                  presetStates: JSON.parse(x.gameStatesJson),
                },
              });
            }}
          >
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
