import Header from "../navigation/base-header";
import Footer from "../navigation/base-footer";
import { Outlet } from "react-router-dom";

export default function BaseLayout() {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
}
