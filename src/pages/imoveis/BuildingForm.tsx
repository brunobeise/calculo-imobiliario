import { useForm, Controller } from "react-hook-form";
import { Building } from "@/types/buildingTypes";
import { useEffect, useState } from "react";
import { uploadImage } from "@/lib/imgur";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import { useAuth } from "@/auth";
import { usePageContext } from "vike-react/usePageContext";

import {
  FormControl,
  FormLabel,
  FormHelperText,
  Input,
  Button,
  Textarea,
} from "@mui/joy";
import PictureInput from "@/components/inputs/PictureInput";
import ItemListInput from "@/components/inputs/ItemListInput";
import FloatingButtonList from "@/components/shared/FloatingButtonList";
import { BuildingCategorySelect } from "@/components/inputs/BuildingCategorySelect";
import CurrencyInput from "@/components/inputs/CurrencyInput";
import ConfirmationModal from "@/components/modals/ConfirmationModal";
import { FaSave, FaTrash } from "react-icons/fa";
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";
import { FontSelect } from "@/components/inputs/FontSelect";

interface BuildingFormProps {
  initialData: Partial<Building>;
  onSubmit: (building: Partial<Building>) => void;
  onUpdate: (building: Partial<Building>) => void;
}

export default function BuildingForm({
  initialData,
  onSubmit,
  onUpdate,
}: BuildingFormProps) {
  const pageContext = usePageContext();
  const { id } = pageContext.routeParams;

  const {
    control,
    register,
    handleSubmit,
    setValue,
    watch,
    getValues,
    formState: { errors },
  } = useForm<Partial<Building>>({
    defaultValues: initialData || {
      mainPhoto: undefined,
      additionalPhotos: [],
      propertyName: "",
      value: undefined,
      address: "",
      description: "",
      subtitle: "",
      features: [],
      bedrooms: "",
      suites: "",
      bathrooms: "",
      parkingSpaces: "",
      builtArea: "",
      landArea: "",
      cod: "",
    },
  });

  const { user } = useAuth();
  const [saveLoading, setSaveLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

  const handleUpdate = () => {
    if (onUpdate) {
      onUpdate(getValues());
    }
  };

  useEffect(() => {
    if (initialData) {
      Object.keys(initialData).forEach((key) => {
        if (key in initialData) {
          setValue(key as keyof Building, initialData[key]);
        }
      });
    }
  }, [initialData, setValue]);

  const submitHandler = async (data) => {
    setSaveLoading(true);

    let uploadMainPhoto = data.mainPhoto;
    if (data.mainPhoto && !data.mainPhoto.includes("https://")) {
      uploadMainPhoto = await uploadImage(data.mainPhoto);
    }

    const uploadAdditionalPhotos = await Promise.all(
      data.additionalPhotos.map(async (photo) => {
        if (photo && !photo.includes("https://")) {
          return await uploadImage(photo);
        }
        return photo;
      })
    );

    onSubmit({
      ...data,
      mainPhoto: uploadMainPhoto,
      additionalPhotos: uploadAdditionalPhotos,
    });

    setSaveLoading(false);
  };

  const handleDelete = async () => {
    onSubmit({
      id: initialData?.id,
      isArchived: true,
    });
  };

  const mainPhoto = watch("mainPhoto");
  const additionalPhotos = watch("additionalPhotos");

  const handleDrop = (image: string, source: string) => {
    if (source === "Foto Principal") {
      setValue("additionalPhotos", [...additionalPhotos, mainPhoto]);
      setValue("mainPhoto", "");
      handleUpdate();
    } else if (source === "Fotos Adicionais") {
      const newAdditionalPhotos = additionalPhotos.filter(
        (img) => img !== image
      );
      if (mainPhoto) newAdditionalPhotos.push(mainPhoto);
      setValue("mainPhoto", image);
      setValue("additionalPhotos", newAdditionalPhotos);
      handleUpdate();
    }
  };

  const createLoading =
    useSelector((state: RootState) => state.building.createBuildingLoading) ||
    saveLoading;

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="">
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
          rules={{ required: "A foto principal é obrigatória" }}
          render={({ field }) => (
            <PictureInput
              label="Foto Principal"
              value={[field.value]}
              onChange={(v) => {
                setValue("mainPhoto", v);
                handleUpdate();
              }}
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
              label="Fotos Adicionais"
              multiple
              value={field.value}
              onChange={(v) => {
                console.log(v);

                setValue("additionalPhotos", v.split(","));
                handleUpdate();
              }}
              onDrop={(image, source) => handleDrop(image, source)}
            />
          )}
        />
      </div>

      <div className="flex-1 grid grid-cols-2 gap-5 mt-5">
        <div className="col-span-2">
          <FormControl error={!!errors[id]}>
            <FormLabel htmlFor={id}>Nome: *</FormLabel>
            <Input
              id="propertyName"
              slotProps={{
                input: {
                  style: {
                    fontFamily: watch("propertyNameFont"),
                  },
                },
              }}
              placeholder={`Digite o nome do imóvel`}
              {...register("propertyName")}
              onChange={(e) => {
                register("propertyName").onChange(e);
                handleUpdate();
              }}
              endDecorator={
                <FontSelect
                  control={control}
                  error={errors.propertyNameFont}
                  name={"propertyNameFont"}
                  onChange={() => handleUpdate()}
                />
              }
            />
            {errors[id] && (
              <FormHelperText>{errors[id].message}</FormHelperText>
            )}
          </FormControl>
        </div>

        <div className="col-span-2">
          <Controller
            name="value"
            control={control}
            render={({ field }) => (
              <FormControl error={!!errors.value}>
                <FormLabel htmlFor="value">Valor</FormLabel>
                <CurrencyInput
                  noHeight
                  {...field}
                  label=""
                  onChange={(v) => {
                    const value = Number(v.target.value);
                    setValue("value", value > 0 ? value : null);
                    handleUpdate();
                  }}
                />
                {errors.value && (
                  <FormHelperText>{errors.value.message}</FormHelperText>
                )}
              </FormControl>
            )}
          />
        </div>

        <InputField
          id="address"
          label="Endereço *"
          register={register}
          errors={errors}
          onChange={handleUpdate}
          required
        />

        <div className="col-span-2">
          <FormControl error={!!errors.subtitle}>
            <FormLabel htmlFor="subtitle">Subtítulo</FormLabel>
            <Textarea
              id="subtitle"
              minRows={2}
              placeholder="Digite um subtítulo"
              {...register("subtitle")}
              onChange={(e) => {
                setValue("subtitle", e.target.value);
                handleUpdate();
              }}
            />
            {errors.subtitle && (
              <FormHelperText>{errors.subtitle.message}</FormHelperText>
            )}
          </FormControl>
        </div>

        <div className="col-span-2">
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <div className="flex flex-col gap-2">
                <FormLabel>Descrição</FormLabel>
                <SimpleEditor
                  content={field.value}
                  onUpdate={(newHtml) => {
                    setValue("description", newHtml);
                    handleUpdate();
                  }}
                />
              </div>
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

        <InputField
          id="bedrooms"
          label="Dormitórios"
          register={register}
          errors={errors}
          onChange={handleUpdate}
        />
        <InputField
          id="suites"
          label="Suítes"
          register={register}
          errors={errors}
          onChange={handleUpdate}
        />
        <InputField
          id="bathrooms"
          label="Banheiros"
          register={register}
          errors={errors}
          onChange={handleUpdate}
        />
        <InputField
          id="parkingSpaces"
          label="Vagas"
          register={register}
          errors={errors}
          onChange={handleUpdate}
        />
        <InputField
          id="builtArea"
          label="Área Construída (m²)"
          register={register}
          errors={errors}
          onChange={handleUpdate}
        />
        <InputField
          id="landArea"
          label="Área Terreno (m²)"
          register={register}
          errors={errors}
          onChange={handleUpdate}
        />

        <InputField
          id="cod"
          label="Código"
          register={register}
          errors={errors}
          onChange={handleUpdate}
        />

        <div className="col-span-2">
          <Controller
            name="features"
            control={control}
            render={({ field }) => (
              <ItemListInput
                {...field}
                label="Características"
                items={field.value}
                onChange={(v) => {
                  setValue("features", v);
                  handleUpdate();
                }}
              />
            )}
          />
        </div>
        {(user.owner || user.id === initialData?.creator?.id) &&
          id !== "novo" && (
            <div className="col-span-2 flex justify-start pt-5">
              <Button
                onClick={() => setDeleteModal(true)}
                color="danger"
                endDecorator={<FaTrash />}
              >
                Excluir
              </Button>
            </div>
          )}
      </div>

      <ConfirmationModal
        open={deleteModal}
        onClose={() => setDeleteModal(false)}
        content="Deseja excluir permanentemente este imóvel?"
        onOk={handleDelete}
        okLoading={createLoading}
      />
    </form>
  );
}

// Subcomponente genérico
function InputField({
  id,
  label,
  register,
  errors,
  onChange,
  required = false,
}) {
  return (
    <div className="col-span-2">
      <FormControl error={!!errors[id]}>
        <FormLabel htmlFor={id}>{label}</FormLabel>
        <Input
          id={id}
          placeholder={`Digite ${label.toLowerCase()}`}
          {...register(
            id,
            required ? { required: `${label} é obrigatório` } : {}
          )}
          onChange={(e) => {
            register(id).onChange(e);
            if (onChange) onChange();
          }}
        />
        {errors[id] && <FormHelperText>{errors[id].message}</FormHelperText>}
      </FormControl>
    </div>
  );
}
