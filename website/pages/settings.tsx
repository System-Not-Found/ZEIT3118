import { NextPage } from "next";
import AdminSettings from "../components/settings/Admin/AdminSettings";
import UserSettings from "../components/settings/UserSettings";
import { useSession } from "../lib/hooks";

const Settings: NextPage = () => {
  const { user } = useSession();
  if (user) {
    return user.admin ? <AdminSettings /> : <UserSettings />;
  } else {
    return <></>;
  }
};

export default Settings;
