import { useState } from "react";
import { Menu, X } from "lucide-react";
import Button from "./ui/Button";
import Logo from "./Logo";
import {useOutletContext} from "react-router";

const Navbar = () => {
    const { isSignedIn, userName, signIn, signOut } = useOutletContext<AuthContext>()
    const [isOpen, setIsOpen] = useState(false);

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
        <header className={`navbar ${isOpen ? "is-open" : ""}`}>
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
                    {/* Desktop actions: visible on desktop, hidden on mobile/tablet */}
                    <div className="hidden md:flex items-center space-x-4">
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

                    {/* Hamburger Button: visible on mobile/tablet, hidden on desktop */}
                    <button
                        className="mobile-toggle md:hidden flex items-center justify-center p-2 rounded-lg text-zinc-600 hover:text-black hover:bg-zinc-100/50 active:scale-95 transition-all duration-200"
                        onClick={() => setIsOpen(!isOpen)}
                        aria-label="Toggle navigation menu"
                    >
                        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </nav>

            {/* Mobile Dropdown Menu */}
            {isOpen && (
                <div className="mobile-menu md:hidden">
                    <ul className="mobile-links">
                        <li><a href="#" onClick={() => setIsOpen(false)}>Product</a></li>
                        <li><a href="#" onClick={() => setIsOpen(false)}>Pricing</a></li>
                        <li><a href="#" onClick={() => setIsOpen(false)}>Community</a></li>
                        <li><a href="#" onClick={() => setIsOpen(false)}>Enterprise</a></li>
                    </ul>
                    
                    <div className="mobile-actions">
                        {import.meta.env.DEV && (
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={async () => {
                                    setIsOpen(false);
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
                                style={{ width: "100%", justifyContent: "center", marginBottom: "12px", borderColor: "var(--border)", color: "var(--foreground)" }}
                                className="w-full"
                            >
                                Sync Worker
                            </Button>
                        )}
                        {isSignedIn ? (
                            <div className="mobile-user-info">
                                <span className="greeting">
                                    {userName ? `Hi, ${userName}` : 'Signed in'}
                                </span>
                                <Button size="sm" onClick={() => { setIsOpen(false); handleAuthClick(); }} className="btn w-full justify-center">
                                    Log Out
                                </Button>
                            </div>
                        ) : (
                            <div className="mobile-auth-buttons">
                                <Button 
                                    onClick={() => { setIsOpen(false); handleAuthClick(); }} 
                                    size="sm" 
                                    variant="ghost"
                                    className="w-full justify-center"
                                >
                                    Log In
                                </Button>
                                <a 
                                    href="#upload" 
                                    onClick={() => setIsOpen(false)} 
                                    className="cta w-full text-center"
                                >
                                    Get Started
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
};

export default Navbar;