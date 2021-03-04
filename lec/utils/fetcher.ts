import axios from "axios";
//url을 받아서 -> 거기에 get요청을 보내고 -> 결과값을 리턴한다
const fetcher = (url: string) =>
    axios
        .get(url, {
            withCredentials: true,
        })
        .then((response) => response.data);

export default fetcher;
