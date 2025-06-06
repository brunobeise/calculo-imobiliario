import { ReactNode } from "react";
import { FaHome } from "react-icons/fa";
import { FaGear } from "react-icons/fa6";
import { FaImage } from "react-icons/fa6";
import { MdNoteAlt } from "react-icons/md";

const menuItems = [
  { id: "property", label: "Imóvel", icon: <FaHome className="text-xl" /> },
  { id: "images", label: "Imagens", icon: <FaImage className="text-xl" /> },
  {
    id: "config",
    label: "Config.",
    icon: <FaGear className="text-xl" />,
  },
  {
    id: "notes",
    label: "Notas",
    icon: <MdNoteAlt className="text-2xl" />,
  },
];

interface ReportMenuProps {
  activeItem: string;
  onSelectItem: (v: string) => void;
  children: ReactNode;
}

const ReportMenu = ({
  activeItem,
  onSelectItem,
  children,
}: ReportMenuProps) => {
  return (
    <div className="flex flex-col md:flex-row gap-2 md:pb-0 ">
      <div className="flex md:flex-col px-4 gap-6 text-primary bg-transparent sticky top-0 left-0  z-10 md:ms-4">
        {menuItems.map((item) => (
          <div
            key={item.id}
            className={`flex flex-col items-center gap-2 cursor-pointer ${
              activeItem === item.id ? "text-primary-color" : "text-gray-400"
            }`}
            onClick={() => onSelectItem(item.id)}
          >
            <button
              className={`w-12 h-12 flex items-center justify-center bg-transparent rounded-lg transition-all duration-200 ${
                activeItem === item.id
                  ? "bg-white shadow-md"
                  : "hover:bg-grayScale-200"
              }`}
            >
              {item.icon}
            </button>
            <span className="text-xs font-bold">{item.label}</span>
          </div>
        ))}
      </div>
      <div className="flex-1  bg-whitefull z-10 shadow overflow-y-auto max-h-[88vh]">
        {children}
      </div>
    </div>
  );
};

export default ReportMenu;
