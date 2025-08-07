import { SignedIn, SignedOut, SignInButton, SignOutButton, UserButton } from "@clerk/nextjs";

// Top navigation bar component
export default function TopNav() {
    return (
        <nav className="bg-gray-800 p-4 text-white flex justify-between items-center">
            {/* App title */}
            <div>IT315</div>
            <div>
                {/* Show user button if signed in */}
                <SignedIn>
                    <div className="cursor-pointer">
                        <UserButton />
                    </div>
                </SignedIn>
                {/* Show sign in button if signed out */}
                <SignedOut>
                    <SignInButton>
                        <div className="cursor-pointer">Sign In</div>
                    </SignInButton>
                </SignedOut>
            </div>
        </nav>
    );
}