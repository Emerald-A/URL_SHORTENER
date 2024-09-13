import express from 'express'
import { validateChannels as vcd } from '../../../middleware/header.mw'
import { register } from '../../../controllers/auth.controller'

const router = express.Router({ mergeParams: true });

router.post('/register', vcd, register)

export default router;