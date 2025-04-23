import PageStructure from "@/components/structure/PageStructure";
import {
  createBuilding,
  fetchBuildingById,
  updateBuilding,
} from "@/store/buildingReducer";
import { AppDispatch, RootState } from "@/store/store";
import { useEffect, useState } from "react";
import {
  FaArrowLeft,
  FaBuilding,
  FaCheckCircle,
  FaEye,
  FaMapMarkerAlt,
  FaPen,
} from "react-icons/fa";

import { useDispatch, useSelector } from "react-redux";
import { usePageContext } from "vike-react/usePageContext";
import dayjs from "dayjs";
import BuildingForm from "../BuildingForm";
import type { Building } from "@/types/buildingTypes";
import { Button } from "@mui/joy";
import { navigate } from "vike/client/router";
import { FaLink } from "react-icons/fa6";
import ScrapModal from "@/pages/scrap/ScrapModal";
import { useAuth } from "@/auth";
import { toBRL } from "@/lib/formatter";
import ImobziSingleImportModal from "@/components/modals/ImobziSingleModal";

export default function Building() {
  const pageContext = usePageContext();
  const dispatch = useDispatch<AppDispatch>();
  const { id } = pageContext.routeParams;

  const { user } = useAuth();

  const loading = useSelector((state: RootState) => state.building.loading);
  const building = useSelector((state: RootState) => state.building.building);

  const [scrapModal, setScrapModal] = useState(false);
  const [edit, setEdit] = useState(false);
  const [initialData, setInitialData] = useState<Partial<Building> | undefined>(
    id === "novo" ? undefined : building
  );
  const [imobziModal, setImobziModal] = useState(false);

  const newBuilding = id === "novo";

  useEffect(() => {
    if (id && !newBuilding) dispatch(fetchBuildingById(id));
  }, [dispatch, id, newBuilding]);

  useEffect(() => {
    if (!newBuilding) {
      setInitialData(building);
    }
  }, [building, newBuilding]);

  const handleCreateBuilding = async (data: Partial<Building>) => {
    if (newBuilding) {
      const result = await dispatch(createBuilding(data)).unwrap();
      navigate("/imoveis/" + result.id);
    } else {
      await dispatch(updateBuilding({ buildingId: data.id, data }));
      await dispatch(fetchBuildingById(id));
      if (data.isArchived) navigate("/imoveis");
    }
  };

  const handleScrapResult = (data: Partial<Building>) => {
    setInitialData(data);
    setScrapModal(false);
  };

  const header = (
    <div className="flex justify-between items-center pe-4">
      <div className="flex items-center text-primary gap-2 text-2xl ms-4 mt-8 mb-3 min-w-[250px]">
        <Button onClick={() => navigate("/imoveis")} variant="plain">
          <FaArrowLeft />
        </Button>
        <FaBuilding className="text-xl" />
        <h2 className="font-bold">
          {newBuilding ? "Novo Imóvel" : building?.propertyName}
        </h2>
      </div>

      <div className="flex gap-4">
        {!newBuilding && user.id === building?.creator?.id && (
          <Button
            onClick={() => setEdit(!edit)}
            endDecorator={edit ? <FaEye /> : <FaPen />}
          >
            {edit ? "Visualizar Imóvel" : "Editar Imóvel"}
          </Button>
        )}
        {user.imobzi && newBuilding && (
          <Button
            className="!mt-4"
            variant="outlined"
            onClick={() => setImobziModal(true)}
            endDecorator={
              <img
                className="w-7"
                src="https://play-lh.googleusercontent.com/D99YQI9BnlZXfwHApFEZVX50OaJYZ1UadsvxUA2itNoyjsQpGCdoZ61wGGz3rjspRvzU=w240-h480-rw"
              />
            }
          >
            Importar do Imobzi
          </Button>
        )}
        {newBuilding && (
          <Button
            className="!mt-4"
            onClick={() => setScrapModal(true)}
            endDecorator={<FaLink />}
          >
            Importar com link
          </Button>
        )}
      </div>
    </div>
  );

  const content = building && (
    <div className="flex w-full  text-primary">
      <div className="w-[80%]">
        <img className="rounded-lg w-full" src={building?.mainPhoto} alt="" />
        {building?.additionalPhotos.length > 0 && (
          <div className="mt-2 w-full flex flex-wrap gap-2">
            {building?.additionalPhotos.map((p) => (
              <div className="relative  max-w-[30%]">
                <img src={p} className="w-full h-full object-cover rounded" />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="px-12 pt-6 mb-10 w-full">
        <div className="grid grid-cols-1 gap-4 mb-4 text-lg">
          <div className="flex flex-col gap-2">
            {building?.value && (
              <p>
                <strong>Valor do imóvel:</strong> {toBRL(building.value)}{" "}
              </p>
            )}
            {building?.bedrooms && (
              <p>
                <strong>Dormitórios:</strong> {building?.bedrooms}{" "}
                {building.suites ? `(${building.suites} suítes)` : ""}
              </p>
            )}
            {building?.bathrooms && (
              <p>
                <strong>Banheiros:</strong> {building?.bathrooms}
              </p>
            )}
            {building?.parkingSpaces && (
              <p>
                <strong>Vagas:</strong> {building?.parkingSpaces}
              </p>
            )}
            {building?.builtArea && (
              <p>
                <strong>Área construída:</strong> {building?.builtArea}m²
              </p>
            )}

            {building?.landArea && (
              <p>
                <strong>Área do terreno:</strong> {building?.landArea}m²
              </p>
            )}
          </div>

          {building?.address && (
            <div className="text-lg">
              <div className="flex items-center mb-2">
                <FaMapMarkerAlt size={16} className="mr-2" />
                <strong>Localização</strong>
              </div>
              <p>{building?.address}</p>
            </div>
          )}
        </div>

        {building?.features?.length > 0 && (
          <div className="text-lg">
            <strong className="block mb-3">Características</strong>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-4 text-sm">
              {building.features.map((feature, index) => (
                <div key={index} className="flex items-center">
                  <FaCheckCircle className="flex-shrink-0 w-4 h-4" />
                  <span className="ml-2">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {building?.createdAt && (
          <p className="mt-5">
            <strong>Criado em:</strong>{" "}
            {dayjs(building?.createdAt).format("YYYY-MM-DD")}
          </p>
        )}

        <div className="flex items-center text-sm mt-2">
          <div className="rounded-full overflow-hidden flex justify-center items-center w-[25px] h-[25px]">
            <img
              src={
                building?.creator?.photo ||
                "https://definicion.de/wp-content/uploads/2019/07/perfil-de-usuario.png"
              }
            />
          </div>
          <div className="ms-2 flex flex-col">
            <span className="!text-lg text-blackish">
              {building?.creator?.fullName}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  const newBuildingContent = (
    <BuildingForm initialData={initialData} onSubmit={handleCreateBuilding} />
  );

  return (
    <>
      <PageStructure
        loading={loading}
        content={newBuilding || edit ? newBuildingContent : content}
        header={header}
      />
      <ScrapModal
        open={scrapModal}
        onClose={() => setScrapModal(false)}
        onScrap={handleScrapResult}
      />
      <ImobziSingleImportModal
        setBuilding={(item) => setInitialData(item)}
        open={imobziModal}
        onClose={() => setImobziModal(false)}
      />
    </>
  );
}
