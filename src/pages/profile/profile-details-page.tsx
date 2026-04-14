import { Helmet } from 'react-helmet-async';
import ProfileDetailsView from 'src/sections/profile/profile-details/view/profile-details-view';

export default function ProfileDetailsPage() {
  return (
    <>
      <Helmet>
        <title>Profile: Details</title>
      </Helmet>
      <ProfileDetailsView />
    </>
  );
}
