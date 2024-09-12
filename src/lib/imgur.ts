// Função para converter Blob em base64
const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

const fetchBlobFromUrl = async (blobUrl: string): Promise<Blob> => {
  const response = await fetch(blobUrl);
  const blob = await response.blob();
  return blob;
};

export const uploadImage = async (image: string) => {
  let imageBase64: string;

  if (image.startsWith("blob:")) {
    try {
      const blob = await fetchBlobFromUrl(image);
      imageBase64 = await blobToBase64(blob);
    } catch (error) {
      console.error("Erro ao buscar/converter Blob para base64", error);
      return;
    }
  } else {
    imageBase64 = image;
  }

  const formData = new FormData();
  formData.append("file", imageBase64);
  formData.append("upload_preset", "dtqj09md");

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/dpegpgjpr/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );
    const data = await response.json();
    if (data.secure_url) {
      console.log(data.secure_url);
      return data.secure_url;
    }
  } catch (error) {
    console.error("Falha no upload", error);
  }
};
