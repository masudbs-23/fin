import { Helmet } from 'react-helmet-async';
import TransactionsListView from 'src/sections/transactions/view/transactions-list-view';

// ----------------------------------------------------------------------

export default function CategoriesListPage() {
  return (
    <>
      <Helmet>
        <title>Transactions: List</title>
      </Helmet>

      <TransactionsListView />
    </>
  );
}
