import { createContext, useEffect, useState } from "react";
import PropTypes from 'prop-types'; // Import prop-types
import { toast } from "react-toastify";
import axios from 'axios'
import { useNavigate } from "react-router-dom";

export const AppContext = createContext();

const AppContextProvider = (props) => {
    const [user, setUser] = useState(false); // Initial state is false, means user is not logged in
    const [showLogin, setShowLogin] = useState(false);
    const [token, setToken] = useState(localStorage.getItem('token'));

    const [credit, setCredit] = useState(false);

    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const navigate = useNavigate()

    const loadCreditsData = async()=>{
        try{

            const {data} = await axios.get(backendUrl+'/api/user/credits',
               {headers:{token}})

               if(data.success)
               {
                setCredit(data.credits)
                setUser(data.user)
               }

        }catch(error)
        {
            console.log(error)
            toast.error(error.message)
        }
    }

    const generateImage = async (prompt)=>{
        try{
            const {data}= await axios.post(backendUrl +'/api/image/generate-image',
                {prompt},{headers:{token}})
            if(data.success)
            {
                loadCreditsData()
                return data.resultImage
            }else{
                toast.error(data.message)
                loadCreditsData()
                if(data.creditBalance===0)
                {
                    navigate('/buy')
                }
            }
        }catch (error)
        {
            toast.error(error.message)
        }
    }


    const logout = () =>{
        localStorage.removeItem('token');
        setToken('')
        setUser(null)
    }

    useEffect(()=>{
        if(token)
        {
            loadCreditsData()
        }
    },[token])

    const value = {
        user,
        setUser,
        showLogin,
        setShowLogin,
        backendUrl,
        token,
        setToken,
        credit,
        setCredit,
        loadCreditsData,
        logout,
        generateImage
    };

    return (
        <AppContext.Provider value={value}>
            {props.children} {/* Renders children passed to this component */}
        </AppContext.Provider>
    );
};

// Add prop types validation
AppContextProvider.propTypes = {
    children: PropTypes.node.isRequired, // Validate that 'children' prop is required and is a React node
};

export default AppContextProvider;
