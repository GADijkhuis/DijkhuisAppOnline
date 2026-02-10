import {
    Button,
    Dialog,
    DialogActions,
    DialogBody, DialogContent,
    DialogSurface, DialogTitle,
    DialogTrigger,
    Input,
    Label, MessageBar, MessageBarActions, MessageBarBody, MessageBarTitle, Spinner
} from "@fluentui/react-components";
import {DismissRegular} from "@fluentui/react-icons";
import {useEffect, useState} from "react";
import {isUserAuthenticated, signInUser} from "../handlers/supaclient";

const Container = ({ children }) => {

    const [isLoading, setIsLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [signInError, setSignInError] = useState(null);

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {
        setIsLoading(true);
        isUserAuthenticated().then((result) => {
            setIsLoading(false);
            setIsLoggedIn(result === true);
        });
    }, []);

    const handleLogIn = async (e) => {
        e.preventDefault();
        if (!username || !password) return;

        let formattedUser = username;

        if (!formattedUser.endsWith("@gadijkhuis.nl")) {
            formattedUser += "@gadijkhuis.nl";
        }

        if (formattedUser !== process.env.REACT_APP_SUPABASE_ADMIN_LOGIN) {
            setSignInError("Invalid credentials");
            setIsLoggedIn(false);
            return;
        }

        const result = await signInUser(formattedUser, password);

        if (result !== true) {
            setSignInError("Invalid credentials");
            setIsLoggedIn(false);
            return;
        }

        window.location.reload();
    };

    return (
        <>
            {isLoading && <Spinner />}

            {!isLoading && !isLoggedIn && (
                <div className="container">
                    <Dialog modalType="non-modal">
                        <DialogTrigger>
                            <Button as={"a"} appearance={"primary"}>Inloggen</Button>
                        </DialogTrigger>
                        <DialogSurface>
                            <form onSubmit={(e) => handleLogIn(e)}>
                                <DialogBody>
                                    <DialogTitle>Log in met Dijkhuis Admin Account</DialogTitle>

                                    <DialogContent className="dialog-content">
                                        {signInError && (
                                            <MessageBar intent="error">
                                                <MessageBarBody>
                                                    <MessageBarTitle>{signInError}</MessageBarTitle>
                                                </MessageBarBody>
                                                <MessageBarActions>
                                                    <Button
                                                        as={"a"}
                                                        appearance="subtle"
                                                        icon={<DismissRegular />}
                                                        onClick={() => setSignInError(null)}
                                                    />
                                                </MessageBarActions>
                                            </MessageBar>
                                        )}

                                        <Label required htmlFor="username">Gebruikersnaam of email:</Label>
                                        <Input
                                            id="username"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            required
                                        />

                                        <Label required htmlFor="password">Wachtwoord:</Label>
                                        <Input
                                            id="password"
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                    </DialogContent>

                                    <DialogActions>
                                        <Button as={"button"} type="submit" appearance="primary">Inloggen</Button>
                                        <DialogTrigger disableButtonEnhancement>
                                            <Button as={"a"} appearance="secondary">Sluiten</Button>
                                        </DialogTrigger>
                                    </DialogActions>
                                </DialogBody>
                            </form>
                        </DialogSurface>
                    </Dialog>
                </div>
            )}

            {!isLoading && isLoggedIn && (
                <div className="container">
                    {children}
                </div>
            )}
        </>
    );
};

export default Container;
