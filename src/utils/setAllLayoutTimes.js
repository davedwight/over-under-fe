import moment from "moment";

function setAllLayoutTimes(
    layoutTimes,
    setLayoutTimes,
    response,
    responseTimes
) {
    const now = moment();
    console.log("now", now);

    const response_exp_time = moment(response.created_at).add(
        responseTimes[response.response_length],
        "minutes"
    );

    console.log("response_exp_time", response_exp_time);

    const expiration_mins = moment(response.expiration_time).diff(
        now,
        "minutes"
    );
    // console.log("expiration_mins", expiration_mins);

    const expiration_secs =
        moment(response.expiration_time).diff(now, "seconds") % 60;

    const respond_mins = moment(response_exp_time).diff(now, "minutes");

    const respond_secs = moment(response_exp_time).diff(now, "seconds") % 60;

    // console.log("expiration mins", expiration_mins);
    // console.log("expiration_secs", expiration_secs);
    // console.log("respond mins", respond_mins);
    // console.log("respond_secs", respond_secs);

    setLayoutTimes({
        ...layoutTimes,
        expiration_mins,
        expiration_secs,
        respond_mins,
        respond_secs,
    });
}

export default setAllLayoutTimes;
