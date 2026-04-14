import { Helmet } from 'react-helmet-async';
import CustomersListView from 'src/sections/customers/view/customers-list-view';

export default function CustomersListPage() {
  return (
    <>
      <Helmet>
        <title>Customers: List</title>
      </Helmet>
      <CustomersListView />
    </>
  );
}
