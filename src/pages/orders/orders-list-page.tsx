import { Helmet } from 'react-helmet-async';
import CreateTransferListView from 'src/sections/create-transfer/view/create-transfer-list-view';

// ----------------------------------------------------------------------

export default function OrdersListPage() {
  return (
    <>
      <Helmet>
        <title>Create Transfer: List</title>
      </Helmet>

      <CreateTransferListView />
    </>
  );
}
