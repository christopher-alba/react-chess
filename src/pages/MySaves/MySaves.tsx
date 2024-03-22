import { FC, useEffect, useState } from "react";
import { MongoDBMatches } from "../../types/gameTypes";
import { getSavedGames } from "../../api/savedGames";
import { useAuth0 } from "@auth0/auth0-react";
import moment from "moment";
import { useNavigate } from "react-router-dom";

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
    <div>
      {savedGames?.map((x) => (
        <div
          onClick={() => {
            navigate("/offline", {
              state: {
                presetStates: JSON.parse(x.gameStatesJson),
              },
            });
          }}
        >
          {moment(x.modifiedOn).local().format("LLL")}, {x.gameId}
        </div>
      ))}
    </div>
  );
};

export default MySaves;
