/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useDrop, useDrag, XYCoord } from "react-dnd";
import { Proposal } from "@/types/proposalTypes";
import { Building } from "@/types/buildingTypes";
import { CreatePortfolio } from "@/types/portfolioTypes";
import { AppDispatch, RootState } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  FormControl,
  FormLabel,
  FormHelperText,
  Input,
  Tab,
  TabList,
  TabPanel,
  Tabs,
  tabClasses,
} from "@mui/joy";
import {
  FaBuilding,
  FaExchangeAlt,
  FaExternalLinkAlt,
  FaFileAlt,
  FaSave,
} from "react-icons/fa";
import { FaLink, FaTrash } from "react-icons/fa6";
import { IoDuplicate, IoHomeOutline } from "react-icons/io5";
import Dialog from "@/components/modals/Dialog";
import dayjs from "dayjs";
import { fetchCases } from "@/store/caseReducer";
import { fetchBuildings } from "@/store/buildingReducer";
import { Spinner } from "@/components/Loading";
import SearchInput from "@/components/inputs/SearchInput";
import { portfolioService } from "@/service/portfolioService";
import { notify } from "@/notify";
import BooleanInputSwitch from "@/components/inputs/SwitchInput";
import { DuplicatePortfolioModal } from "./DuplicatePortfolioModal";

interface Props {
  portfolioId?: string;
  open: boolean;
  onClose: () => void;
  reload: () => void;
}

