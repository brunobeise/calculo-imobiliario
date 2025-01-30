import { useEffect, useState } from "react";
import { Button, FormLabel, IconButton, Input, Table } from "@mui/joy";
import PictureInput from "@/components/inputs/PictureInput";
import { FaCheckCircle, FaEdit, FaSave } from "react-icons/fa";
import ConfirmationModal from "@/components/modals/ConfirmationModal";
import UserFormModal from "@/components/modals/UserFormModal";
import { useAuth } from "@/auth";
import { navigate } from "vike/client/router";
import { AppDispatch, RootState } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";
import { uploadImage } from "@/lib/imgur";
import {
  editRealEstateData,
  fetchRealEstateData,
  fetchRealEstateUsers,
} from "@/store/realEstateReducer";
import PageStructure from "@/components/structure/PageStructure";
import { MdOutlineRealEstateAgent } from "react-icons/md";
import { userService } from "@/service/userService";
import FloatingButtonList from "@/components/shared/FloatingButtonList";
import Paper from "@/components/shared/Paper";
import { useForm, Controller } from "react-hook-form";
import { RealEstateFormData } from "@/types/realEstateTypes";
import { IoAddCircleSharp, IoCloseOutline } from "react-icons/io5";
import SelectHeaderTypeModal from "./SelectHeaderTypeModal";
import UserSignature from "@/components/user/UserSignature";
import SelectColorsModal from "./SelectColorsModal";

