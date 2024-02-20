import type {BatailleInterface} from "~/types/bataille"


export const DefaultBataille ={
    nom: '',
    annee: '',
    lieu: '',
    force: '',
    pertes: '',
    situation: '',
    image: '',
    victoire: true,
        
} satisfies Omit<BatailleInterface, 'id'>