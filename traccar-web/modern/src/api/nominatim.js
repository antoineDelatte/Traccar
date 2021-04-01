import axios from 'axios';

const instance = axios.create({
    baseURL : 'http://nominatim.openstreetmap.org'
});

export default instance;