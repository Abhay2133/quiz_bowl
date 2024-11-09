export const prettyListRoutes = (endpoints: any) => {
  // const endpoints = listEndpoints(app);

  const routesTable = endpoints.map((route: any) => ({
    Path: route.path,
    Methods: route.methods.join(', '),
  }));

  console.table(routesTable);
};