export default function PortfolioModal({
  open,
  onClose,
  portfolioId,
  reload,
}: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState<"proposals" | "buildings">("proposals");
  const [search, setSearch] = useState("");
  const [duplicateOpen, setDuplicateOpen] = useState(false);

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
  } = useForm<CreatePortfolio>({
    defaultValues: {
      name: "",
      description: "",
      clientName: "",
      items: [],
      requestName: false,
    },
  });
  const { fields, append, move, remove } = useFieldArray({
    control,
    name: "items",
  });

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
    if (!open) return;
    const query = {
      search: search,
      sortDirection: "desc" as const,
      currentPage: 1,
      orderBy: "createdAt",
      limit: 100,
    };
    dispatch(fetchCases(query));
    dispatch(fetchBuildings(query));
  }, [dispatch, open, search]);

  useEffect(() => {
    if (!portfolioId || !open) {
      setTimeout(() => {
        reset({
          name: "",
          description: "",
          clientName: "",
          items: [],
        });
      }, 300);
      return;
    }
    setLoading(true);
    portfolioService.getPortfolioById(portfolioId).then((data) => {
      reset({
        name: data.name,
        clientName: data.clientName,
        description: data.description,
        requestName: data.requestName,
        items: data.items,
      });
      setLoading(false);
    });
  }, [portfolioId, open, reset]);

  const [, portfolioDrop] = useDrop({
    accept: "EXTERNAL_ITEM",
    drop: (item: { data: Proposal | Building }) => addItem(item.data),
  });
  const [, proposalsRemoveDrop] = useDrop({
    accept: "INTERNAL_ITEM",
    drop: (item: { index: number }) => remove(item.index),
  });
  const [, buildingsRemoveDrop] = useDrop({
    accept: "INTERNAL_ITEM",
    drop: (item: { index: number }) => remove(item.index),
  });

  const addItem = (d: Proposal | Building) => {
    const id = `${d.id}-${Date.now()}`;
    const now = new Date().toISOString();
    if ("name" in d) {
      append({
        id,
        portfolioId: "",
        caseId: d.id,
        addedAt: now,
        case: d,
      });
    } else {
      append({
        id,
        portfolioId: "",
        buildingId: d.id,
        addedAt: now,
        building: d,
      });
    }
    clearErrors("items");
  };

  const onSubmit = async (data: CreatePortfolio) => {
    if (!data.items || data.items.length === 0) {
      setError("items", {
        type: "manual",
        message: "Adicione ao menos 1 item ao portfólio.",
      });
      return;
    }

    clearErrors("items");

    setLoading(true);
    const payload = {
      ...data,
      items: data.items.map((i, idx) => ({ ...i, position: idx })),
    };

    if (portfolioId) {
      await portfolioService.updatePortfolio(portfolioId, payload);
    } else {
      await portfolioService.createPortfolio(payload);
      onClose();
    }

    setLoading(false);
    reload();
    setSearch("");
  };

  const handleDelete = async () => {
    setLoading(true);
    await portfolioService.deletePortfolio(portfolioId);
    setLoading(false);
    reload();
    onClose();
    setSearch("");
  };

  return (
    <>
      <DuplicatePortfolioModal
        open={duplicateOpen}
        onClose={() => setDuplicateOpen(false)}
        defaultValues={{
          name: watch("name") + " (Cópia)",
          clientName: watch("clientName"),
          requestName: watch("requestName"),
        }}
        onConfirm={async (d) => {
          setLoading(true);
          await portfolioService.createPortfolio(
            {
              name: d.name,
              clientName: d.clientName,
              requestName: d.requestName,
              items: fields.map((i, idx) => ({
                ...i,
                position: idx,
                id: `${i.id}-${Date.now()}`,
              })),
            },
            "Portfólio duplicado com sucesso."
          );
          setLoading(false);
          setDuplicateOpen(false);
          onClose()
          reload();
        }}
      />

      <Dialog
        open={open}
        onClose={() => {
          onClose();
          setSearch("");
        }}
        title={portfolioId ? "Editar Portfolio" : "Criar Portfolio"}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          {loading ? (
            <div className="md:w-[1100px] h-auto md:h-[390px] xl:h-[480px]">
              <Spinner />
            </div>
          ) : (
            <div className="flex flex-col md:flex-row gap-4 px-4 pb-4 w-full md:w-[1100px] h-auto md:h-[390px] xl:h-[480px]">
              <div className="w-full md:w-1/3 bg-gray-50 rounded p-4 mb-4 md:mb-0">
                <FormControl error={!!errors.name} className="mb-3">
                  <FormLabel>Nome</FormLabel>
                  <Input
                    {...register("name", { required: "Campo obrigatório" })}
                  />
                  {errors.name && (
                    <FormHelperText>{errors.name.message}</FormHelperText>
                  )}
                </FormControl>
                <FormControl error={!!errors.clientName} className="mb-3">
                  <FormLabel>Cliente</FormLabel>
                  <Input {...register("clientName")} />
                </FormControl>
                <div className="mt-5">
                  <BooleanInputSwitch
                    label="Solicitar Nome"
                    checked={watch("requestName")}
                    onChange={(v) => setValue("requestName", v)}
                    infoTooltip="Quando ativado, ao abrir o link será exibida uma caixa para o usuário digitar seu nome antes de visualizar a proposta. Essa informação será solicitada apenas uma vez. Recomendado para quando o link será enviado para mais de uma pessoa, permitindo identificar quem visualizou."
                  />
                </div>
              </div>

              <div className="w-full md:w-1/3 flex flex-col gap-3 mb-4 md:mb-0">
                <h2 className="text-lg font-bold">Itens do Portfólio</h2>
                <div
                  ref={portfolioDrop}
                  className={`flex flex-col gap-2 border rounded p-2 bg-gray-50 overflow-auto md:h-full
      ${
        isOverLimit
          ? "border-red"
          : errors.items
          ? "border-red"
          : "border-dashed border-border"
      }`}
                >
                  {fields.length === 0 && (
                    <span className="text-gray text-sm text-center">
                      Arraste aqui as propostas ou imóveis
                    </span>
                  )}
                  {fields.map((item, idx) => (
                    <ItemCard
                      key={item.id}
                      data={item.building || item.case}
                      draggable
                      index={idx}
                      moveItem={move}
                      onRemove={() => remove(idx)}
                    />
                  ))}
                </div>

                {errors.items && (
                  <span className="text-red text-sm mt-1 text-center">
                    {errors.items.message?.toString()}
                  </span>
                )}

                {isOverLimit && (
                  <div className="text-red text-xs text-center mt-2">
                    Máximo de 10 itens permitidos. Remova algum para poder
                    salvar.
                  </div>
                )}
              </div>

              <div className="w-full md:w-1/3 flex flex-col">
                <Tabs
                  value={type}
                  onChange={(_, v: "buildings" | "proposals") => setType(v)}
                >
                  <TabList
                    sx={{
                      justifyContent: "center",
                      bgcolor: "transparent",
                      [`& .${tabClasses.root}[aria-selected="true"]`]: {
                        bgcolor: "background.surface",
                      },
                    }}
                  >
                    <Tab value="proposals">
                      <FaFileAlt className="text-sm" /> Propostas
                    </Tab>
                    <Tab value="buildings">
                      <FaBuilding className="text-sm" /> Imóveis
                    </Tab>
                  </TabList>

                  <TabPanel className="!p-0 !py-4 " value="proposals">
                    <SearchInput
                      placeholder="Buscar Propostas"
                      className="my-2 mb-3"
                      debounceTimeout={500}
                      handleDebounce={setSearch}
                    />
                    <div
                      ref={proposalsRemoveDrop}
                      className="flex flex-col gap-2 px-2 py-2 overflow-y-auto relative !border !border-dashed !border-border h-[264px] xl:h-[354px]"
                    >
                      {proposalsInitialLoading || searchLoading ? (
                        <div className="absolute top-[50%] translate-x-[-50%] left-[50%]">
                          <Spinner />
                        </div>
                      ) : (
                        proposals.map((p) => (
                          <ItemCard
                            key={p.id}
                            data={p}
                            onAdd={() => addItem(p)}
                          />
                        ))
                      )}
                    </div>
                  </TabPanel>

                  <TabPanel className="!p-0 !py-4" value="buildings">
                    <SearchInput
                      placeholder="Buscar Imóveis"
                      className="my-2 mb-3"
                      debounceTimeout={500}
                      handleDebounce={setSearch}
                    />
                    <div
                      ref={buildingsRemoveDrop}
                      className="flex flex-col gap-2 px-2 py-2 overflow-y-auto !border !border-dashed !border-border h-[264px] xl:h-[354px]"
                    >
                      {buildings.map((b) => (
                        <ItemCard
                          key={b.id}
                          data={b}
                          onAdd={() => addItem(b)}
                        />
                      ))}
                    </div>
                  </TabPanel>
                </Tabs>
              </div>
            </div>
          )}

          {portfolioId ? (
            <FooterEdit
              portfolioId={portfolioId}
              loading={loading}
              handleDelete={handleDelete}
              isOverLimit={isOverLimit}
              setDuplicateOpen={() => setDuplicateOpen(true)}
            />
          ) : (
            <FooterCreate loading={loading} isOverLimit={isOverLimit} />
          )}
        </form>
      </Dialog>
    </>
  );
}

