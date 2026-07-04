import React from 'react'
import { useOutletContext } from 'react-router'

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
        <header className='navbar'>
            <nav className='inner'>
                <div className='left'>
                    <div className="brand flex items-center">
                        <img
                            src="/logo.png"
                            alt="Sketch2Space Logo"
                            className="w-10 h-12 object-contain"
                        />
                        <span className="name text-xl">Sketch2Space</span>
                    </div>
                    <ul className='links'>
                        <a href="#">Products</a>
                        <a href="">Pricing</a>
                        <a href="">Community</a>
                        <a href="#">Enterprise</a>
                    </ul>
                </div>
                <div className='actions'>
                    {isSignedIn ? (
                        <>
                            <span className='greeting'>{userName ? `Hi, ${userName}` : 'Signed In'}</span>
                            <button onClick={handleAuthClick} className="cta btn btn-sm">  Logout</button>
                        </>
                    ) : (
                        <>
                            <button onClick={handleAuthClick}
                                className='login border border-black rounded-md p-1'>Login
                            </button>
                            <a href="#upload" className='cta'>Get Started</a>
                        </>
                    )}
                </div>
            </nav>
        </header>
    )
}

export default Navbar