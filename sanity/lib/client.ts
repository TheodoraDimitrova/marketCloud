'use client'
import { createClient } from '@sanity/client'
import {  dataset, projectId } from '../env'


const client = createClient({
  projectId,
  dataset,
  apiVersion: "2023-03-01",  
  useCdn: true,                
})


export default client
