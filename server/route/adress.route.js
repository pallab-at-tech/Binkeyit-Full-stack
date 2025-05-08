import {Router} from "express"
import auth from "../middleware/auth.js";
import { addAdressController, deleteAdressController, getAdressController, updateAdressController } from "../controllers/adress.controller.js";

const adressRouter = Router();

adressRouter.post('/create',auth,addAdressController)
adressRouter.get('/get', auth , getAdressController)
adressRouter.put('/update',auth , updateAdressController)
adressRouter.delete('/disable',auth,deleteAdressController)

export default adressRouter