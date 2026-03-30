import React from "react";

const HomeFooter = () => {
  return (
    <footer className="py-6 px-4 bg-primary">
      <div className="max-w-7xl mx-auto text-center flex justify-between items-center">
        <p className="text-sm text-white font-medium">
          &copy; {new Date().getFullYear()} Lele Farm. All rights reserved.
        </p>
        <p className="text-sm text-white mt-2">
          Dibuat dengan 🎀 oleh Tim Lele Farm
        </p>
      </div>
    </footer>
  );
};

export default HomeFooter;
