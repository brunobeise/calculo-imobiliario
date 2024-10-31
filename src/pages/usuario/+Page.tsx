import { useEffect, useState } from "react";
import {
  FaFacebookSquare,
  FaInstagram,
  FaLinkedin,
  FaSave,
  FaUser,
  FaWhatsapp,
} from "react-icons/fa";
import { uploadImage } from "@/lib/imgur";
import { FormLabel, Input } from "@mui/joy";
import PictureInput from "@/components/inputs/PictureInput";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { editUserData, fetchUserData } from "@/store/userReducer";
import { User } from "@/types/userTypes";
import PageStructure from "@/components/structure/PageStructure";
import FloatingButtonList from "@/components/shared/FloatingButtonList";
import UserSignature2 from "@/components/user/UserSignature2";

export default function UserConfig() {
  const dispatch = useDispatch<AppDispatch>();
  const { userData, loading } = useSelector((state: RootState) => state.user);
  const [form, setForm] = useState<User>({
    email: "",
    createdAt: new Date(),
    fullName: "",
    owner: false,
    phone: "",
    realEstateId: "",
    role: "",
    updatedAt: new Date(),
    address: "",
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const id = e.target.id;
    const value = e.target.value;

    setForm((prevForm) => ({
      ...(prevForm ?? {}),
      [id]: value,
    }));
  };

  const handleSave = async () => {
    if (!form || !form.id) return;

    let uploadPhoto = form.photo;

    if (form.photo && !form.photo.includes("res.cloudinary.com")) {
      uploadPhoto = await uploadImage(form.photo);
    }

    dispatch(
      editUserData({
        ...form,
        realEstate: undefined,
        photo: uploadPhoto,
      })
    );
  };

  useEffect(() => {
    if (!userData) {
      dispatch(fetchUserData());
    }
  }, [dispatch, userData]);

  useEffect(() => {
    if (userData) setForm(userData);
  }, [userData]);

  const header = (
    <div className="w-full flex items-center text-primary gap-2  text-2xl ms-4 mt-8 mb-3">
      <FaUser className="text-xl" />
      <h2 className="font-bold">Meus dados</h2>
    </div>
  );

  const contentHeader = !loading && userData && (
    <UserSignature2
      title="Assinatura Exemplo"
      desc="Nome do imóvel"
      userData={form}
    />
  );

  const content = (
    <div>
      <div className="grid grid-cols-6 gap-x-5 gap-y-3">
        <div className="col-span-6">
          <PictureInput
            bordered
            value={form?.photo ? [form?.photo] : []}
            label="Foto:"
            onChange={(v) =>
              setForm({
                ...form,
                photo: v,
              })
            }
          />
        </div>
        <div className="col-span-3">
          <FormLabel htmlFor="fullName">Nome:</FormLabel>
          <Input
            onChange={handleChange}
            type="text"
            id="fullName"
            value={form?.fullName || ""}
            required
          />
        </div>
        <div className="col-span-3">
          <FormLabel htmlFor="role">Cargo:</FormLabel>
          <Input
            onChange={handleChange}
            type="text"
            id="role"
            value={form?.role}
            required
          />
        </div>
        <div className="col-span-3">
          <FormLabel htmlFor="creci">CRECI:</FormLabel>
          <Input
            onChange={handleChange}
            type="text"
            id="creci"
            value={form?.creci}
            required
          />
        </div>

        <div className="col-span-3">
          <FormLabel htmlFor="phone">Telefone:</FormLabel>
          <Input
            onChange={handleChange}
            type="text"
            id="phone"
            value={form?.phone}
            required
          />
        </div>

        <div className="col-span-6 grid grid-cols-4 gap-5">
          <div>
            <FormLabel htmlFor="whatsapp">Link Whatsapp:</FormLabel>
            <div className="flex items-center">
              <FaWhatsapp className="text-xl" />

              <Input
                className="w-full ms-2"
                onChange={handleChange}
                type="text"
                id="whatsapp"
                value={form?.whatsapp}
                required
              />
            </div>
          </div>
          <div>
            <FormLabel htmlFor="instagram">Link Instagram:</FormLabel>
            <div className="flex items-center">
              <FaInstagram className="text-xl" />

              <Input
                className="w-full ms-2"
                onChange={handleChange}
                type="text"
                id="instagram"
                value={form?.instagram}
                required
              />
            </div>
          </div>
          <div>
            <FormLabel htmlFor="facebook">Link Facebook:</FormLabel>
            <div className="flex items-center">
              <FaFacebookSquare className="text-xl" />

              <Input
                className="w-full ms-2"
                onChange={handleChange}
                type="text"
                id="facebook"
                value={form?.facebook}
                required
              />
            </div>
          </div>
          <div>
            <FormLabel htmlFor="linkedin">Link Linkedin:</FormLabel>
            <div className="flex items-center">
              <FaLinkedin className="text-xl" />

              <Input
                className="w-full ms-2"
                onChange={handleChange}
                type="text"
                id="linkedin"
                value={form?.linkedin}
                required
              />
            </div>
          </div>
        </div>

        <FloatingButtonList
          buttons={[
            {
              loading: loading,
              onClick: handleSave,
              icon: <FaSave />,
            },
          ]}
        />
      </div>
    </div>
  );

  return (
    <PageStructure
      loading={loading && !userData}
      content={content}
      contentHeader={contentHeader}
      header={header}
    />
  );
}