export default function RealEstateConfig() {
  const dispatch = useDispatch<AppDispatch>();
  const { realEstateData, loading, realEstateUsers } = useSelector(
    (state: RootState) => state.realEstate
  );

  const { control, handleSubmit, watch, reset, setValue } =
    useForm<RealEstateFormData>();

  const { user: User, isAuthenticated } = useAuth();
  const [changeAdminUser, setChangeAdminUser] = useState({
    text: "",
    userId: "",
    owner: false,
    loading: false,
  });
  const [userFormModal, setUserFormModal] = useState(false);
  const [selectHeaderTypeModal, setSelectHeaderTypeModal] = useState(false);
  const [selectColorsModal, setSelectColorsModal] = useState(false);

  const onSubmit = async (data: RealEstateFormData) => {
    let uploadLogo = data.logo;
    let uploadLogo2 = data.logo2;

    if (data.logo && !data.logo.includes("res.cloudinary.com")) {
      uploadLogo = await uploadImage(data.logo);
    }
    if (data.logo2 && !data.logo2.includes("res.cloudinary.com")) {
      uploadLogo2 = await uploadImage(data.logo2);
    }

    dispatch(
      editRealEstateData({
        ...data,
        logo: uploadLogo,
        logo2: uploadLogo2,
      })
    );
  };

  useEffect(() => {
    if (!User || !User.owner) {
      navigate("/");
      return;
    }
    dispatch(fetchRealEstateData());
    dispatch(fetchRealEstateUsers());
  }, [User, dispatch]);

  useEffect(() => {
    if (realEstateData) {
      reset(realEstateData);
    }
  }, [realEstateData, reset]);

  const handleAdmin = async () => {
    setChangeAdminUser((prev) => ({ ...prev, loading: true }));
    await userService.editUser(changeAdminUser.userId, {
      owner: !changeAdminUser.owner,
    });
    // dispatch(updateUserAdmin(changeAdminUser.userId));
    setChangeAdminUser({
      text: "",
      userId: "",
      owner: false,
      loading: false,
    });
  };

  const handleColorChange = (colors: {
    primaryColor: string;
    secondaryColor: string;
    backgroundColor: string;
  }) => {
    setValue("primaryColor", colors.primaryColor);
    setValue("secondaryColor", colors.secondaryColor);
    setValue("backgroundColor", colors.backgroundColor);
  };

  if (!isAuthenticated) {
    navigate("/");
    return null;
  }

  const header = (
    <div className="flex justify-between items-center">
      <div className="w-full flex items-center text-primary gap-2  text-2xl ms-4 mt-8 mb-3">
        <MdOutlineRealEstateAgent className="text-xl" />
        <h2 className="font-bold">Imobiliária</h2>
      </div>
    </div>
  );

  const content = (
    <div className="p-4 flex flex-col gap-y-5">
      <div className="flex gap-3 justify-center items-center h-max me-10">
        <img className="h-[50px]" src={watch("logo")} alt="" />
      </div>
      <Paper className="p-7">
        <div className="flex justify-between items-center ps-2">
          <h2 className="text-xl font-bold mb-4">Usuários da Imobiliária</h2>{" "}
          <Button
            onClick={() => setUserFormModal(true)}
            endDecorator={<IoAddCircleSharp />}
          >
            Novo usuário
          </Button>
        </div>
        <Table size="lg">
          <thead>
            <tr>
              <th className="w-[60px]"></th>
              <th>Nome</th>
              <th className="w-[350px]">Email</th>
              <th>Cargo</th>
              <th>Propostas</th>
              <th className="w-[80px]">Admin</th>
            </tr>
          </thead>
          <tbody>
            {realEstateUsers.map((user) => (
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
                  }`}
                >
                  <div className="w-full flex justify-center">
                    {user.owner ? <FaCheckCircle /> : <IoCloseOutline />}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Paper>
      <Paper className="p-7">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-12 gap-x-5 gap-y-5">
            <div className="col-span-6">
              <FormLabel htmlFor="name">Nome da Imobiliária:</FormLabel>
              <Controller
                name="name"
                control={control}
                render={({ field }) => <Input {...field} required />}
              />
            </div>
            <div className="col-span-6">
              <FormLabel htmlFor="address">Endereço:</FormLabel>
              <Controller
                name="address"
                control={control}
                render={({ field }) => <Input {...field} required />}
              />
            </div>
            <div className="col-span-12 relative">
              <FormLabel htmlFor="name">Layout do cabeçalho: </FormLabel>
              <div className="mt-2 relative flex gap-2 items-start">
                <div className="border border-gray  w-[210mm]">
                  <UserSignature
                    title="Assinatura Exemplo"
                    desc="Nome do imóvel"
                    type={watch("headerType")}
                    primaryColor={watch("primaryColor")}
                    secondaryColor={watch("secondaryColor")}
                    backgroundColor={watch("backgroundColor")}
                  />{" "}
                </div>
                <IconButton
                  variant="soft"
                  size="sm"
                  className="!rounded-full"
                  onClick={() => setSelectHeaderTypeModal(true)}
                >
                  <FaEdit className="!text-xl text-grayText " />
                </IconButton>{" "}
              </div>
            </div>
            <div className="col-span-12 grid grid-cols-6 gap-5 flex items-center">
              <FormLabel className="col-span-6">Cores da imobiliária</FormLabel>
              <div className="col-span-1">
                <FormLabel htmlFor="primaryColor">Cor Primária</FormLabel>
                <Controller
                  name="primaryColor"
                  control={control}
                  render={({ field }) => <Input type="color" {...field} />}
                />
              </div>
              <div className="col-span-1">
                <FormLabel htmlFor="secondaryColor">Cor Secundária</FormLabel>
                <Controller
                  name="secondaryColor"
                  control={control}
                  render={({ field }) => <Input type="color" {...field} />}
                />
              </div>
              <div className="col-span-1">
                <FormLabel htmlFor="backgroundColor">Cor de Fundo</FormLabel>
                <Controller
                  name="backgroundColor"
                  control={control}
                  render={({ field }) => <Input type="color" {...field} />}
                />
              </div>
              <div className="col-span-2">
                <Button
                  onClick={() => setSelectColorsModal(true)}
                  variant="soft"
                >
                  Visualizar proposta de exemplo
                </Button>
              </div>
            </div>

            <div className="col-span-12 flex">
              <Controller
                name="logo"
                control={control}
                render={({ field }) => (
                  <PictureInput
                    label="Logo Principal:"
                    value={field.value ? [field.value] : []}
                    onChange={(v) => field.onChange(v)}
                  />
                )}
              />
              <Controller
                name="logo2"
                control={control}
                render={({ field }) => (
                  <PictureInput
                    label="Logo Secundário:"
                    value={field.value ? [field.value] : []}
                    onChange={(v) => field.onChange(v)}
                  />
                )}
              />
            </div>
          </div>
        </form>
      </Paper>
    </div>
  );

  return (
    <>
      <PageStructure loading={loading} content={content} header={header} />
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
        userAdded={() => dispatch(fetchRealEstateUsers())}
      />
      <FloatingButtonList
        buttons={[
          {
            loading: loading,
            onClick: handleSubmit(onSubmit),
            icon: <FaSave />,
          },
        ]}
      />
      <Controller
        name="headerType"
        control={control}
        render={({ field }) => (
          <SelectHeaderTypeModal
            primaryColor={watch("primaryColor")}
            secondaryColor={watch("secondaryColor")}
            backgroundColor={watch("backgroundColor")}
            setValue={(v) => field.onChange(v)}
            open={selectHeaderTypeModal}
            onClose={() => setSelectHeaderTypeModal(false)}
            value={field.value}
          />
        )}
      />
      <Controller
        name="headerType"
        control={control}
        render={({ field }) => (
          <SelectColorsModal
            primaryColor={watch("primaryColor")}
            secondaryColor={watch("secondaryColor")}
            backgroundColor={watch("backgroundColor")}
            setValue={(v) => field.onChange(v)}
            open={selectColorsModal}
            onClose={() => setSelectColorsModal(false)}
            value={field.value}
            onChangeColors={handleColorChange}
          />
        )}
      />
    </>
  );
}
