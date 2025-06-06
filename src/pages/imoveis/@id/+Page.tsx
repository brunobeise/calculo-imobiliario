import PageStructure from "@/components/structure/PageStructure";
import {
  createBuilding,
  fetchBuildingById,
  updateBuilding,
} from "@/store/buildingReducer";
import { AppDispatch } from "@/store/store";
import { useDispatch } from "react-redux";
import { useEffect, useState, useRef } from "react";
import { usePageContext } from "vike-react/usePageContext";
import { useAuth } from "@/auth";
import BuildingForm from "../BuildingForm";
import ScrapModal from "@/pages/scrap/ScrapModal";
import { Button } from "@mui/joy";
import { FaArrowLeft, FaLink, FaPlusCircle } from "react-icons/fa";
import { navigate } from "vike/client/router";
import { Building } from "@/types/buildingTypes";
import BuildingPreview from "@/reports/BuildingPreview";
import { buildingService } from "@/service/buildingService";
import IntegrationSingleImportModal from "@/components/modals/IntegrationSingleModal";

export default function BuildingPage() {
  const pageContext = usePageContext();
  const dispatch = useDispatch<AppDispatch>();
  const { id } = pageContext.routeParams;
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const [scrapModal, setScrapModal] = useState(false);
  const [integrationModal, setIntegrationModal] = useState(false);
  const [building, setBuilding] = useState<Partial<Building>>();
  const newBuilding = id === "novo";

  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (id && !newBuilding) {
      setLoading(true);
      buildingService
        .getBuildingById(id)
        .then((result) => setBuilding(result))
        .finally(() => setLoading(false));
    }
  }, [dispatch, id, newBuilding]);

  useEffect(() => {
    if (!newBuilding && building) {
      setBuilding(building);
    }
  }, [building, newBuilding]);

  const handleCreateOrUpdate = async (data: Partial<Building>) => {
    if (newBuilding) {
      const result = await dispatch(createBuilding(data)).unwrap();
      navigate("/imoveis/" + result.id);
    } else {
      await dispatch(updateBuilding({ buildingId: id, data }));
      await dispatch(fetchBuildingById(id));
      if (data.isArchived) navigate("/imoveis");
    }
  };

  const handleScrapResult = (data: Partial<Building>) => {
    setBuilding(data);
    setScrapModal(false);
  };

  const header = (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-3 mt-8 mb-3">
        <Button onClick={() => navigate("/imoveis")} variant="plain">
          <FaArrowLeft />
        </Button>
        <h2 className="text-2xl font-bold text-primary">
          {newBuilding ? "Novo Imóvel" : building?.propertyName}
        </h2>
      </div>
      {newBuilding && (
        <div className="flex gap-2">
          {user.imobzi && (
            <Button
              variant="outlined"
              onClick={() => setIntegrationModal(true)}
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
          {user.jetimob && (
            <Button
              variant="outlined"
              onClick={() => setIntegrationModal(true)}
              endDecorator={
                <img
                  className="w-5"
                  src="https://avatars.githubusercontent.com/u/60930335?s=280&v=4"
                />
              }
            >
              Importar do Jetimob
            </Button>
          )}
          <Button
            variant="outlined"
            onClick={() => setScrapModal(true)}
            endDecorator={<FaLink />}
          >
            Importar com link
          </Button>
        </div>
      )}
      {!newBuilding && (
        <Button onClick={() => navigate(`/cenarios?buildingId=${building.id}`)} endDecorator={<FaPlusCircle />}>Criar Proposta</Button>
      )}
    </div>
  );

  const content = (
    <div className="flex gap-5 h-full">
      <div className="w-1/2 overflow-auto pr-4">
        <BuildingForm
          initialData={building}
          onUpdate={(payload) => setBuilding(payload)}
          onSubmit={handleCreateOrUpdate}
        />
      </div>

      <div className="w-1/2 overflow-auto pl-4">
        {building && (
          <div ref={previewRef} className="sticky top-5">
            <BuildingPreview
              backgroundColor=""
              primaryColor=""
              secondaryColor=""
              headerType={1}
              proposal={{
                propertyName: building.propertyName,
                propertyNameFont: building.propertyNameFont,
                mainPhoto: building.mainPhoto,
                description: building.description,
                subtitle: building.subtitle,
                additionalPhotos: building.additionalPhotos,
                features: building.features,
                address: building.address,
                bedrooms: building.bedrooms,
                bathrooms: building.bathrooms,
                builtArea: building.builtArea,
                cod: building.cod,
                landArea: building.landArea,
                parkingSpaces: building.parkingSpaces,
                suites: building.suites,
                value: building.value,
                buildingId: building.id,
              }}
              preview
            />
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      <PageStructure loading={loading} header={header} content={content} />
      <ScrapModal
        open={scrapModal}
        onClose={() => setScrapModal(false)}
        onScrap={handleScrapResult}
      />
      <IntegrationSingleImportModal
        setBuilding={(item) => setBuilding(item)}
        open={integrationModal}
        onClose={() => setIntegrationModal(false)}
      />
    </>
  );
}
