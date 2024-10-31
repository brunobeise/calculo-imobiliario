import { useEffect, useState } from "react";
import { Button, FormLabel, Input, Table } from "@mui/joy";
import PictureInput from "@/components/inputs/PictureInput";
import { FaCheckCircle, FaSave } from "react-icons/fa";
import { IoCloseOutline, IoAddCircleSharp } from "react-icons/io5";
import ConfirmationModal from "@/components/modals/ConfirmationModal";
import UserFormModal from "@/components/modals/UserFormModal";
import { useAuth } from "@/auth";
import { navigate } from "vike/client/router";
import { AppDispatch, RootState } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";
import { uploadImage } from "@/lib/imgur";
import {
  addUser,
  editRealEstateData,
  fetchRealEstateData,
  updateUserAdmin,
} from "@/store/realEstateReducer";
import PageStructure from "@/components/structure/PageStructure";
import { MdOutlineRealEstateAgent } from "react-icons/md";
import { userService } from "@/service/userService";
import FloatingButtonList from "@/components/shared/FloatingButtonList";

export default function RealEstateConfig() {
  const dispatch = useDispatch<AppDispatch>();
  const { realEstateData, loading } = useSelector(
    (state: RootState) => state.realEstate
  );
  const [form, setForm] = useState(realEstateData);

  const [changeAdminUser, setChangeAdminUser] = useState({
    text: "",
    userId: "",
    owner: false,
    loading: false,
  });
  const [userFormModal, setUserFormModal] = useState(false);

  const { user: User } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const id = e.target.id;
    const value = e.target.value;

    setForm((prevForm) => {
      if (!prevForm) return prevForm;
      return {
        ...prevForm,
        [id]: value,
      };
    });
  };

  const handleSave = async () => {
    if (!form || !form.id) return;

    let uploadLogo = form.logo;
    let uploadLogo2 = form.logo2;

    if (form.logo && !form.logo.includes("res.cloudinary.com")) {
      uploadLogo = await uploadImage(form.logo);
    }
    if (form.logo2 && !form.logo2.includes("res.cloudinary.com")) {
      uploadLogo2 = await uploadImage(form.logo2);
    }

    dispatch(
      editRealEstateData({
        ...form,
        users: undefined,
        logo: uploadLogo,
        logo2: uploadLogo2,
      })
    );

    setForm({
      ...form,
      logo: uploadLogo,
      logo2: uploadLogo2,
    });
  };

  useEffect(() => {
    if (!User || !User.owner) {
      navigate("/");
      return;
    }

    if (!realEstateData) {
      dispatch(fetchRealEstateData());
    } else {
      setForm(realEstateData);
    }
  }, [User, realEstateData, dispatch]);

  const handleAdmin = async () => {
    setChangeAdminUser({
      ...changeAdminUser,
      loading: true,
    });

    await userService.editUser(changeAdminUser.userId, {
      owner: !changeAdminUser.owner,
    });

    dispatch(updateUserAdmin(changeAdminUser.userId));

    setChangeAdminUser({
      text: "",
      userId: "",
      owner: false,
      loading: false,
    });
  };

  const header = (
    <div className="flex justify-between items-center">
      <div className="w-full flex items-center text-primary gap-2  text-2xl ms-4 mt-8 mb-3">
        <MdOutlineRealEstateAgent className="text-xl" />
        <h2 className="font-bold">Imobiliária</h2>
      </div>
      <div className="flex gap-5 justify-center items-center h-max me-10">
        <img className="h-[50px]" src={form?.logo} alt="" />
        <h2 className="font-bold text-4xl text-nowrap">{form?.name}</h2>
      </div>
    </div>
  );

  const content = (
    <div>
      <div className="mb-10 px-10">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold mb-4">Usuários da Imobiliária</h2>{" "}
          <Button
            onClick={() => setUserFormModal(true)}
            endDecorator={<IoAddCircleSharp />}
          >
            Novo usuário
          </Button>
        </div>

        {realEstateData && realEstateData.users ? (
          <Table size="lg">
            <thead>
              <tr>
                <th className="w-[60px]"></th>
                <th>Nome</th>
                <th className="w-[350px]">Email</th>
                <th>Cargo</th>
                <th>Estudos</th>
                <th className="w-[80px]">Admin</th>
              </tr>
            </thead>
            <tbody>
              {realEstateData.users.map((user) => (
                <tr key={user.id}>
                  <td className="w-[60px]">
                    <div className="rounded-full overflow-hidden flex justify-center items-center w-[40px] h-[40px]">
                      <img
                        src={
                          user.photo ||
                          "https://definicion.de/wp-content/uploads/2019/07/perfil-de-usuario.png"
                        }
                      />
                    </div>
                  </td>
                  <td>
                    <strong>{user.fullName}</strong>
                  </td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>{user.casesCount}</td>
                  <td
                    onClick={() => {
                      if (user.id !== User?.id)
                        setChangeAdminUser({
                          text: user.owner
                            ? `${user.fullName} não poderá mais fazer alterações na imobiliária.`
                            : `${user.fullName} poderá fazer alterações na imobiliária.`,
                          userId: user.id!,
                          owner: user.owner!,
                          loading: false,
                        });
                    }}
                    className={`w-[80px]" ${
                      User.id !== user.id ? "cursor-pointer" : ""
                    }
                        `}
                  >
                    <div className="w-full flex justify-center">
                      {user.owner ? <FaCheckCircle /> : <IoCloseOutline />}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <p>Nenhum usuário encontrado.</p>
        )}
      </div>
      <form>
        <div className="grid grid-cols-6 gap-x-5 gap-y-4">
          <div className="col-span-3">
            <FormLabel htmlFor="name">Nome da Imobiliária:</FormLabel>
            <Input
              onChange={handleChange}
              type="text"
              id="name"
              value={form?.name || ""}
              required
            />
          </div>
          <div className="col-span-3">
            <FormLabel htmlFor="address">Endereço:</FormLabel>
            <Input
              onChange={handleChange}
              type="text"
              id="address"
              value={form?.address || ""}
              required
            />
          </div>
          <div className="col-span-6">
            <PictureInput
              bordered
              value={form?.logo ? [form?.logo] : []}
              label="Logo Principal:"
              onChange={(v) =>
                setForm((prevForm) => {
                  if (!prevForm) return prevForm;
                  return {
                    ...prevForm,
                    logo: v,
                  };
                })
              }
            />
          </div>
          <div className="col-span-6">
            <PictureInput
              bordered
              value={form?.logo2 ? [form?.logo2] : []}
              label="Logo Secundário:"
              onChange={(v) =>
                setForm((prevForm) => {
                  if (!prevForm) return prevForm;
                  return {
                    ...prevForm,
                    logo2: v,
                  };
                })
              }
            />
          </div>
        </div>
      </form>
    </div>
  );

  return (
    <>
      <PageStructure loading={loading} content={content} header={header} />;
      <ConfirmationModal
        open={!!changeAdminUser.userId}
        onClose={() =>
          setChangeAdminUser({
            text: "",
            userId: "",
            owner: false,
            loading: false,
          })
        }
        okLoading={changeAdminUser.loading}
        content={changeAdminUser.text}
        title="Deseja alterar a permissão desse usuário?"
        onOk={handleAdmin}
      />
      <UserFormModal
        open={userFormModal}
        onClose={() => setUserFormModal(false)}
        userAdded={(user) => dispatch(addUser(user))}
      />
      <FloatingButtonList
        buttons={[{ loading: loading, onClick: handleSave, icon: <FaSave /> }]}
      />
    </>
  );
}
