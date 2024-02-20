import type {EntityInterface} from '~/types/entity'

export interface BatailleInterface extends EntityInterface {
  nom: string
  annee: string
  lieu: string
  force: string
  pertes: string
  situation: string
  image: string
  victoire: boolean
}