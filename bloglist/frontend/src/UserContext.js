import { createContext, useReducer, useContext } from 'react'

const userReducer = (state, action) => {
  switch (action.type) {
  case 'LOGIN':
    return { user: action.user, username: '', password: '' }
  case 'SET_USER':
    return { ...state, user: action.user }
  case 'SET_USERNAME':
    return { ...state, username: action.username }
  case 'SET_PASSWORD':
    return { ...state, password: action.password }
  case 'LOGOUT':
    return { user: null, username: '', password: '' }
  default:
    return state
  }
}

const UserContext = createContext()

export const UserContextProvider = (props) => {
  const [user, userDispatch] = useReducer(userReducer, { user: null, username: '', password: '' })

  return (
    <UserContext.Provider value={[user, userDispatch] }>
      {props.children}
    </UserContext.Provider>
  )
}

export const useUserValue = () => {
  const UserAndDispatch = useContext(UserContext)
  return UserAndDispatch[0]
}

export const useUserDispatch = () => {
  const UserAndDispatch = useContext(UserContext)
  return UserAndDispatch[1]
}

export default UserContext