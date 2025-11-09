import express from 'express'
const router = express.Router()

// Use DB/Prisma aqui quando o model existir
let inMemoryPets = []

router.get('/', (req, res) => {
  res.json(inMemoryPets)
})

router.post('/', (req, res) => {
  const pet = { id: Date.now(), ...req.body }
  inMemoryPets.push(pet)
  res.status(201).json(pet)
})

router.get('/:id', (req, res) => {
  const pet = inMemoryPets.find((p) => String(p.id) === req.params.id)
  if (!pet) return res.status(404).json({ error: 'Pet not found' })
  res.json(pet)
})

router.put('/:id', (req, res) => {
  inMemoryPets = inMemoryPets.map((p) =>
    String(p.id) === req.params.id ? { ...p, ...req.body } : p
  )
  res.json(inMemoryPets.find((p) => String(p.id) === req.params.id))
})

router.delete('/:id', (req, res) => {
  inMemoryPets = inMemoryPets.filter((p) => String(p.id) !== req.params.id)
  res.status(204).end()
})

export default router