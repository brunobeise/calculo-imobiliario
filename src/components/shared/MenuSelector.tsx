import { useState, useRef, useEffect, ReactNode } from "react";
import { motion } from "framer-motion";

interface MenuItem {
  id: string;
  label: string;
  icon?: ReactNode;
}

interface MenuSelectorProps {
  items: MenuItem[];
  onChange?: (id: string) => void;
  initialItemId?: string;
  queryParamKey?: string; // chave do query param opcional
}

export function MenuSelector({
  items,
  onChange,
  initialItemId,
  queryParamKey,
}: MenuSelectorProps) {
  const [selected, setSelected] = useState(initialItemId ?? items[0].id);
  const containerRef = useRef<HTMLDivElement>(null);
  const [underlineStyle, setUnderlineStyle] = useState({ left: 0, width: 0 });

  useEffect(() => {
    // Atualiza underline
    if (!containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const selectedEl = containerRef.current.querySelector<HTMLElement>(
      `[data-item-id="${selected}"]`
    );
    if (!selectedEl) return;
    const rect = selectedEl.getBoundingClientRect();
    setUnderlineStyle({
      left: rect.left - containerRect.left,
      width: rect.width,
    });
  }, [selected, items]);

  useEffect(() => {
    if (!queryParamKey) return;

    const url = new URL(window.location.href);
    const param = url.searchParams.get(queryParamKey);
    if (param && items.some((item) => item.id === param)) {
      setSelected(param);
    }
  }, [queryParamKey, items]);

  const handleClick = (id: string) => {
    setSelected(id);
    onChange?.(id);

    if (queryParamKey) {
      const url = new URL(window.location.href);
      url.searchParams.set(queryParamKey, id);
      window.history.replaceState(null, "", url.toString());
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative flex border-b border-border select-none w-min"
    >
      {items.map(({ id, label, icon }) => (
        <button
          key={id}
          data-item-id={id}
          onClick={() => handleClick(id)}
          className={`flex items-center gap-2 px-6 py-3 cursor-pointer focus:outline-none font-medium ${
            selected === id
              ? "text-primary"
              : "text-grayScale-800"
          }`}
          type="button"
        >
          {icon && <span className="flex items-center">{icon}</span>}
          {label}
        </button>
      ))}
      <motion.div
        layout
        transition={{ type: "spring", stiffness: 200, damping: 30 }}
        className="absolute bottom-0 h-0.5 bg-black rounded"
        style={{ left: underlineStyle.left, width: underlineStyle.width }}
      />
    </div>
  );
}
