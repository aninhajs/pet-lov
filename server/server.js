import express from 'express'
import 'dotenv/config'
import { supabase } from './services/supabase.js'

const app = express()
const port = process.env.PORT || 8081

app.get('/', async (req, res) => {
  const { data: credencial_ong, error } = await supabase
    .from('credencial_ong')
    .select('*')
  res.json(credencial_ong)
})

app.listen(port, () => console.log(`Server on http://localhost:${port}`))
