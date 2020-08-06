import cors from 'cors';
import express from 'express';

import routes from './routes';
import { environment } from '../common/environment';

const app = express();

app.use(cors());
app.use(express.json());
app.use(routes);

app.listen(environment.server.port, () => {
  console.log(`Server is running on http://localhost:${environment.server.port}`);
});