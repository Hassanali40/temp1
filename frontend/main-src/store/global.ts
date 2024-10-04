import { create } from 'zustand';
import { createSessionStore, defaultSession, ISessionStore } from './session';
import { createUserStore, IUserStore } from './user';
import UserDataService from '../services/user';
import { UserData } from '../interfaces/user';

const mockSession = {
  created: 1728021793.961089,
  id: '2d79d608-743d-46e6-8c13-d3d1e9a70372',
  name: 'session with history',
  updated: 1728021793.961089,
  qas: [
    {
      answer: {
        agentsStatus: [],
        answer:
          'HISTORY OF PRESENT ILLNESS:\nA very pleasant ***-year-old *** with past medical history significant for *** presented to the Emergency Department and provided the history for herself. She is G1 P0 A0 presenting with *** onset around ***. She reports associated *** and ***. Patient describes her abdominal pain as "***" in nature. She initially rated her pain as a ***/10, though pain is currently a ***/10 in severity. She reports that the *** is *** and is *** during times of ***, and *** alleviating factors. Patient reports she has ***. Additionally, patient used an at-home pregnancy test which came back *** and states that her last menstrual period was ***. She has since been taking prenatal vitamins. Review of medical records indicates no formal ultrasound has been done yet. Denies ***, ***, ***, ***, ***, ***, ***, ***, or other *** symptoms. Of note, patient reports occasional alcohol use, however none since her positive pregnancy test. She otherwise denies *** or ***. Allergic to ***.\n\nPHYSICAL EXAM:\nVitals: Interpreted as normal for this patient.\nGeneral: NAD. Well-kept male adult.\nEyes: Appear normal with no scleral icterus.\nHENT: Atraumatic. Moist mucous membranes, no pharyngeal erythema, edema or lesions.\nNeck: Atraumatic, supple.\nCardiac: Regular rate, regular rhythm, no significant murmurs appreciated.\nRespiratory: No respiratory distress, clear lungs bilaterally with no abnormal breath sounds.\nAbdomen: Soft. Nontender. Nondistended. No rebound. No guarding. No tenderness over McBurney\'s point, no tenderness over the liver or spleen, no Murphy\'s sign, no pulsatile abdominal mass.\nGU: No CVAT.\nMS: Extremities atraumatic. No edema, no calf tenderness to palpation.\nSkin: No exanthems, no cyanosis, no diaphoresis.\nBack exam: Atraumatic.\nNeurologic: No altered mental status, speech is fluent. Gait is within normal limits. No cerebellar deficits. No motor deficits. No sensory deficits.\nPsychological: Cooperative and participatory with examination.\n',
        notes: '',
      },
      created: 1727201442.842556,
      id: '4565fee7-b841-45d7-b840-81054865300c',
      question: {
        promptId: 'px',
        text: 'hello',
        seed: 0,
      },
      updated: 1727201442.842556,
    },
  ],
};

const userDataService = UserDataService.getInstance();

interface IGlobalStore {
  getUser: () => Promise<UserData | undefined>;
}

export const useGlobalStore = create<ISessionStore & IUserStore & IGlobalStore>((set, ...a) => ({
  ...createSessionStore(set, ...a),
  ...createUserStore(set, ...a),

  getUser: async () => {
    const userData = await userDataService.getUser();
    if (!userData) return;
    set((state) => ({
      ...state,
      userData,
      sessions: [...userData.chatSessions, { ...mockSession }].map((ele) => ({
        ...defaultSession,
        ...ele,
        wasLoaded: true,
      })),
      activeSession: userData.activeSession,
    }));
    return userData;
  },
}));
