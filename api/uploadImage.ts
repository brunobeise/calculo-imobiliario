
export const config = {
    runtime: 'edge',
};

async function handler(request: Request) {

    // Edge Functions devem ser cuidadosas com o tamanho e a complexidade do payload
    const formData = await request.formData();
    const image = formData.get('image') as string;
    const imgurClientId = 'd6d20b636f9d265';
    const imgurApiUrl = 'https://api.imgur.com/3/image';

    // Remove o cabeçalho da Data URL da string base64
    const base64Data = image.replace(/^data:image\/\w+;base64,/, '');

    try {
        const imgurResponse = await fetch(imgurApiUrl, {
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

        const data = await imgurResponse.json();

        if (data.success) {
            return new Response(JSON.stringify({ link: data.data.link }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            });
        } else {
            return new Response('Erro ao fazer upload da imagem', { status: 400 });
        }
    } catch (error) {
        return new Response('Falha na requisição', { status: 400 });
    }
}

const allowCors = fn => async (req, res) => {
    res.setHeader('Access-Control-Allow-Credentials', true)
    res.setHeader('Access-Control-Allow-Origin', '*')
    // another common pattern
    // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    )
    if (req.method === 'OPTIONS') {
        res.status(200).end()
        return
    }
    return await fn(req, res)
}

export default allowCors(handler)



