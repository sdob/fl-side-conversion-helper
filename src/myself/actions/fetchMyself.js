import axios from 'axios';
import renownIDs from '../../factions/renown';
import favourIDs from '../../factions/favours';
import { MYSELF_RECEIVED } from '../types';
import { API_URL_BASE } from '../../constants';

export default function fetchMyself() {
  return (dispatch) => {
    const url = `${API_URL_BASE}/api/character/myself`;
    return axios.get(url)
      .then(({ data }) => {
        // Destructure the incoming JSON
        const social = data.possessions.find(el => el.name === 'Contacts').possessions;

        // Build the Renown and Favours object
        const payload = { renown: reduce(renownIDs), favours: reduce(favourIDs) };

        // Dispatch the action
        dispatch({ type: MYSELF_RECEIVED, payload });

        function reduce(obj) {
          return Object.keys(obj).reduce((acc, k) => {
            const match = social.find(el => el.id === Number(obj[k]));
            return {
              ...acc,
              [k]: match ? match.level : 0,
            };
          }, {});
        }
      });
  };
}