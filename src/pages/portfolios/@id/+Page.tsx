/* eslint-disable @typescript-eslint/no-explicit-any */
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { notify } from "@/notify";
import { portfolioService } from "@/service/portfolioService";
import { Portfolio } from "@/types/portfolioTypes";
import { RootState, AppDispatch } from "@/store/store";
import PageStructure from "@/components/structure/PageStructure";
import { GrMultiple } from "react-icons/gr";
import { FaLink, FaExternalLinkAlt } from "react-icons/fa";
import { Button } from "@mui/joy";
import { usePageContext } from "vike-react/usePageContext";
import PortfolioItems from "./PortfolioItems";
import { fetchCases } from "@/store/caseReducer";
import { fetchBuildings } from "@/store/buildingReducer";
import PortfolioConfig from "./PortfolioConfig";
import { MenuSelector } from "@/components/shared/MenuSelector";
import { FloatingSaveButton } from "@/components/shared/FloatingSaveButton";
import { useWatch } from "react-hook-form";
import { uploadImage } from "@/lib/imgur";
import { LuBox } from "react-icons/lu";
import { FaArrowLeft, FaEye, FaTrash } from "react-icons/fa6";
import { navigate } from "vike/client/router";
import { DuplicatePortfolioModal } from "../DuplicatePortfolioModal";
import { IoDuplicate } from "react-icons/io5";
import ConfirmationModal from "@/components/modals/ConfirmationModal";
import { SessionPortfolioDashboard } from "@/components/session/SessionPortfolioDashboard";
import { PortfolioSession } from "@/types/sessionTypes";

