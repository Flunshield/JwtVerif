import express, { Application, Request, Response } from "express";
import { verifyJwt } from "./middleware/jwt-utils";

const app: Application = express();
const cors = require('cors');
const port: number = 3000;
var bodyParser = require('body-parser')

// Utilisation de bodyParser pour parser le corps des requêtes en JSON
app.use(bodyParser.json());

//INITIALISATION CORS
const corsOptions = {
  origin: 'http://localhost:5173',
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
// END CORS

app.get('/secure', verifyJwt("Premium"), (req: Request, res: Response) => {
  res.status(200).json({ message: 'Token is valid' });
});

app.listen(port, () => {
  console.log(`Serveur démarré sur le port ${port}`);
});
