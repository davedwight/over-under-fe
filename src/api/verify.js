const BASE_URL = import.meta.env.VITE_BASE_URL;

const sendSmsVerification = async (phoneNumber) => {
    try {
        const data = JSON.stringify({
            to: phoneNumber,
            channel: "sms",
        });

        const response = await fetch(`${BASE_URL}/start-verify`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: data,
        });

        const json = await response.json();
        return json;
    } catch (error) {
        const json = await response.json();
        return json;
    }
};

const checkVerification = async (phoneNumber, code) => {
    try {
        const data = JSON.stringify({
            to: phoneNumber,
            code: code,
        });

        console.log("data", data);

        const response = await fetch(`${BASE_URL}/check-verify`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: data,
        });

        const json = await response.json();
        console.log("check response", json);
        return json;
    } catch (error) {
        console.error(error);
        return false;
    }
};

export { sendSmsVerification, checkVerification };
