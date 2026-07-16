import Button from "./ui/Button";
import Logo from "./Logo";
import {useOutletContext} from "react-router";

const Navbar = () => {
    const { isSignedIn, userName, signIn, signOut } = useOutletContext<AuthContext>()

    const handleAuthClick = async () => {
        if(isSignedIn) {
            try {
                await signOut();
            } catch (e) {
                console.error(`Puter sign out failed: ${e}`);
            }

            return;
        }

        try {
            await signIn();
        } catch (e) {
            console.error(`Puter sign in failed: ${e}`);
        }
    };

    return (
        <header className="navbar">
            <nav className="inner">
                <div className="left">
                    <div className="brand">
                        <Logo className="logo" />

                        <span className="name">
                            Sketch2Space
                        </span>
                    </div>

                    <ul className="links">
                        <a href="#">Product</a>
                        <a href="#">Pricing</a>
                        <a href="#">Community</a>
                        <a href="#">Enterprise</a>
                    </ul>
                </div>

                <div className="actions">
                    {import.meta.env.DEV && (
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={async () => {
                                try {
                                    const res = await fetch("/lib/puter.worker.js");
                                    if (!res.ok) throw new Error("Could not load worker source file");
                                    const code = await res.text();
                                    const puter = (await import("@heyputer/puter.js")).default;
                                    await puter.fs.write("puter.worker.js", code);
                                    await puter.workers.create("lively-room-7530", "puter.worker.js");
                                    alert("Puter worker successfully updated in your account!");
                                } catch (err: any) {
                                    alert("Worker sync failed: " + err.message);
                                }
                            }}
                            style={{ marginRight: "10px", borderColor: "var(--border)", color: "var(--foreground)" }}
                        >
                            Sync Worker
                        </Button>
                    )}
                    {isSignedIn ? (
                        <>
                            <span className="greeting">
                                {userName ? `Hi, ${userName}` : 'Signed in'}
                            </span>

                            <Button size="sm" onClick={handleAuthClick} className="btn">
                                Log Out
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button onClick={handleAuthClick} size="sm" variant="ghost">
                                Log In
                            </Button>

                            <a href="#upload" className="cta">Get Started</a>
                        </>
                    )}
                </div>
            </nav>
        </header>
    )
}

export default Navbar