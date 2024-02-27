import axios from 'axios';
import useAuth from './useAuth';

const useRefreshToken = () => {

    const { setAuth } = useAuth();

    const refresh = async () => {
        const response = await axios.get('/refresh', {
            withCredentials: true
        });
        setAuth(prev => {
            // console.log(JSON.stringify(prev));
            // console.log(response.data.accessToken);
            return { ...prev, access_token: response.data.accessToken, refresh_token: response.data.refresh_token }
        });
        return response.data.access_token;
    }

    return refresh;
};

export default useRefreshToken;