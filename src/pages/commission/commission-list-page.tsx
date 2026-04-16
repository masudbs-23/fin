import { Helmet } from 'react-helmet-async';
import CommissionListView from 'src/sections/commission/view/commission-list-view';

// ----------------------------------------------------------------------

export default function CommissionListPage() {
  return (
    <>
      <Helmet>
        <title>Commission: List</title>
      </Helmet>

      <CommissionListView />
    </>
  );
}
