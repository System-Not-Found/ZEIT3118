import { NextPage } from "next";
import { useState, useContext } from "react";
import { UserContext } from "./_app";
import AdminSettings from "../components/settings/AdminSettings";
import UserSettings from "../components/settings/UserSettings";

const Settings: NextPage = () => {
  const user = useContext(UserContext);
  return !user.user.admin ? <AdminSettings /> : <UserSettings />;
};

export default Settings;
