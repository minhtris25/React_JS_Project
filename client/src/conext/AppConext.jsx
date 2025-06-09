import axios from 'axios';
import { createContext,useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser, useAuth } from '@clerk/clerk-react';  

axios.defaults.baseURL = import.meta.env.VITE_API_URL;

const AppConext = createContext();


export const AppProvider = ({ children }) => {
    const currency = import.meta.env.VITE_CURRENCY || '$';
    const navigate = useNavigate();
    const { user } = useUser();
    const { getToken } = useAuth();

    const [isOwner, setIsOwner] = useState(false);
    const [showHotelReg, setShowHotelReg] = useState(false);
    const [searchedCities, setSearchedCities] = useState([]);

    const fetchUser = async () => {
        try {
            const {data} = await axios.get('/api/user', {headers: { Authorization: `Bearer ${await getToken()}`}})
            if (data.success) {
                setIsOwner(data.role === 'hotelOwner');
                setSearchedCities(data.recentSearchedCities)
        }else {
            setTimeout(() => {
                fetchUser();
            }, 5000) 
        }

    }catch (error) {

        }
            

    const value = {
        currency,
        navigate,
        user,
        getToken,
        isOwner,
        setIsOwner,
        axios,
        showHotelReg,
        setShowHotelReg
    }


    return (
        <AppConext.Provider value={value}>
        {children}
        </AppConext.Provider>
    )
}
}
export const useAppContext = () =>  useContext(AppConext);