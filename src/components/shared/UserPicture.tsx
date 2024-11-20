interface UserPictureProps {
  src?: string;
  size: number;
  border?: string;
}

export default function UserPicture(props: UserPictureProps) {
  return (
    <div
      className="rounded-full overflow-hidden flex justify-center items-center"
      style={{
        width: `${props.size}px`,
        height: `${props.size}px`,
        border: props.border ? `1px solid ${props.border}` : undefined,
      }}
    >
      <img
        src={
          props.src ||
          "https://definicion.de/wp-content/uploads/2019/07/perfil-de-usuario.png"
        }
        alt="User"
      />
    </div>
  );
}

