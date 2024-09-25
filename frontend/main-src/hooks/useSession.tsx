import {SessionService} from '../services'
import { useGlobalStore } from '../store';

const sessionService = SessionService.getInstance();

export default function useSession(){
    const { addSession  } = useGlobalStore()
    const createNewSession = async () => {
        console.log('hey');
        const res = await sessionService.createSession('new patient');

        addSession({
            "created": 1727236429.189552,
            "id": "f73b8822-e415-44b2-abaf-b05e491fc28b",
            "name": "This is mocked data",
            "updated": 1727236429.189552
          })
    }


    return {
        createNewSession
    }
}