/* =============== FOOTERS =============== */
function FooterEdit({
  portfolioId,
  loading,
  handleDelete,
  isOverLimit,
  setDuplicateOpen,
}: {
  portfolioId: string;
  loading: boolean;
  handleDelete: () => void;
  isOverLimit: boolean;
  setDuplicateOpen: () => void;
}) {
  return (
    <div
      className={`flex justify-between mt-6 pb-4 gap-2 px-7 flex-wrap ${
        loading ? "invisible" : ""
      }`}
    >
      <Button
        endDecorator={<FaTrash />}
        loading={loading}
        onClick={handleDelete}
        type="button"
        color="danger"
        size="md"
      >
        Excluir
      </Button>
      <div className="flex gap-4 flex-wrap">
        <Button
          endDecorator={<IoDuplicate />}
          loading={loading}
          type="button"
          variant="outlined"
          size="md"
          onClick={setDuplicateOpen}
        >
          Duplicar
        </Button>
        <Button
          endDecorator={<FaLink />}
          loading={loading}
          type="button"
          variant="outlined"
          size="md"
          onClick={() => {
            navigator.clipboard.writeText(
              `https://app.imobdeal.com.br/portfolio/${portfolioId}`
            );
            notify("info", "Link copiado para o clipboard");
          }}
        >
          Copiar Link
        </Button>
        <Button
          endDecorator={<FaExternalLinkAlt />}
          onClick={() => window.open(`/portfolio/${portfolioId}`, "_blank")}
          loading={loading}
          type="button"
          variant="outlined"
          size="md"
        >
          Ver Online
        </Button>
        <Button
          endDecorator={<FaSave />}
          loading={loading}
          type="submit"
          color="primary"
          size="md"
          disabled={isOverLimit}
        >
          Salvar Alterações
        </Button>
      </div>
    </div>
  );
}

