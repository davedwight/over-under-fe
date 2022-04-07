import moment from "moment";

function setAllLayoutTimes(
    layoutTimes,
    setLayoutTimes,
    response,
    responseTimes
) {
    const now = moment();

    const response_exp_time = moment(response.created_at).add(
        responseTimes[response.response_length],
        "minutes"
    );

    const expiration_mins = moment(response.expiration_time).diff(
        now,
        "minutes"
    );

    const expiration_secs =
        moment(response.expiration_time).diff(now, "seconds") % 60;

    const respond_mins = moment(response_exp_time).diff(now, "minutes");

    const respond_secs = moment(response_exp_time).diff(now, "seconds") % 60;

    setLayoutTimes({
        ...layoutTimes,
        expiration_mins,
        expiration_secs,
        respond_mins,
        respond_secs,
    });
}

export default setAllLayoutTimes;
