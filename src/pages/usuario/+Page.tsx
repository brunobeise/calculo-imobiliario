import { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { fetchUserData } from "@/store/userReducer";
import PageStructure from "@/components/structure/PageStructure";
import { useAuth } from "@/auth";
import { navigate } from "vike/client/router";
import { FaEdit, FaRegAddressCard } from "react-icons/fa";
import { FaUser } from "react-icons/fa6";
import { LuPhoneCall } from "react-icons/lu";
import BooleanInputSwitch from "@/components/inputs/SwitchInput";
import { Button } from "@mui/joy";
import UserFormModal from "@/components/modals/UserFormModal";

export default function UserConfig() {
  const { isAuthenticated } = useAuth();

  const dispatch = useDispatch<AppDispatch>();
  const { userData, loading } = useSelector((state: RootState) => state.user);
  const [userFormModal, setUserFormModal] = useState(false);

  useEffect(() => {
    if (!userData) {
      dispatch(fetchUserData());
    }
  }, [dispatch, userData]);

  if (!isAuthenticated) {
    navigate("/");
    return null;
  }

  const header = userData && (
    <div className="flex items-end justify-between">
      <div className="w-full flex items-center text-primary gap-2  text-2xl ms-4 mt-8 mb-3">
        <FaUser className="text-xl" />
        <h2 className="font-bold">Meus dados</h2>
      </div>
      <Button onClick={() => setUserFormModal(true)} endDecorator={<FaEdit />}>
        Editar
      </Button>
    </div>
  );

  const content = userData ? (
    <div className="grid grid-cols-3 gap-5">
      <div className="col-span-3 bg-gradient-to-r from-whitefull to-white border border-grayScale-200 text-white p-3 shadow-lg rounded-lg h-40 flex">
        <div className="flex gap-2">
          <div className="h-full w-36 aspect-square flex justify-center items-center rounded overflow-hidden">
            <img
              className="h-full w-full  object-cover"
              src={userData?.photo}
            />
          </div>
          <div className="flex flex-col h-full justify-between ms-3 text-primary">
            <span>
              <span className="text-lg font-bold ">{userData.fullName}</span>
              <span className="ms-2 text-sm">{userData.role}</span>
            </span>
            <span className="flex gap-2 items-center">
              <FaRegAddressCard size={20} /> CRECI {userData.creci}
            </span>
            <span className="flex gap-2 items-center">
              <LuPhoneCall size={20} /> {userData.phone}
            </span>
            <div className="border border-1 border-primary rounded p-[4px] px-2 w-min text-nowrap">
              <b className="font-bold">{userData.casesCount} </b> Estudos
              Realizados
            </div>
          </div>
        </div>
      </div>
      <div className="bg-gradient-to-r from-whitefull to-white border border-grayScale-200 text-white p-4 shadow-lg rounded-lg h-64 relative">
        <h5 className="font-bold">Imobiliária</h5>
        <div className="absolute top-[50%] translate-x-[-50%] left-[50%] translate-y-[-50%]">
          <img className="w-[32]" src={userData.realEstate.logo} alt="" />
        </div>
      </div>
      <div className="bg-gradient-to-r from-whitefull to-white border border-grayScale-200 text-white p-4 shadow-lg rounded-lg h-64 relative">
        <h5 className="font-bold">Plano</h5>
        <div className="absolute top-[50%] translate-x-[-50%] left-[50%] translate-y-[-50%]">
          <h5 className="font-bold text-2xl text-nowrap"> Acesso Completo</h5>
        </div>
      </div>
      <div className="bg-gradient-to-r from-whitefull to-white border border-grayScale-200 text-white p-4 shadow-lg rounded-lg h-64 relative flex flex-col gap-4 justify-between">
        <div className="flex flex-col gap-4">
          <h5 className="font-bold">Notificações</h5>
          <BooleanInputSwitch
            onChange={() => {}}
            checked={true}
            label="Receber notificação de visualizações de proposta"
          />
          <BooleanInputSwitch
            onChange={() => {}}
            checked={true}
            label="Receber notificação de atualizações do sitema"
          />
        </div>
        <Button className="w-full">Testar envio</Button>
      </div>
    </div>
  ) : (
    <></>
  );

  return (
    <>
      <PageStructure
        loading={loading && !userData}
        content={userData && content}
        header={header}
      />
      <UserFormModal
        editUser={userData}
        open={userFormModal}
        onClose={() => {
          dispatch(fetchUserData());
          setUserFormModal(false);
        }}
      />
    </>
  );
}
