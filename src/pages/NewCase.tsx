import ContextSelectorButton from "@/components/shared/ContextSelectorButton";
import { Button, Card } from "@mui/joy";
import { useContext, useEffect, useState } from "react";
import { TbFilePlus } from "react-icons/tb";
import { TbFileDownload } from "react-icons/tb";
import { FaFile, FaFileInvoice, FaHistory, FaUsers } from "react-icons/fa";
import { FaArrowLeft, FaFilePen } from "react-icons/fa6";
import { propertyDataContext } from "@/propertyData/PropertyDataContext";
import { getInitialValues } from "@/propertyData/propertyDataInivitalValues";
import { Link, useLocation } from "react-router-dom";
import PropertyDataNewCaseForm from "@/propertyData/propertyDataInivitalValues/propertyDataNewCaseForm/PropertyDataNewCaseForm";
import { CaseStudy, caseService } from "@/service/caseService";
import dayjs from "dayjs";
import { Spinner } from "@/components/Loading";
import { toBRL } from "@/lib/formatter";
import { CaseStudyTypeLinkMap } from "@/components/shared/CaseCard";

interface NewCaseProps {
  setNewCase: (v: boolean) => void;
}

export default function NewCase(props: NewCaseProps) {
  const [context, setContext] = useState<
    "new" | "exists" | "newCase" | "myCases" | "realEstateCases"
  >();
  const [myCases, setMyCases] = useState<CaseStudy[]>();
  const [realEstateCases, setRealEstateCases] = useState<CaseStudy[]>();
  const location = useLocation();
  const { propertyData, setMultiplePropertyData } =
    useContext(propertyDataContext);

  const getMyCases = async () => {
    const cases = await caseService.getAllCases();
    setMyCases(cases);
  };

  const getRealEstateCases = async () => {
    const cases = await caseService.getAllRealEstateCases();
    setRealEstateCases(cases);
  };

  useEffect(() => {
    if (context === "myCases") getMyCases();
    if (context === "realEstateCases") getRealEstateCases();
  }, [context]);

  const hasLastCase = () => {
    const storedData = localStorage.getItem("financingPlanningPropertyData");
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        if (parsedData && typeof parsedData === "object") {
          return true;
        }
      } catch (error) {
        return false;
      }
    } else return false;
  };

  const handleBack = () => {
    if (context === "myCases") setContext("exists");
    else setContext(undefined);
  };

  return (
    <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] ">
      <h2 className="text-primary font-bold text-center text-2xl mb-5 ">
        {!context && " Iniciar estudo"}
        {context === "new" && "Como deseja começar o estudo?"}
        {context === "exists" && "Continuar estudo"}
        {context === "myCases" && "Meus Estudos"}
      </h2>

      {!context && (
        <Card className="w-[500px] shadow-lg ">
          <ContextSelectorButton
            onClick={() => setContext("new")}
            title="Novo"
            icon={<TbFilePlus />}
            desc="Começar um novo estudo"
          />
          <ContextSelectorButton
            icon={<TbFileDownload />}
            onClick={() => setContext("exists")}
            title="Existente"
            desc="Continuar um estudo ja iniciado"
          />
        </Card>
      )}

      {context === "new" && (
        <Card className="w-[500px] shadow-lg ">
          <ContextSelectorButton
            icon={<FaFilePen />}
            onClick={() => {
              setContext("newCase");
            }}
            title="Inserir dados manualmente"
            desc="Insira os dados manualmente para iniciar um novo cálculo personalizado, ajustando os parâmetros conforme suas necessidades."
          />
          <ContextSelectorButton
            icon={<FaFileInvoice />}
            onClick={() => {
              setMultiplePropertyData(getInitialValues(location.pathname));
              props.setNewCase(false);
            }}
            title="Começar com template"
            desc="Acesse diretamente a área de cálculo com dados de exemplo pré-preenchidos. Faça ajustes conforme necessário."
          />
        </Card>
      )}

      {context === "exists" && (
        <Card className="w-[500px] shadow-lg ">
          <ContextSelectorButton
            icon={<FaFilePen />}
            onClick={() => setContext("myCases")}
            title="Meus Estudos"
            desc="Acesse e continue seus estudos salvos"
          />
          <ContextSelectorButton
            icon={<FaUsers />}
            onClick={() => setContext("realEstateCases")}
            title="Estudos Compartilhados"
            desc="Veja estudos que foram salvos e compartilhados por seus colegas"
          />
          {hasLastCase() && (
            <ContextSelectorButton
              icon={<FaHistory />}
              onClick={() => {
                const storedData = localStorage.getItem(
                  "financingPlanningPropertyData"
                );
                if (storedData) {
                  try {
                    const parsedData = JSON.parse(storedData);
                    if (parsedData && typeof parsedData === "object") {
                      setMultiplePropertyData(parsedData);
                      props.setNewCase(false);
                    }
                  } catch (error) {
                    console.error("Erro ao fazer o parsing dos dados:", error);
                  }
                }
              }}
              title="Retomar Último Estudo"
              desc="Recupere o último estudo que você estava trabalhando"
            />
          )}
        </Card>
      )}

      {context === "newCase" && (
        <PropertyDataNewCaseForm
          finish={() => {
            if (propertyData) props.setNewCase(false);
            else {
              props.setNewCase(true);
              setContext(undefined);
            }
          }}
        />
      )}

      {context === "realEstateCases" && (
        <Card className="w-[500px] h-[400px] shadow-lg overflow-y-auto">
          {realEstateCases && realEstateCases.length > 0 ? (
            realEstateCases.map((c) => (
              <ContextSelectorButton
                icon={<FaFile />}
                onClick={() => {
                  setMultiplePropertyData(c.propertyData);
                  props.setNewCase(false);
                }}
                title={c.name}
                extra={
                  <div className="flex flex-col text-sm ms-8">
                    <p>
                      <strong className="font-bold">Valor do imóvel:</strong>{" "}
                      {toBRL(c.propertyData.propertyValue)}
                    </p>

                    <p>
                      <strong className="font-bold">Entrada:</strong>{" "}
                      {toBRL(c.propertyData.downPayment)}
                    </p>
                    <p>
                      <strong className="font-bold">Parcelas:</strong>{" "}
                      {toBRL(c.propertyData.installmentValue)}
                    </p>
                  </div>
                }
                desc={
                  <div className="flex items-center mt-4">
                    <div className="rounded-full overflow-hidden flex justify-center items-center w-[30px] h-[30px]">
                      <img
                        src={
                          c.user?.photo ||
                          "https://definicion.de/wp-content/uploads/2019/07/perfil-de-usuario.png"
                        }
                      />
                    </div>
                    <div className="ms-2 flex flex-col">
                      <span className="text-md text-blackish">
                        {c.user?.fullName}
                      </span>
                      <span className="text-md text-grayText">
                        {dayjs(c.createdAt).format("DD/MM/YYYY")}
                      </span>
                    </div>
                  </div>
                }
              />
            ))
          ) : realEstateCases && realEstateCases.length === 0 ? (
            <p className="text-center font-bold mt-5 px-12">
              Não há nenhum estudo compartilhado pelos seus colegas :(
            </p>
          ) : (
            <Spinner />
          )}
        </Card>
      )}

      {context === "myCases" && (
        <Card className="w-[500px] h-[400px] shadow-lg overflow-y-auto">
          {myCases && myCases.length > 0 ? (
            myCases.map((c) => (
              <Link
                to={
                  CaseStudyTypeLinkMap[
                    c.type as keyof typeof CaseStudyTypeLinkMap
                  ] +
                  "/" +
                  c.id
                }
              >
                <ContextSelectorButton
                  icon={<FaFile />}
                  onClick={() => {
                    props.setNewCase(false);
                  }}
                  title={c.name}
                  extra={
                    <div className="flex flex-col text-sm ms-5">
                      <p>
                        <strong className="font-bold">Valor do imóvel:</strong>{" "}
                        {toBRL(c.propertyData.propertyValue)}
                      </p>

                      <p>
                        <strong className="font-bold">Entrada:</strong>{" "}
                        {toBRL(c.propertyData.downPayment)}
                      </p>
                      <p>
                        <strong className="font-bold">Parcelas:</strong>{" "}
                        {toBRL(c.propertyData.installmentValue)}
                      </p>
                    </div>
                  }
                  desc={dayjs(c.createdAt).format("DD/MM/YYYY")}
                />
              </Link>
            ))
          ) : myCases && myCases.length === 0 ? (
            <p className="text-center font-bold mt-5">
              Você não tem nenhum estudo :(
            </p>
          ) : (
            <Spinner />
          )}
        </Card>
      )}

      {context && (
        <div className="absolute w-full flex justify-center mt-5">
          <Button
            startDecorator={<FaArrowLeft />}
            onClick={handleBack}
            variant="plain"
          >
            Voltar
          </Button>
        </div>
      )}
    </div>
  );
}
