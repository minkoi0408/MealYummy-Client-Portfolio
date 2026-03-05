import { callAPI } from './axios.client.ts';
import { METHOD } from '../constants/method.api.constant.ts';

const tagAPIRoutes = {
    default: "/tags",
};

export { tagAPI }

export interface Tag {
    id: string;
    name: string;
}

const tagAPI = {
    getAll: (params?: { page?: number; size?: number }) =>
        callAPI(METHOD.GET, tagAPIRoutes.default, undefined, params), // Type assertion handled in usage
}