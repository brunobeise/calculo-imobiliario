import { User } from "@/types/userTypes";
import UserSignature1 from "./UserSignature1";
import UserSignature2 from "./UserSignature2";
import UserSignature3 from "./UserSignature3";

interface UserSignatureProps {
  userData?: User;
  title?: string;
  desc?: string;
  primaryColor?: string;
  secondaryColor?: string;
  backgroundColor?: string;
  type: number;
}

export default function UserSignature(props: UserSignatureProps) {
  if (props.type === 1)
    return (
      <UserSignature1
        userData={props.userData}
        title={props.title}
        desc={props.desc}
        primaryColor={props.primaryColor}
        secondaryColor={props.secondaryColor}
        backgroundColor={props.backgroundColor}
      />
    );
  if (props.type === 2)
    return (
      <UserSignature2
        userData={props.userData}
        title={props.title}
        desc={props.desc}
        primaryColor={props.primaryColor}
        secondaryColor={props.secondaryColor}
        backgroundColor={props.backgroundColor}
      />
    );
  if (props.type === 3)
    return (
      <UserSignature3
        userData={props.userData}
        title={props.title}
        desc={props.desc}
        primaryColor={props.primaryColor}
        secondaryColor={props.secondaryColor}
        backgroundColor={props.backgroundColor}
      />
    );
}
