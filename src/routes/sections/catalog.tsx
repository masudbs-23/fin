import { productsRoutes } from 'src/routes/sections/products';
import { brandsRoutes } from 'src/routes/sections/brands';

// ----------------------------------------------------------------------

export const catalogRoutes = [
  ...productsRoutes,
  ...brandsRoutes,
];
