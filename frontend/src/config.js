
const API_BASE_URL =
    import.meta.env.MODE === "development"
        ? "http://localhost:8081"
        : "https://cirtutampa-b47a791bfcb6.herokuapp.com";

export default API_BASE_URL;
