import { createContext, useContext, useEffect, useReducer } from 'react'

export const AuthContext = createContext(null);
export const AuthDispatchContext = createContext(null);

export function AuthProvider({ children }) {

    const [authData, dispatch] = useReducer(
        reducer,
        {
            user:null
        }
    )

    useEffect(()=>{
        const check =async()=>{
            if(sessionStorage.getItem('user') !== null){
                dispatch({type:'change',payload:JSON.parse(sessionStorage.getItem('user'))})
            }
            else{
                dispatch({type:'reset'})
            }
          }
          check()
    },[])

    

    return (
        <AuthContext.Provider value={authData}>
            <AuthDispatchContext.Provider value={dispatch}>
                {children}
            </AuthDispatchContext.Provider>
        </AuthContext.Provider>
    )

}

// Reads Posts (globally)
export function useAuthData() {
    return useContext(AuthContext)
}

// Manage Post (globally)
export function useAuthDispatch() {
    return useContext(AuthDispatchContext)
}

function reducer(authData, action) {
    //console.log(action.payload)
    switch (action.type) {
        case 'change': {
            return{
                user: action.payload
            }
        }
        case 'reset': {
            return{
                user: null
            }
        }
        default: {
            throw Error('Unknown action: ' + action.type);
        }
    }
  }
