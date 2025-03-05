import {createClient} from '@sanity/client'
import { apiVersion, dataset, projectId } from '../sanity/env';


const client = createClient({
  projectId: projectId, 
  dataset:dataset,
  apiVersion:apiVersion, 
  useCdn: true, 
})

export default client