interface UserPictureProps {
  src?: string;
  size: number;
}

export default function UserPicture(props: UserPictureProps) {
  return (
    <div
      className={`rounded-full overflow-hidden flex justify-center items-center w-[${props.size}px] h-[${props.size}px]`}
    >
      <img
        src={
          props.src ||
          "https://definicion.de/wp-content/uploads/2019/07/perfil-de-usuario.png"
        }
      />
    </div>
  );
}
