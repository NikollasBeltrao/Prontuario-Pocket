import axios from 'axios';

const api = axios.create({
    baseURL: 'https://backend-analise.000webhostapp.com/docs/upload.php',
});

export default api;