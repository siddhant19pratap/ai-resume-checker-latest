import { useEffect } from "react";
import { usePuterStore } from "~/lib/puter";
import type { Route } from "./+types/auth";
import { useLocation, useNavigate } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Authentication" },
    { name: "description", content: "Log into Your Account" },
  ];
}

export default function Auth() {
  const { isLoading, auth } = usePuterStore();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Extract next parameter from URL
  const searchParams = new URLSearchParams(location.search);
  const next = searchParams.get("next") || "/";

  // Handle Redirection
  useEffect(() => {
    if (auth.isAuthenticated) {
      navigate(next);
    }
  }, [auth.isAuthenticated, next, navigate]);

  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover bg-center bg-no-repeat min-h-screen flex items-center justify-center">
      <div className="gradient-border-shadow-lg">
        <section className="flex flex-col gap-8 bg-white rounded-2xl p-10">
          <div className="flex flex-col items-center gap-2 text-center">
            <h1>Welcome</h1>
            <h2>Log In to Continue Your Job Journey</h2>
          </div>
          <div> 
            {isLoading? (
                <button className = 'auth-button animate-pulse'>
                    <p> Signing You In</p>
                </button> ) :
                (
                    <>
                    {auth.isAuthenticated? (
                        <button className = 'auth-button' onClick = {auth.signOut}> 
                            <p>Log Out</p>
                        </button>
                    ): (
                        <button className = 'auth-button' onClick = {auth.signIn}> 
                            <p>Log In </p>
                        </button>
                    )}
                    </>
                )}

          </div>
        </section>
      </div>
    </main>
  );
}
