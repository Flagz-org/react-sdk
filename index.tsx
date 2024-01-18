import {
  useEffect,
  useState,
  createContext,
  useContext,
  ReactNode
} from 'react'
import { createToken } from './token'

type Flag = {
  name: string
  value: string
}

type FlagzPayload = {
  count?: number
  offset?: number
  items?: Flag[]
  loading: boolean
  error?: boolean
  errorMessage?: string
}

type FlagzContextState = {
  [key: string]: boolean
  loading: boolean
}

const FlagzContext = createContext<FlagzContextState>({ loading: true })

// make a provider in react that creates a connection to a websocket
export const FlagzProvider = ({
  children,
  apiKey
}: {
  children: ReactNode
  apiKey: string
}) => {
  const [state, setState] = useState<FlagzContextState>({ loading: true })

  useEffect(() => {
    createToken({ apiKey }).then((token) => {
      const socket = new WebSocket(
        `ws://localhost:3001/connect?access_token=${token}`
      )
      socket.onopen = () => {
        console.info('connected to flagz...')
      }
      socket.onmessage = (event) => {
        console.info('received message from flagz', event.data)
        let JsonResponse: FlagzPayload
        try {
          JsonResponse = JSON.parse(event.data)
          if (!JsonResponse.items) {
            setState((prevState) => ({
              ...prevState,
              loading: false,
              error: true,
              errorMessage: event.data
            }))
          } else {
            setState({
              ...JsonResponse.items?.reduce((acc, curr) => {
                acc[curr.name] = !!curr.value
                return acc
              }, {} as FlagzContextState),
              loading: false
            })
          }
        } catch (e) {
          setState((prevState) => ({
            ...prevState,
            loading: false,
            error: true,
            errorMessage: event.data
          }))
        }
      }
      socket.onclose = () => {
        // don't change the state it would be wrong to assume
        // flags change when a connection is lost, but it is for sure not loading anymore
        console.info('disconnected from flagz...')

        setState((prevState) => ({ ...prevState, loading: false }))
      }
    })
  }, [])
  return <FlagzContext.Provider value={state}>{children}</FlagzContext.Provider>
}

// just return the value of the state, which is the flags
export const useFlags = () => {
  return useContext(FlagzContext)
}