function FooterCreate({
  loading,
  isOverLimit,
}: {
  loading: boolean;
  isOverLimit: boolean;
}) {
  return (
    <div className="flex justify-center mt-6 pb-4 gap-2">
      <Button
        disabled={isOverLimit}
        loading={loading}
        type="submit"
        color="primary"
        size="md"
      >
        Criar Portfólio
      </Button>
    </div>
  );
}

/* =============== DND HOOK =============== */
function useDragDropItem(
  index: number,
  moveItem: (from: number, to: number) => void
) {
  const ref = useRef<HTMLDivElement>(null);
  const [, drop] = useDrop({
    accept: "INTERNAL_ITEM",
    hover(item: { index: number }, monitor) {
      if (!ref.current) return;
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) return;
      const rect = ref.current.getBoundingClientRect();
      const middleY = (rect.bottom - rect.top) / 2;
      const client = monitor.getClientOffset();
      if (!client) return;
      const hoverY = (client as XYCoord).y - rect.top;
      if (dragIndex < hoverIndex && hoverY < middleY) return;
      if (dragIndex > hoverIndex && hoverY > middleY) return;
      moveItem(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });
  const [, drag] = useDrag({
    type: "INTERNAL_ITEM",
    item: { index },
  });
  return (node: HTMLDivElement | null) => {
    if (node) drag(drop((ref.current = node)));
  };
}

/* =============== CARD COMPONENT =============== */
function ItemCard({
  data,
  draggable = false,
  index = 0,
  moveItem,
  onRemove,
  onAdd,
}: {
  data: Proposal | Building;
  draggable?: boolean;
  index?: number;
  moveItem?: (from: number, to: number) => void;
  onRemove?: () => void;
  onAdd?: () => void;
}) {
  const internalRef = useDragDropItem(index, moveItem ?? (() => {}));
  const [, dragRef] = useDrag({
    type: "EXTERNAL_ITEM",
    item: () => {
      if (!data) return { data: null, source: "unknown" };
      return {
        data,
        source: "name" in data ? "proposal" : "building",
      };
    },
  });

  if (!data) return null;

  const ref = draggable ? internalRef : dragRef;
  const isSelectable = !draggable && !!onAdd;

  const getName = (d: Proposal | Building) =>
    "name" in d ? d.name : d.propertyName ?? "[sem nome]";

  return (
    <div
      ref={ref}
      onClick={isSelectable ? onAdd : onRemove}
      className={`bg-whitefull border border-grayScale-100 py-2 px-2 text-sm flex gap-2 relative w-full items-center rounded cursor-pointer hover:bg-grayScale-50`}
    >
      {isSelectable && (
        <FaExchangeAlt className="text-grayScale-400 mr-1 ml-1 min-w-[14px]" />
      )}

      {"mainPhoto" in data && data.mainPhoto ? (
        <img
          src={data.mainPhoto}
          alt={getName(data)}
          className="w-16 h-16 rounded object-cover"
        />
      ) : (
        <div className="w-16 h-16 rounded bg-grayScale-100 flex items-center justify-center">
          <IoHomeOutline className="text-grayScale-600" />
        </div>
      )}

      <div className="flex-1">
        <div className="font-bold">{getName(data)}</div>
        {"name" in data && (
          <div className="text-xs text-grayScale-500">{data.propertyName}</div>
        )}
        {"createdAt" in data && (
          <div className="text-xs text-grayScale-400 mt-2 flex gap-3">
            {dayjs(data.createdAt).format("DD/MM/YYYY")}
            <div className="flex gap-1 items-center">
              {"name" in data ? (
                <>
                  <FaFileAlt className="text-xs" /> Proposta
                </>
              ) : (
                <>
                  <FaBuilding className="text-xs" /> Imóvel
                </>
              )}
            </div>
          </div>
        )}
      </div>
      {!isSelectable && (
        <FaExchangeAlt className="text-grayScale-400 mr-1 ml-1 min-w-[14px]" />
      )}
    </div>
  );
}
