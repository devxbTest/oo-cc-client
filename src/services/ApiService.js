import { API_BASE_URL } from "../app-config";

export function call(api, method, request) {
    let headers = new Headers({
        "Content-Type": "application/json"
    });
    var accessToken = localStorage.getItem("ACCESS_TOKEN");
    if (accessToken) {
        headers.append("Authorization", "Bearer " + accessToken);
    }

    let options = {
        headers: headers,
        url: API_BASE_URL + api,
        method: method,
    };

    if (request) {
        options.body = JSON.stringify(request);
    }

    return fetch(options.url, options)
        .then((response) => {
            return response.json().then((json) => {
                if (!response.ok) {
                    return Promise.reject(json);
                }
                return json;
            }).catch(() => {
                if (!response.ok) {
                    return Promise.reject({ status: response.status, message: response.statusText });
                }
                return { status: response.status, message: response.statusText };
            });
        })
        .catch((error) => {
            console.log(error)
            if (error.status === 403) {
                window.location.href = "/login";
            }
            return Promise.reject(error);
        });
}

export function signin(userDTO) {
    return call("/auth/signin", "POST", userDTO)
        .then((response) => {
            console.log(response);
            if (response.token) {
                localStorage.setItem("ACCESS_TOKEN", response.token);
                localStorage.setItem("USER_NAME", response.username); 
                window.location.href = "/";
            }
        })
}

export function signup(userDTO) {
    return call("/auth/signup", "POST", userDTO)
        .then((response) => {
            if (response.id) {
                window.location.href = "/";
            }
        })
        .catch((error) => {
            if (error.status === 403) {
                window.location.href = "/auth/signup";
            }
            return Promise.reject(error);
        });
}

export function signout() {
    localStorage.setImte("ACCESS_TOKEN", null);
    window.location.href = "/";
}