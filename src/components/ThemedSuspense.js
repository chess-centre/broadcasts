import React from "react";
import Logo from "../assets/logo.png";

export default function ThemedSuspense() {
  return (
    <div className="flex h-screen">
      <div className="m-auto">
        <p className="mb-10">
          <img className="animate-ping" src={Logo} alt="Loading" />
        </p>
        <p className="animate-bounce text-cyan-700">
          Loading...
        </p>
      </div>
    </div>
  );
}
