import express from 'express';

import { environment } from '../common/environment';

const app = express();

app.get('/', (req, res) => {
  res.json({ message: 'Hello World' });
});

app.listen(environment.server.port, () => {
  console.log(`Server is running on http://localhost:${environment.server.port}`);
});