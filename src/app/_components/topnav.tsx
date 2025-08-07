import { SignedIn, SignedOut, SignInButton, SignOutButton, UserButton } from "@clerk/nextjs";

export default function TopNav() {
    return (
        <nav className="bg-yellow-900 p-4 text-white flex justify-between items-center">
            <div>NOTE.ME</div>
            <div>
                <SignedIn>
                    <div className="cursor-pointer">
                        <UserButton />
                    </div>
                </SignedIn>
                <SignedOut>
                    <SignInButton>
                        <div className="cursor-pointer">Sign In</div>
                    </SignInButton>
                </SignedOut>
            </div>
        </nav>
    );
}