export default function PortfolioPage() {
  const dispatch = useDispatch<AppDispatch>();
  const pageContext = usePageContext();
  const { id } = pageContext.routeParams;
  const [loading, setLoading] = useState(false);
  const [duplicateModal, setDuplicateModal] = useState(false);
  const [duplicateLoading, setDuplicateLoading] = useState(false);
  const [type, setType] = useState<"proposals" | "buildings">("proposals");
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<
    "portfolio" | "items" | "sessions"
  >("portfolio");
  const [isDirty, setIsDirty] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [sessions, setSessions] = useState<PortfolioSession[]>([]);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const {
    control,
    handleSubmit,
    register,
    reset,
    formState: { errors },
    setValue,
    watch,
    setError,
    clearErrors,
  } = useForm<Portfolio>({
    defaultValues: {
      items: [],
    },
  });

  const watchedValues = useWatch({ control });

  const { fields, append, move, remove } = useFieldArray({
    control,
    name: "items",
  });

  const originalPortfolio = useRef<Portfolio | null>(null);
  const isOverLimit = fields.length > 10;

  const proposals = useSelector((s: RootState) => s.proposals.myCases);
  const proposalsInitialLoading = useSelector(
    (s: RootState) => s.proposals.myCasesLoading
  );
  const buildings = useSelector((s: RootState) => s.building.buildings);
  const searchLoading = useSelector(
    (s: RootState) => s.building.loading || s.proposals.myCasesLoading
  );

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    portfolioService.getPortfolioById(id).then((data) => {
      reset(data);
      setSessions(data.sessions);
      originalPortfolio.current = data;
      setLoading(false);
    });
  }, [id, reset]);

  useEffect(() => {
    if (!id) return;
    const query = {
      search,
      sortDirection: "desc" as const,
      currentPage: 1,
      orderBy: "createdAt",
      limit: 5,
    };
    dispatch(fetchCases(query));
    dispatch(fetchBuildings(query));
  }, [dispatch, id, search]);

  useEffect(() => {
    if (!originalPortfolio.current) {
      originalPortfolio.current = watchedValues as Portfolio;
      setIsDirty(false);
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const normalize = (val: any) => {
      if (val === undefined || val === null) return "";
      if (typeof val === "string") return val.trim();
      return val;
    };

    const differences: string[] = [];

    for (const key in watchedValues) {
      const originalValue = normalize((originalPortfolio.current as any)[key]);
      const currentValue = normalize(watchedValues[key]);

      const areEqual =
        typeof originalValue === "object" && originalValue !== null
          ? JSON.stringify(originalValue) === JSON.stringify(currentValue)
          : originalValue === currentValue;

      if (!areEqual) {
        differences.push(key);
      }
    }

    setIsDirty(differences.length > 0);
  }, [watchedValues]);

  const onSubmit = async (data: Portfolio) => {
    if (!data.items || data.items.length === 0) {
      setError("items", {
        type: "manual",
        message: "Adicione ao menos 1 item ao portfólio.",
      });
      setActiveTab("items");
      return;
    }
    clearErrors("items");

    if (!data.link || data.link.trim() === "") {
      setError("link", {
        type: "manual",
      });
      return;
    }

    setSaveLoading(true);

    let uploadMainPhoto = data.mainPhoto;
    if (data.mainPhoto && !data.mainPhoto.startsWith("https://")) {
      uploadMainPhoto = await uploadImage(data.mainPhoto);
    }

    setValue("mainPhoto", uploadMainPhoto);

    const payload = {
      ...data,
      mainPhoto: uploadMainPhoto,
      items: data.items.map((i, idx) => ({ ...i, position: idx })),
    };

    await portfolioService.updatePortfolio(id, payload);
    originalPortfolio.current = payload;
    setIsDirty(false);
    setSaveLoading(false);
  };

  const handleDelete = () => {
    setDeleteLoading(true);
    portfolioService.deletePortfolio(id).then(() => {
      navigate("/portfolios");
      setDeleteLoading(false);
    });
  };

  const variants = {
    initial: { opacity: 0, x: -10 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, x: 10, transition: { duration: 0.3 } },
  };

  const header = (
    <div className="flex justify-between items-center relative">
      <div className="w-full flex items-center text-primary gap-2 text-2xl ms-4 mt-8 mb-3">
        <Button onClick={() => navigate("/portfolios")} variant="plain">
          <FaArrowLeft />
        </Button>
        <h2 className="font-bold text-nowrap">{watch("name")}</h2>
      </div>
      <div className="absolute left-[50%] translate-x-[-50%] mt-4">
        <MenuSelector
          items={[
            { id: "portfolio", label: "Portfolio", icon: <GrMultiple /> },
            { id: "items", label: "Itens", icon: <LuBox /> },
            { id: "sessions", label: "Visualizações", icon: <FaEye /> },
          ]}
          onChange={(id) =>
            setActiveTab(id as "portfolio" | "items" | "sessions")
          }
        />
      </div>
      <div className="flex items-center mt-6 gap-2">
        <Button
          endDecorator={<IoDuplicate />}
          onClick={() => setDuplicateModal(true)}
          type="button"
          variant="outlined"
        >
          Duplicar
        </Button>
        <Button
          endDecorator={<FaLink />}
          type="button"
          variant="outlined"
          size="md"
          className="!text-nowrap"
          onClick={() => {
            navigator.clipboard.writeText(
              `https://app.imobdeal.com.br/portfolio/${watch("link") || id}`
            );
            notify("info", "Link copiado para o clipboard");
          }}
        >
          Copiar Link
        </Button>
        <Button
          endDecorator={<FaExternalLinkAlt />}
          onClick={() =>
            window.open(`/portfolio/${watch("link") || id}`, "_blank")
          }
          type="button"
          size="md"
          className="!text-nowrap"
        >
          Ver Online
        </Button>
      </div>
    </div>
  );

  return (
    <PageStructure
      header={header}
      loading={loading}
      content={
        <div className="overflow-hidden relative">
          {!loading && (
            <AnimatePresence mode="wait" initial={true}>
              <motion.div
                key={activeTab}
                initial="initial"
                animate="animate"
                exit="exit"
                variants={variants}
                className="w-full"
              >
                {activeTab === "portfolio" && (
                  <PortfolioConfig
                    control={control}
                    register={register}
                    setValue={setValue}
                    setError={setError}
                    watch={watch}
                    handleSubmit={handleSubmit}
                    clearErrors={clearErrors}
                    errors={errors}
                    onSubmit={onSubmit}
                    loading={loading}
                    isOverLimit={isOverLimit}
                    portfolioId={id}
                  />
                )}

                {activeTab === "items" && (
                  <PortfolioItems
                    watch={watch}
                    setValue={setValue}
                    fields={fields}
                    move={move}
                    remove={remove}
                    append={append}
                    errors={errors}
                    clearErrors={clearErrors}
                    isOverLimit={isOverLimit}
                    setSearch={setSearch}
                    proposals={proposals}
                    proposalsInitialLoading={proposalsInitialLoading}
                    searchLoading={searchLoading}
                    buildings={buildings}
                    type={type}
                    setType={setType}
                  />
                )}

                {activeTab === "sessions" && (
                  <SessionPortfolioDashboard portfolioSessions={sessions} />
                )}
              </motion.div>
            </AnimatePresence>
          )}
          <FloatingSaveButton
            isVisible={isDirty}
            onClick={handleSubmit(onSubmit)}
            loading={saveLoading}
            disabled={!!errors?.link?.type}
            className="pe-[350px]"
          />
          <DuplicatePortfolioModal
            open={duplicateModal}
            onClose={() => setDuplicateModal(false)}
            defaultValues={{
              name: watch("name") + " (Cópia)",
              clientName: watch("clientName"),
              requestName: watch("requestName"),
            }}
            loading={duplicateLoading}
            onConfirm={async (d) => {
              setDuplicateLoading(true);
              const data = { ...watch(), ...d, link: "" };
              delete data.id;
              delete data.createdAt;
              delete data.sessions;
              const result = await portfolioService.createPortfolio(
                data,
                "Portfólio duplicado com sucesso."
              );
              setDuplicateModal(false);
              setDuplicateLoading(false);
              navigate("/portfolios/" + result.id);
            }}
          />
          <ConfirmationModal
            content="Deseja realmente excluir o portfolio permanentemente?"
            okLoading={deleteLoading}
            open={deleteModal}
            onClose={() => setDeleteModal(false)}
            onOk={handleDelete}
          />
        </div>
      }
      footer={
        activeTab === "portfolio" && (
          <AnimatePresence mode="wait" initial={true}>
            <motion.div
              key={activeTab}
              initial="initial"
              animate="animate"
              exit="exit"
              variants={variants}
              className="w-full"
            >
              <div className="float-bottom bottom-10 w-full">
                <Button
                  endDecorator={<FaTrash />}
                  onClick={() => setDeleteModal(true)}
                  type="button"
                  color="danger"
                  size="md"
                >
                  Excluir
                </Button>
              </div>
            </motion.div>
          </AnimatePresence>
        )
      }
    />
  );
}
