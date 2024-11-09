
import listEndpoints from 'express-list-endpoints'
import app from './app';
import { prettyListRoutes } from './utils/logger';

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  // console.log(listEndpoints(app));
  prettyListRoutes(listEndpoints(app))
});
