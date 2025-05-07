import { useAuth } from "@/auth";
import PageStructure from "@/components/structure/PageStructure";
import { BiSolidDashboard } from "react-icons/bi";
import { navigate } from "vike/client/router";
import OwnerDashboard from "./OwnerDashboard";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { useEffect, useState } from "react";
import {
  fetchRealEstateData,
  fetchRealEstateUsersSelectOptions,
} from "@/store/realEstateReducer";
import AdminDashboard from "./AdminDashboard";
import RealEstateSelect from "@/components/inputs/RealEstateSelect";
import UserSelect from "@/components/inputs/UserSelect";
import UserDashboard from "./UserDashboard";

export default function Dashbaord() {
  const { isAuthenticated, user } = useAuth();
  const [dashboardLevel, setDashboardLevel] = useState<
    "admin" | "owner" | "user"
  >(user?.admin ? "admin" : user?.owner ? "owner" : "user");

  const dispatch = useDispatch<AppDispatch>();

  const {
    realEstateUsersSelectOptions,
    realEstateUsersSelectOptionsLoading,
    realEstateData,
  } = useSelector((state: RootState) => state.realEstate);

  const [realEstate, setRealEstate] = useState("");
  const [userSelected, setUserSelected] = useState("");

  useEffect(() => {
    if (realEstate && !userSelected) setDashboardLevel("owner");
    else if (realEstate && userSelected) setDashboardLevel("user");
    else if (!realEstate && !userSelected) {
      if (user.admin) setDashboardLevel("admin");
      else if (user.owner) setDashboardLevel("owner");
      else {
        setDashboardLevel("user");
        setUserSelected(user.id);
      }
    }
  }, [dispatch, realEstate, user.admin, user.id, user.owner, userSelected]);

  useEffect(() => {
    if (user.owner) {
      dispatch(fetchRealEstateData());
      dispatch(fetchRealEstateUsersSelectOptions(realEstate));
    }
  }, [dispatch, realEstate, user.owner]);

  useEffect(() => {
    if (!realEstate && !user.admin && user.owner)
      setRealEstate(realEstateData?.id || "");
  }, [realEstate, realEstateData, user.admin, user.owner]);

  if (!isAuthenticated) {
    navigate("/");
    return null;
  }

  const header = (
    <div className="flex justify-between items-center flex-wrap">
      <div className="flex items-center text-primary gap-2 text-2xl ms-4 mt-8 mb-3 w-[250px]">
        <BiSolidDashboard className="text-xl" />
        <h2 className="font-bold">Dashboard</h2>
      </div>
      <div className="flex gap-5 flex-wrap ms-3 md:ms-0">
        {user.admin && (
          <div className="mb-1">
            <RealEstateSelect
              value={realEstate}
              onChange={(v) => setRealEstate(v)}
            />
          </div>
        )}
        {user.owner && (
          <UserSelect
            users={realEstateUsersSelectOptions}
            loading={realEstateUsersSelectOptionsLoading}
            label="Ver como corretor:"
            value={userSelected}
            onChange={(v) => setUserSelected(v)}
          />
        )}
      </div>
    </div>
  );
  const content = () => {
    if (dashboardLevel === "admin") return <AdminDashboard />;
    if (dashboardLevel === "owner")
      return <OwnerDashboard realEstate={realEstate} />;
    if (dashboardLevel === "user")
      return <UserDashboard userId={userSelected} />;
  };

  return <PageStructure content={content()} header={header} />;
}
