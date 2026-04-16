import { Helmet } from 'react-helmet-async';
import RecipientListView from 'src/sections/recipient/view/recipient-list-view';

export default function ManufacturersListPage() {
  return (
    <>
      <Helmet>
        <title>Recipient: List</title>
      </Helmet>

      <RecipientListView />
    </>
  );
}
