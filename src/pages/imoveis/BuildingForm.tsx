/* eslint-disable @typescript-eslint/no-unused-vars */
import { useForm, Controller } from "react-hook-form";
import PictureInput from "@/components/inputs/PictureInput";
import TextInput from "@/components/inputs/TextInput";
import ItemListInput from "@/components/inputs/ItemListInput";
import FloatingButtonList from "@/components/shared/FloatingButtonList";
import { FaSave, FaTrash } from "react-icons/fa";
import { Building } from "@/types/buildingTypes";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useEffect, useState } from "react";
import { uploadImage } from "@/lib/imgur";
import { BuildingCategorySelect } from "@/components/inputs/BuildingCategorySelect";
import { Button } from "@mui/joy";
import ConfirmationModal from "@/components/modals/ConfirmationModal";
import { useAuth } from "@/auth";

export default function BuildingForm({ initialData, onSubmit }) {
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
  } = useForm<Partial<Building>>({
    defaultValues: initialData || {
      mainPhoto: "",
      additionalPhotos: [],
      propertyName: "",
      description: "",
      address: "",
      suites: "",
      bathrooms: "",
      parkingSpaces: "",
      builtArea: "",
      landArea: "",
      cod: "",
      features: [],
    },
  });

  const [saveLoading, setSaveLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

  useEffect(() => {
    if (initialData) {
      Object.keys(initialData).forEach((key) => {
        if (key in initialData) {
          setValue(key as keyof Building, initialData[key]);
        }
      });
    }
  }, [initialData, setValue]);

  const { user } = useAuth();

  const submitHandler = async (data) => {
    setSaveLoading(true);

    let uploadMainPhoto = data.mainPhoto;

    if (data.mainPhoto && !data.mainPhoto.includes("res.cloudinary.com")) {
      uploadMainPhoto = await uploadImage(data.mainPhoto);
    }

    const uploadAdditionalPhotos = await Promise.all(
      data.additionalPhotos.map(async (photo) => {
        if (photo && !photo.includes("res.cloudinary.com")) {
          const uploadedPhoto = await uploadImage(photo);
          return uploadedPhoto;
        }
        return photo;
      })
    );

    const { screenshot, photos, amenities, ...building } = data;

    onSubmit({
      ...building,
      mainPhoto: uploadMainPhoto,
      additionalPhotos: uploadAdditionalPhotos,
    });

    setSaveLoading(false);
  };

  const handleDelete = async () => {
    onSubmit({
      id: initialData.id,
      isArchived: true,
    });
  };

  const mainPhoto = watch("mainPhoto");
  const additionalPhotos = watch("additionalPhotos");

  const handleDrop = (image: string, source: string) => {
    if (source === "Foto Principal do Imóvel") {
      setValue("additionalPhotos", [...additionalPhotos, mainPhoto]);
      setValue("mainPhoto", "");
    } else if (source === "Fotos Adicionais do Imóvel") {
      const newAdditionalPhotos = additionalPhotos.filter(
        (img) => img !== image
      );
      if (mainPhoto) {
        newAdditionalPhotos.push(mainPhoto);
      }
      setValue("mainPhoto", image);
      setValue("additionalPhotos", newAdditionalPhotos);
    }
  };

  const createLoading =
    useSelector((state: RootState) => state.building.createBuildingLoading) ||
    saveLoading;

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="flex gap-10">
      <FloatingButtonList
        buttons={[
          {
            loading: createLoading,
            onClick: handleSubmit(submitHandler),
            icon: <FaSave />,
          },
        ]}
      />
      <div className="flex-1 flex flex-col gap-5">
        <Controller
          name="mainPhoto"
          control={control}
          rules={{
            required: "A imagem principal é obrigatória.",
          }}
          render={({ field }) => (
            <PictureInput
              label="Foto Principal do Imóvel"
              value={[field.value]}
              onChange={(v) => setValue("mainPhoto", v)}
              error={errors.mainPhoto?.message}
              onDrop={(image, source) => handleDrop(image, source)}
            />
          )}
        />
        <Controller
          name="additionalPhotos"
          control={control}
          render={({ field }) => (
            <PictureInput
              label="Fotos Adicionais do Imóvel"
              multiple
              value={field.value}
              onChange={(v) => setValue("additionalPhotos", v.split(","))}
              onDrop={(image, source) => handleDrop(image, source)}
            />
          )}
        />
        <Controller
          name="features"
          control={control}
          render={({ field }) => (
            <ItemListInput
              {...field}
              label="Características do Imóvel"
              items={field.value}
              onChange={(v) => setValue("features", v)}
            />
          )}
        />
      </div>

      <div className="flex-1 grid grid-cols-2 gap-2 h-min">
        <div className="col-span-2">
          <Controller
            name="propertyName"
            control={control}
            rules={{
              required: "O nome do imóvel é obrigatório.",
              minLength: { value: 3, message: "Mínimo de 3 caracteres." },
              maxLength: { value: 50, message: "Máximo de 50 caracteres." },
            }}
            render={({ field }) => (
              <TextInput
                {...field}
                label="Nome do Imóvel"
                onChange={(v) => setValue("propertyName", v)}
                error={errors.propertyName?.message}
              />
            )}
          />
        </div>
        <div className="col-span-2">
          <BuildingCategorySelect
            control={control}
            name="category"
            error={errors.category}
          />
        </div>
        <div className="col-span-2">
          <Controller
            name="description"
            control={control}
            rules={{
              maxLength: { value: 200, message: "Máximo de 200 caracteres." },
            }}
            render={({ field }) => (
              <TextInput
                {...field}
                isTextarea
                label="Descrição do Imóvel"
                onChange={(v) => setValue("description", v)}
                error={errors.description?.message}
              />
            )}
          />
        </div>
        <div className="col-span-2">
          <Controller
            name="address"
            control={control}
            rules={{
              required: "O endereço é obrigatório.",
              minLength: { value: 5, message: "Mínimo de 5 caracteres." },
              maxLength: { value: 100, message: "Máximo de 100 caracteres." },
            }}
            render={({ field }) => (
              <TextInput
                {...field}
                label="Endereço do Imóvel"
                onChange={(v) => setValue("address", v)}
                error={errors.address?.message}
              />
            )}
          />
        </div>
        <Controller
          name="suites"
          control={control}
          rules={{}}
          render={({ field }) => (
            <TextInput
              {...field}
              label="Número de Quartos"
              onChange={(v) => setValue("suites", v)}
              error={errors.suites?.message}
            />
          )}
        />
        <Controller
          name="bathrooms"
          control={control}
          render={({ field }) => (
            <TextInput
              {...field}
              label="Número de Banheiros"
              onChange={(v) => setValue("bathrooms", v)}
              error={errors.bathrooms?.message}
            />
          )}
        />
        <Controller
          name="parkingSpaces"
          control={control}
          render={({ field }) => (
            <TextInput
              {...field}
              label="Número de Vagas"
              onChange={(v) => setValue("parkingSpaces", v)}
              error={errors.parkingSpaces?.message}
            />
          )}
        />
        <Controller
          name="builtArea"
          control={control}
          render={({ field }) => (
            <TextInput
              {...field}
              label="Área Construída (m²)"
              onChange={(v) => setValue("builtArea", v)}
              error={errors.builtArea?.message}
            />
          )}
        />
        <Controller
          name="landArea"
          control={control}
          render={({ field }) => (
            <TextInput
              {...field}
              label="Área do Terreno (m²)"
              onChange={(v) => setValue("landArea", v)}
              error={errors.landArea?.message}
            />
          )}
        />
        <Controller
          name="cod"
          control={control}
          rules={{
            maxLength: { value: 20, message: "Máximo de 20 caracteres." },
          }}
          render={({ field }) => (
            <TextInput
              {...field}
              label="Código do Imóvel"
              onChange={(v) => setValue("cod", v)}
              error={errors.cod?.message}
            />
          )}
        />
        {(user.owner || user.id === initialData?.creator?.id) &&
          initialData && (
            <div className="ps-3">
              <Button
                onClick={() => setDeleteModal(true)}
                endDecorator={<FaTrash />}
                color="danger"
              >
                Excluir
              </Button>
            </div>
          )}
      </div>
      <ConfirmationModal
        open={deleteModal}
        onClose={() => setDeleteModal(false)}
        content="Deseja excluir permanentemente esse imóvel?"
        onOk={handleDelete}
        okLoading={createLoading}
      />
    </form>
  );
}
