/* eslint-disable @typescript-eslint/no-explicit-any */
import { useDrop, useDrag, XYCoord } from "react-dnd";
import { Input, Tab, TabList, TabPanel, Tabs, tabClasses } from "@mui/joy";
import { FaBuilding, FaExchangeAlt, FaFileAlt } from "react-icons/fa";
import { IoHomeOutline } from "react-icons/io5";
import dayjs from "dayjs";
import SearchInput from "@/components/inputs/SearchInput";
import { Spinner } from "@/components/Loading";
import { useRef, useCallback } from "react";
import {
  UseFormClearErrors,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import { Building } from "@/types/buildingTypes";
import { Proposal } from "@/types/proposalTypes";
import { Portfolio } from "@/types/portfolioTypes";
import BooleanInputSwitch from "@/components/inputs/SwitchInput";

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

function ItemCard({
  data,
  draggable = false,
  index = 0,
  moveItem,
  onRemove,
  onAdd,
}: {
  data: any;
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

  const getName = (d: any) =>
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

export default function PortfolioItems({
  fields,
  move,
  remove,
  append,
  errors,
  clearErrors,
  isOverLimit,
  setSearch,
  proposals,
  proposalsInitialLoading,
  searchLoading,
  buildings,
  type,
  setType,
  setValue,
  watch,
}: {
  fields: any[];
  move: (from: number, to: number) => void;
  remove: (index: number) => void;
  append: (data: any) => void;
  errors: any;
  clearErrors: UseFormClearErrors<any>;
  isOverLimit: boolean;
  setSearch: (search: string) => void;
  proposals: Proposal[];
  proposalsInitialLoading: boolean;
  searchLoading: boolean;
  buildings: Building[];
  type: "proposals" | "buildings";
  setType: (type: "proposals" | "buildings") => void;
  setValue: UseFormSetValue<Portfolio>;
  watch: UseFormWatch<Portfolio>;
}) {
  const [, portfolioDrop] = useDrop({
    accept: "EXTERNAL_ITEM",
    drop: (item: { data: any }) => addItem(item.data),
  });
  const [, proposalsRemoveDrop] = useDrop({
    accept: "INTERNAL_ITEM",
    drop: (item: { index: number }) => remove(item.index),
  });
  const [, buildingsRemoveDrop] = useDrop({
    accept: "INTERNAL_ITEM",
    drop: (item: { index: number }) => remove(item.index),
  });

  const itemNames: string[] = watch("itemNames") || [];

  const handleChangeName = (index: number, newName: string) => {
    const newItemNames = [...itemNames];
    newItemNames[index] = newName;
    setValue("itemNames", newItemNames, { shouldDirty: true });
  };

  const addItem = useCallback(
    (d: any) => {
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
    },
    [append, clearErrors]
  );

  return (
    <div>
      <div className="flex gap-10 px-10 justify-center  pt-6">
        <BooleanInputSwitch
          onChange={(v) => setValue("useCustomNames", v)}
          checked={watch("useCustomNames")}
          label="Usar nomes personalizados"
          infoTooltip="Se ativado, você poderá definir nomes personalizados para cada item do portfólio. Se desativado, usará os nomes originais dos itens."
        />
        <BooleanInputSwitch
          onChange={(v) => setValue("useThumbnailNames", v)}
          checked={watch("useThumbnailNames")}
          label="Exibir nomes na miniatura"
          infoTooltip="Se ativado, os nomes personalizados serão exibidos nas miniaturas dos itens, no menu de navegação do portfólio."
        />
        <BooleanInputSwitch
          onChange={(v) => setValue("useShowNamePage", v)}
          checked={watch("useShowNamePage")}
          label="Exibir o nome quando estiver na página"
          infoTooltip="Se ativado, o nome do item será exibido no topo da página, indicando qual item do portfólio está sendo visualizado."
        />
      </div>
      <div className="w-full grid grid-cols-2 gap-10 px-8">
        <div>
          <h2 className="text-lg font-bold mt-4">Itens do Portfólio</h2>
          <div
            ref={portfolioDrop}
            className={`flex flex-col gap-2 border rounded mt-3 p-2 max-h-[532px] overflow-auto
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
              <div key={item.id} className="relative">
                <ItemCard
                  data={item.building || item.case}
                  draggable
                  index={idx}
                  moveItem={move}
                  onRemove={() => remove(idx)}
                />
                {watch("useCustomNames") && (
                  <Input
                    type="text"
                    value={itemNames[idx] || ""}
                    onChange={(e) => handleChangeName(idx, e.target.value)}
                    placeholder="Nome personalizado"
                    className="w-full mt-1 p-1 mb-2 border rounded text-sm"
                  />
                )}
              </div>
            ))}
          </div>
          {errors.items && (
            <span className="text-red text-sm mt-1 text-center">
              {errors.items.message?.toString()}
            </span>
          )}
          {isOverLimit && (
            <div className="text-red text-xs text-center mt-2">
              Máximo de 10 itens permitidos. Remova algum para poder salvar.
            </div>
          )}{" "}
        </div>
        <div>
          <Tabs
            value={type}
            onChange={(_, v: "buildings" | "proposals") => setType(v)}
            className="mt-4"
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

            <TabPanel className="!p-0 !py-4" value="proposals">
              <SearchInput
                placeholder="Buscar Propostas"
                className="my-2 mb-3"
                debounceTimeout={500}
                handleDebounce={setSearch}
              />
              <div
                ref={proposalsRemoveDrop}
                className="flex flex-col gap-2 px-2 py-2 overflow-y-auto relative !border !border-dashed !border-border"
              >
                {proposalsInitialLoading || searchLoading ? (
                  <div className="absolute top-[50%] translate-x-[-50%] left-[50%]">
                    <Spinner />
                  </div>
                ) : (
                  proposals.map((p) => (
                    <ItemCard key={p.id} data={p} onAdd={() => addItem(p)} />
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
                className="flex flex-col gap-2 px-2 py-2 overflow-y-auto !border !border-dashed !border-border"
              >
                {buildings.map((b) => (
                  <ItemCard key={b.id} data={b} onAdd={() => addItem(b)} />
                ))}
              </div>
            </TabPanel>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
