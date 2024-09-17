import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import ReactLoading from "react-loading";
import {
  FaFacebookSquare,
  FaInstagram,
  FaLinkedin,
  FaSave,
  FaWhatsapp,
} from "react-icons/fa";
import { uploadImage } from "@/lib/imgur";
import UserSignature from "@/components/user/UserSignature";
import UserSignature2 from "@/components/user/UserSignature2";
import { userService } from "@/service/userService";
import GlobalLoading from "@/components/GlobalLoading";
import { Card, CardContent, FormLabel, Input } from "@mui/joy";
import PictureInput from "@/components/inputs/PictureInput";

export interface UserData {
  id?: string;
  fullName?: string;
  logo?: string;
  logo2?: string;
  photo?: string;
  role?: string;
  creci?: string;
  address?: string;
  phone?: string;
  whatsapp?: string;
  instagram?: string;
  facebook?: string;
  linkedin?: string;
}

export default function UserConfig() {
  const [form, setForm] = useState<UserData>();
  const [uploadLoading, setUploadLoading] = useState(false);
  const [loading, setLoading] = useState(false);

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
    let uploadPhoto = form.photo;

    if (form.photo && !form.photo.includes("res.cloudinary.com")) {
      uploadPhoto = await uploadImage(form.photo);
    }

    await userService.editUser(form.id, {
      ...form,
      photo: uploadPhoto,
    });

    localStorage.setItem(
      "userData",
      JSON.stringify({
        ...form,
        photo: uploadPhoto,
      })
    );

    setUploadLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    userService
      .getUserData()
      .then((data) => {
        setForm(data);
        localStorage.setItem("userData", JSON.stringify(data));
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <GlobalLoading />;

  return (
    <div className="grid grid-cols-2 px-10 mt-10 gap-x-5">
      <div>
        <form>
          <Card>
            <CardContent>
              <div className="grid grid-cols-6 gap-x-5 gap-y-4">
                <div className="col-span-6">
                  <FormLabel htmlFor="fullName">Nome:</FormLabel>
                  <Input
                    onChange={handleChange}
                    type="text"
                    id="fullName"
                    value={form?.fullName || ""}
                    required
                  />
                </div>
                <div className="col-span-4">
                  <FormLabel htmlFor="role">Cargo:</FormLabel>
                  <Input
                    onChange={handleChange}
                    type="text"
                    id="role"
                    value={form?.role}
                    required
                  />
                </div>
                <div className="col-span-2">
                  <FormLabel htmlFor="creci">CRECI:</FormLabel>
                  <Input
                    onChange={handleChange}
                    type="text"
                    id="creci"
                    value={form?.creci}
                    required
                  />
                </div>
                <div className="col-span-6">
                  <FormLabel htmlFor="address">Endereço:</FormLabel>
                  <Input
                    onChange={handleChange}
                    type="text"
                    id="address"
                    value={form?.address}
                    required
                  />
                </div>

                <div className="col-span-6">
                  <PictureInput
                    bordered
                    value={form?.photo ? [form?.photo] : []}
                    label="Foto do agente:"
                    onChange={(v) =>
                      setForm({
                        ...form,
                        photo: v,
                      })
                    }
                  />
                </div>
                <div className="col-span-6">
                  <FormLabel htmlFor="phone">Telefone:</FormLabel>
                  <Input
                    onChange={handleChange}
                    type="text"
                    id="phone"
                    value={form?.phone}
                    required
                  />
                </div>

                <div className="col-span-3">
                  <FormLabel htmlFor="whatsapp">Link Whatsapp:</FormLabel>
                  <div className="flex items-center">
                    <FaWhatsapp className="text-xl" />

                    <Input
                      className="ms-2 w-full"
                      onChange={handleChange}
                      type="text"
                      id="whatsapp"
                      value={form?.whatsapp}
                      required
                    />
                  </div>
                </div>
                <div className="col-span-3">
                  <FormLabel htmlFor="instagram">Link Instagram:</FormLabel>
                  <div className="flex items-center">
                    <FaInstagram className="text-xl" />

                    <Input
                      className="ms-2 w-full"
                      onChange={handleChange}
                      type="text"
                      id="instagram"
                      value={form?.instagram}
                      required
                    />
                  </div>
                </div>
                <div className="col-span-3">
                  <FormLabel htmlFor="facebook">Link Facebook:</FormLabel>
                  <div className="flex items-center">
                    <FaFacebookSquare className="text-xl" />

                    <Input
                      className="ms-2 w-full"
                      onChange={handleChange}
                      type="text"
                      id="facebook"
                      value={form?.facebook}
                      required
                    />
                  </div>
                </div>
                <div className="col-span-3">
                  <FormLabel htmlFor="linkedin">Link Linkedin:</FormLabel>
                  <div className="flex items-center">
                    <FaLinkedin className="text-xl" />

                    <Input
                      className="ms-2 w-full"
                      onChange={handleChange}
                      type="text"
                      id="linkedin"
                      value={form?.linkedin}
                      required
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
      <Card className="h-min">
        <CardContent className="mt-4">
          <div className="flex justify-center flex-col gap-10 items-center">
            <UserSignature userData={form} />
            <UserSignature2 userData={form} />
          </div>
          <div className="mt-10 text-center">
            <Button
              disabled={uploadLoading}
              onClick={handleSave}
              className="w-32"
            >
              {uploadLoading ? (
                <ReactLoading type="spin" width={20} height={20} />
              ) : (
                <>
                  <FaSave className="me-2" /> Salvar
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
