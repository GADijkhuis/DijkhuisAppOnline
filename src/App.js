import './App.css';
import {HashRouter as Router, Routes, Route} from "react-router-dom";
import TimeRegistration from "./pages/TimeRegistration";
import {
    Button,
    Dialog, DialogActions,
    DialogSurface, DialogTitle,
    DialogTrigger,
    FluentProvider,
    webDarkTheme,
} from "@fluentui/react-components";
import {isUserAuthenticated, signOutUser} from "./handlers/supaclient";
import {useEffect, useState} from "react";

function App() {
    const packageJson = require('../package.json');
    const [loggedIn, setLoggedIn] = useState(false);

    async function signOut() {
        await signOutUser();
        window.location.reload();
    }

    useEffect(() => {
        isUserAuthenticated().then((result) => {
            setLoggedIn(result);
        })
    }, [])

    return (
        <FluentProvider theme={webDarkTheme}>
            <Router>
                <nav className={"App-nav"}>
                    { loggedIn &&
                        <>
                            <Dialog>
                                <DialogTrigger>

                                    <Button as={"a"} appearance={"secondary"}>
                                        Uitloggen
                                    </Button>
                                </DialogTrigger>
                                <DialogSurface>
                                    <DialogTitle>
                                        Weet u zeker dat u wilt uitloggen?
                                    </DialogTitle>
                                    <DialogActions>
                                        <DialogTrigger disableButtonEnhancement>
                                            <Button as={"a"} appearance={"primary"} onClick={async () => { await signOut() }}>Uitloggen</Button>
                                        </DialogTrigger>
                                        <DialogTrigger disableButtonEnhancement>
                                            <Button as={"a"} appearance={"secondary"}>Annuleren</Button>
                                        </DialogTrigger>
                                    </DialogActions>
                                </DialogSurface>
                            </Dialog>
                        </>
                    }
                    <p>Versie: {packageJson.version}</p>
                </nav>
                <Routes>
                    <Route path="/" element={ <TimeRegistration/> }/>
                    <Route path=":week" element={ <TimeRegistration/> }/>
                </Routes>
            </Router>
        </FluentProvider>
      );
}

export default App;
