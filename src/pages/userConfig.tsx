import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
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

export interface UserData {
  name?: string;
  logo?: string;
  logo2?: string;
  agentPhoto?: string;
  office?: string;
  creci?: string;
  address?: string;
  telephone?: string;
  whatsapp?: string;
  instagram?: string;
  facebook?: string;
  linkedin?: string;
}

export default function UserConfig() {
  const userSaved = localStorage.getItem("userData")
    ? JSON.parse(localStorage.getItem("userData")!)
    : {};

  const [form, setForm] = useState<UserData>(userSaved);
  const [uploadLoading, setUploadLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const id = e.target.id;
    const value = e.target.value;

    setForm((prevForm) => ({
      ...prevForm,
      [id]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, type, files, value } = e.target;

    if (type === "file" && files) {
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm((prevForm) => ({
          ...prevForm,
          [id]: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    } else {
      setForm((prevForm) => ({
        ...prevForm,
        [id]: value,
      }));
    }
  };

  const handleSave = async () => {
    setUploadLoading(true);

    let imageUrl, imageUrl2, imageUrl3;

    if (form.logo) {
      imageUrl = await uploadImage(form.logo);
    }
    if (form.logo2) {
      imageUrl2 = await uploadImage(form.logo2);
    }
    if (form.agentPhoto) {
      imageUrl3 = await uploadImage(form.agentPhoto);
    }

    setUploadLoading(false);

    setForm({
      ...form,
      ...(imageUrl && { logo: imageUrl }),
      ...(imageUrl2 && { logo2: imageUrl2 }),
      ...(imageUrl3 && { agentPhoto: imageUrl3 }),
    });

    localStorage.setItem(
      "userData",
      JSON.stringify({
        ...form,
        ...(imageUrl && { logo: imageUrl }),
        ...(imageUrl2 && { logo2: imageUrl2 }),
        ...(imageUrl3 && { agentPhoto: imageUrl3 }),
      })
    );
  };

  return (
    <div className="grid grid-cols-2 px-10 mt-10 gap-x-5">
      <div>
        <form>
          <Card>
            <CardContent className="grid grid-cols-6 mt-5 gap-x-5 gap-y-4">
              <div className="col-span-6">
                <Label htmlFor="name">Nome:</Label>
                <Input
                  onChange={handleChange}
                  type="text"
                  id="name"
                  value={form.name || ""}
                  required
                />
              </div>
              <div className="col-span-4">
                <Label htmlFor="office">Cargo:</Label>
                <Input
                  onChange={handleChange}
                  type="text"
                  id="office"
                  value={form.office}
                  required
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="creci">CRECI:</Label>
                <Input
                  onChange={handleChange}
                  type="text"
                  id="creci"
                  value={form.creci}
                  required
                />
              </div>
              <div className="col-span-6">
                <Label htmlFor="address">Endereço:</Label>
                <Input
                  onChange={handleChange}
                  type="text"
                  id="address"
                  value={form.address}
                  required
                />
              </div>
              <div className="col-span-3">
                <Label htmlFor="logo">Logo da imobiliária:</Label>
                <Input
                  onChange={handleFileChange}
                  type="file"
                  id="logo"
                  required
                />
              </div>
              <div className="col-span-3">
                <Label htmlFor="logo">Logo 2 da imobiliária:</Label>
                <Input
                  onChange={handleFileChange}
                  type="file"
                  id="logo2"
                  required
                />
              </div>
              <div className="col-span-6">
                <Label htmlFor="logo">Foto do agente:</Label>
                <Input
                  onChange={handleFileChange}
                  type="file"
                  id="agentPhoto"
                  required
                />
              </div>
              <div className="col-span-6">
                <Label htmlFor="telephone">Telefone</Label>
                <Input
                  onChange={handleChange}
                  type="text"
                  id="telephone"
                  value={form.telephone}
                  required
                />
              </div>
              <div className="col-span-6">
                <Label htmlFor="whatsapp">Link Whatsapp:</Label>
                <div className="flex items-center">
                  <FaWhatsapp className="text-xl" />

                  <Input
                    className="ms-2"
                    onChange={handleChange}
                    type="text"
                    id="whatsapp"
                    value={form.whatsapp}
                    required
                  />
                </div>
              </div>
              <div className="col-span-6">
                <Label htmlFor="instagram">Link Instagram:</Label>
                <div className="flex items-center">
                  <FaInstagram className="text-xl" />

                  <Input
                    className="ms-2"
                    onChange={handleChange}
                    type="text"
                    id="instagram"
                    value={form.instagram}
                    required
                  />
                </div>
              </div>
              <div className="col-span-6">
                <Label htmlFor="facebook">Link Facebook:</Label>
                <div className="flex items-center">
                  <FaFacebookSquare className="text-xl" />

                  <Input
                    className="ms-2"
                    onChange={handleChange}
                    type="text"
                    id="facebook"
                    value={form.facebook}
                    required
                  />
                </div>
              </div>
              <div className="col-span-6">
                <Label htmlFor="linkedin">Link Linkedin:</Label>
                <div className="flex items-center">
                  <FaLinkedin className="text-xl" />

                  <Input
                    className="ms-2"
                    onChange={handleChange}
                    type="text"
                    id="linkedin"
                    value={form.linkedin}
                    required
                  />
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
