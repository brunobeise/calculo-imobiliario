// components/RealEstateConfig.tsx
import { useEffect, useState } from "react";
import { Button, Card, CardContent, FormLabel, Input, Table } from "@mui/joy";
import PictureInput from "@/components/inputs/PictureInput";
import GlobalLoading from "@/components/Loading";
import { uploadImage } from "@/lib/imgur";
import { realEstateService } from "@/service/realEstateService";
import { FaCheckCircle } from "react-icons/fa";
import { IoCloseOutline } from "react-icons/io5";
import { userService } from "@/service/userService";
import ConfirmationModal from "@/components/modals/ConfirmationModal";
import { useAuth } from "@/auth";
import { navigate } from "vike/client/router";
import { IoAddCircleSharp } from "react-icons/io5";
import { RealEstate } from "@/types/realEstateTypes";
import { User } from "@/types/userTypes";
import UserFormModal from "@/components/modals/UserFormModal";

export default function RealEstateConfig() {
  const [form, setForm] = useState<Partial<RealEstate>>();
  const [users, setUsers] = useState<User[]>([]);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [loading, setLoading] = useState(false);
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

    setForm((prevForm) => ({
      ...prevForm,
      [id]: value,
    }));
  };

  const handleSave = async () => {
    if (!form || !form.id) return;

    setUploadLoading(true);

    let uploadLogo = form.logo;
    let uploadLogo2 = form.logo2;

    if (form.logo && !form.logo.includes("res.cloudinary.com")) {
      uploadLogo = await uploadImage(form.logo);
    }
    if (form.logo2 && !form.logo2.includes("res.cloudinary.com")) {
      uploadLogo2 = await uploadImage(form.logo2);
    }

    await realEstateService.editRealEstate(form.id, {
      ...form,
      users: undefined,
      logo: uploadLogo,
      logo2: uploadLogo2,
    });

    setForm({
      ...form,
      logo: uploadLogo,
      logo2: uploadLogo2,
    });
    setUploadLoading(false);
  };

  useEffect(() => {
    if (!User || !User.owner) {
      navigate("/");
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await realEstateService.getRealEstateData();
        setForm(data);
        setUsers(data.users);
      } catch (error) {
        console.error("Erro ao obter dados:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [User, navigate]);

  const handleAdmin = async () => {
    setChangeAdminUser({
      ...changeAdminUser,
      loading: true,
    });

    await userService.editUser(changeAdminUser.userId, {
      owner: !changeAdminUser.owner,
    });

    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === changeAdminUser.userId
          ? { ...user, owner: !user.owner }
          : user
      )
    );

    setChangeAdminUser({
      text: "",
      userId: "",
      owner: false,
      loading: false,
    });
  };

  if (loading && !form) return <GlobalLoading />;

  return (
    <div>
      <div className="flex gap-5 justify-center items-center">
        <img className="h-[50px]" src={form?.logo} alt="" />
        <h2 className="font-bold text-4xl">{form?.name}</h2>
      </div>
      <div className="px-10 mt-10 grid grid-cosl-1 lg:grid-cols-2 gap-5">
        <Card>
          <CardContent>
            <form>
              <div className="grid grid-cols-6 gap-x-5 gap-y-4">
                <div className="col-span-6">
                  <FormLabel htmlFor="name">Nome da Imobiliária:</FormLabel>
                  <Input
                    onChange={handleChange}
                    type="text"
                    id="name"
                    value={form?.name || ""}
                    required
                  />
                </div>
                <div className="col-span-6">
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
                      setForm({
                        ...form,
                        logo: v,
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
                      setForm({
                        ...form,
                        logo2: v,
                      })
                    }
                  />
                </div>
              </div>
            </form>
            <div className="mt-10 text-center">
              <Button
                loading={uploadLoading}
                disabled={uploadLoading}
                onClick={handleSave}
                className="w-32"
              >
                Salvar
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold mb-4">
                Usuários da Imobiliária
              </h2>
              <Button
                onClick={() => setUserFormModal(true)}
                endDecorator={<IoAddCircleSharp />}
              >
                Novo usuário
              </Button>
            </div>

            {users.length > 0 ? (
              <Table size="lg">
                <thead>
                  <tr>
                    <th className="w-[60px]"></th>
                    <th>Nome</th>
                    <th>Cargo</th>
                    <th className="w-[80px]">Admin</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
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

                      <td>{user.role}</td>
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
          </CardContent>
        </Card>
      </div>

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
        userAdded={(user) => setUsers([...users, user])}
      />
    </div>
  );
}
