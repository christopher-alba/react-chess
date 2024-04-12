import { AxiosResponse } from "axios";
import { axiosInstance } from ".";
import { MongoDBMatch, MongoDBMatches } from "../types/gameTypes";

export const getSavedGames = async (
  auth0UserId: string,
  accessToken: string
): Promise<void | AxiosResponse<MongoDBMatches, any>> => {
  return await axiosInstance
    .get<MongoDBMatches>(`/matches/${auth0UserId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .catch((err) => console.log(err));
};

export const createOrUpdateSavedGame = async (
  match: MongoDBMatch,
  accessToken: string
): Promise<void | AxiosResponse<MongoDBMatch, any>> => {
  return await axiosInstance
    .post<MongoDBMatch>(`/matches/create`, match, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .catch((err) => console.log(err));
};

export const deleteSavedGame = async (
  matchId: string,
  accessToken: string,
  auth0UserId: string
) => {
  await axiosInstance
    .delete(`/matches/${auth0UserId}/${matchId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .catch((err) => console.log(err));
};
