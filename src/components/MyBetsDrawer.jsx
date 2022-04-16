import React, { useState, useEffect } from "react";
import { styled, useTheme } from "@mui/material/styles";
import Drawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import CssBaseline from "@mui/material/CssBaseline";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import logo from "../assets/overunderlogolarge.png";
import Layout from "./Layout.jsx";
import refreshIcon from "../assets/refreshIcon.svg";
import Spinner from "../assets/spinner.svg";
import { axiosWithAuth } from "../utils/axiosWithAuth";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { formatPhoneNumber } from "react-phone-number-input";

const drawerWidth = "100%";

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
    ({ theme, open }) => ({
        flexGrow: 1,
        padding: theme.spacing(3),
        transition: theme.transitions.create("margin", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginRight: -drawerWidth,
        ...(open && {
            transition: theme.transitions.create("margin", {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
            marginRight: 0,
        }),
    })
);

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
    transition: theme.transitions.create(["margin", "width"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(["margin", "width"], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        // marginRight: drawerWidth,
    }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: "flex-start",
}));

export default function MyBetsDrawer(props) {
    const { userIdState, setUserIdState } = props;
    const theme = useTheme();
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [tableData, setTableData] = useState([]);
    let navigate = useNavigate();

    let userId = parseInt(localStorage.getItem("user_id"));

    useEffect(() => {
        if (userId) {
            setLoading(true);
            getResponseData();
        }
    }, [userIdState]);

    const handleDrawerOpen = () => {
        getResponseData();
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const handleRefresh = () => {
        setLoading(true);
        getResponseData();
    };

    const handleLogoClick = () => {
        navigate(`/vote`);
        window.location.reload();
    };

    const getResponseData = () => {
        axiosWithAuth()
            .get(`/responses/user/${userId}`)
            .then((res) => {
                setTableData(res.data);
                setLoading(false);
            })
            .catch((error) => {
                setLoading(false);
                console.error("error fetching response data", error);
            });
    };

    return (
        <div className="box-container">
            <CssBaseline />
            <AppBar className="app-bar" position="fixed" open={open}>
                <Toolbar>
                    <header>
                        <img
                            onClick={handleLogoClick}
                            className="logo"
                            src={logo}
                            alt="logo"
                        />
                        {userIdState ? (
                            <IconButton
                                className="icon-button"
                                color="inherit"
                                aria-label="open drawer"
                                edge="end"
                                onClick={handleDrawerOpen}
                                sx={{ ...(open && { display: "none" }) }}
                            >
                                <MenuIcon />
                            </IconButton>
                        ) : (
                            <div></div>
                        )}
                    </header>
                </Toolbar>
            </AppBar>
            <Main className="main" open={open}>
                <Layout setUserIdState={setUserIdState} />
            </Main>
            <Drawer
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    "& .MuiDrawer-paper": {
                        width: drawerWidth,
                    },
                }}
                variant="persistent"
                anchor="right"
                open={open}
            >
                <DrawerHeader className="drawer-header">
                    <IconButton
                        className="drawer-icon"
                        onClick={handleDrawerClose}
                    >
                        {theme.direction === "rtl" ? (
                            <ChevronLeftIcon />
                        ) : (
                            <ChevronRightIcon />
                        )}
                    </IconButton>
                </DrawerHeader>
                <div className="drawer-container">
                    <div className="drawer-title">
                        <img
                            onClick={handleRefresh}
                            src={refreshIcon}
                            alt="refresh-icon"
                        />
                        <h3>MY BETS</h3>
                    </div>
                    <div
                        className={
                            loading
                                ? "table-container table-flex"
                                : "table-container"
                        }
                    >
                        {loading ? (
                            <img
                                className="small-spinner"
                                src={Spinner}
                                alt="spinner"
                            />
                        ) : (
                            <table className="bets-table">
                                <tr>
                                    <th>STOCK SYMBOL</th>
                                    <th>START PRICE</th>
                                    <th>END PRICE</th>
                                    <th>RESPONSE LENGTH</th>
                                    <th>RESPONSE VALUE</th>
                                    <th className="date">EXPIRATION TIME</th>
                                    <th>OPPONENT</th>
                                    <th>RESULT</th>
                                </tr>
                                {tableData.map((row) => {
                                    const formattedDate = moment(
                                        row.expiration_time
                                    ).format("DD MMM YYYY, h:mm a");

                                    const formatter = new Intl.NumberFormat(
                                        "de-DE",
                                        {
                                            maximumFractionDigits: 2,
                                            minimumFractionDigits: 2,
                                        }
                                    );
                                    const startPriceFormatted =
                                        formatter.format(row.start_price);

                                    let endPriceFormatted = row.end_price;
                                    row.end_price != "PENDING" &&
                                        (endPriceFormatted = formatter.format(
                                            row.end_price
                                        ));

                                    const formattedOpponentNum =
                                        row.opponent === "NONE"
                                            ? "NONE"
                                            : formatPhoneNumber(row.opponent);
                                    return (
                                        <tr>
                                            <td className="td-text">
                                                {row.stock_symbol}
                                            </td>
                                            <td className="td-num">
                                                ${startPriceFormatted}
                                            </td>
                                            <td className="td-num">
                                                {row.end_price === "PENDING"
                                                    ? endPriceFormatted
                                                    : `$${endPriceFormatted}`}
                                            </td>
                                            <td className="td-text">{`${row.response_length} mins`}</td>
                                            <td className="td-text">
                                                {row.response_value}
                                            </td>
                                            <td className="td-num date">
                                                {formattedDate}
                                            </td>
                                            <td className="td-text">
                                                {formattedOpponentNum}
                                            </td>
                                            <td className="td-text">
                                                {row.opponent === "NONE" &&
                                                row.result != "PENDING"
                                                    ? "NONE"
                                                    : row.result}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </table>
                        )}
                    </div>
                </div>
            </Drawer>
        </div>
    );
}
