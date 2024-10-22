interface CaseCardProps {
  title: string;
  image: string;
  desc: string;
  comingSoon?: boolean;
  link: string;
}

export default function CaseTypeCard({
  title,
  image,
  desc,
  comingSoon = false,
  link,
}: CaseCardProps) {
  const cardContent = (
    <div
      className={`relative overflow-hidden min-w-[260px] max-w-[260px] text-center h-[420px] bg-white rounded-[10px] duration-300 pt-5 ${
        comingSoon
          ? "border-[#bebebe] border-2"
          : " hover:scale-[102%] cursor-pointer shadow-[inset_0_-3em_3em_rgba(0,0,0,0.05),0_0_0_2px_rgb(190,190,190),0.3em_0.3em_1em_rgba(0,0,0,0.3)] transition-duration-300 hover:shadow-[inset_0_-3em_3em_rgba(0,0,0,0.12),0_0_0_2px_rgb(190,190,190),0.3em_0.3em_1em_rgba(0,0,0,0.3)]"
      }`}
    >
      <span
        className={`text-2xl text-primary font-bold ${
          comingSoon ? "opacity-70" : ""
        }`}
      >
        {title}
      </span>
      <p
        className={`px-4 mt-4 text-primary text-left ms-2 text-[0.9rem] ${
          comingSoon ? "opacity-70" : ""
        }`}
      >
        {desc}
      </p>
      <img src={image} className="absolute w-full bottom-[-5px]" alt="Case" />
      {comingSoon && (
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-10">
          <div className="w-full !bg-[#0b263e] mt-20 text-white py-1">
            Em Breve
          </div>
        </div>
      )}
    </div>
  );

  return comingSoon ? cardContent : <a href={link}>{cardContent}</a>;
}
