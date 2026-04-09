import React, { useState } from "react";
import {
  Grid,

} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  People,
  Description,
  Settings,
  Sell,
  ManageAccounts,
  CalendarMonth,
  Person,
  DocumentScanner,
  DocumentScannerTwoTone,
} from "@mui/icons-material";
import Sidebar from "../components/admin/Sidebar";
import Header from "../components/admin/Header";
import { useDispatch, useSelector } from "react-redux";
import CreateAgreement from "../dialog/CreateAgreement";
import { setCreateAgreementOpen } from "../slices/modalSlice";
import GavelIcon from '@mui/icons-material/Gavel';

const AdminLayout = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);

  const { createAgreementOpen } = useSelector(state => state.modal)
  const dispatch = useDispatch()


  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon color='primary' />, path: "/dashboard" },
    { text: "My Prospects", icon: <Person color='primary' />, path: "/my-prospects" },
    { text: "List View", icon: <People color='primary' />, path: "/list-view" },
    { text: "Manage Executive", icon: <ManageAccounts color="primary" />, path: "/manage-executive" },
    { text: "Agreements", icon: <DocumentScanner color="primary" />, path: "/agreements" },
    {
      text: "Calendar",
      icon: <CalendarMonth color="primary" />,
      onClick: () => window.open("https://calendar.google.com/", "_blank")
    }
  ];

  return (
    <Grid container height={"100vh"} overflow={"hidden"}>
      <Grid size={2}>
        <Sidebar menuItems={menuItems} darkMode={darkMode} />
      </Grid>

      <CreateAgreement open={createAgreementOpen} onClose={() => dispatch(setCreateAgreementOpen(false))} />

      <Grid size={10}>
        <Header darkMode={darkMode} setDarkMode={setDarkMode} />
        {children}
      </Grid>
    </Grid>
  );
}

export default AdminLayout