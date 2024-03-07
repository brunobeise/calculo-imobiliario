export const uploadImage = async (base64Image: string) => {
    const imgurClientId = 'd6d20b636f9d265';
    const imgurApiUrl = 'https://api.imgur.com/3/image';

    // Remove o cabeçalho da Data URL da string base64
    const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, '');

    try {
        const response = await fetch(imgurApiUrl, {
            method: 'POST',

            headers: {
                'Authorization': `Client-ID ${imgurClientId}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                image: base64Data,
                type: 'base64'
            }),
        });

        const data = await response.json();

        if (data.success) {
            console.log('Link da imagem:', data.data.link); // O link direto para a imagem carregada
            return data.data.link;
        } else {
            console.error('Erro ao fazer upload da imagem:', data);
            return null;
        }
    } catch (error) {
        console.error('Falha na requisição:', error);
        return null;
    }
};

