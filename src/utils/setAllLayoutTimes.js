import moment from "moment";

function setAllLayoutTimes(
    layoutTimes,
    setLayoutTimes,
    response_expiration_time,
    vote_expiration_time
) {
    const expiration_mins = moment(vote_expiration_time).diff(
        moment(),
        "minutes"
    );
    const expiration_secs =
        moment(vote_expiration_time).diff(moment(), "seconds") % 60;
    const respond_mins = moment(response_expiration_time).diff(
        moment(),
        "minutes"
    );
    const respond_secs =
        moment(response_expiration_time).diff(moment(), "seconds") % 60;

    setLayoutTimes({
        ...layoutTimes,
        expiration_mins,
        expiration_secs,
        respond_mins,
        respond_secs,
    });
}

export default setAllLayoutTimes;
