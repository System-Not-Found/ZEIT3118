import { NextPage } from "next";
import { useState, useContext } from "react";
import { UserContext } from "./_app";
import AdminSettings from "../components/settings/Admin/AdminSettings";
import UserSettings from "../components/settings/UserSettings";

const Settings: NextPage = () => {
  const user = useContext(UserContext);
  const loggedIn = user.user.id !== -1;
  if (loggedIn) {
    return user.user.admin ? <AdminSettings /> : <UserSettings />;
  } else {
    return <></>;
  }
};

export default Settings;
