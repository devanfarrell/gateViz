import { FETCH_CIRCUIT_LIST  } from '../types';

export default (state = null, action) => {
	switch (action.type) {
        case FETCH_CIRCUIT_LIST:
			return action.payload || false;
		default:
			return state;
	}
}