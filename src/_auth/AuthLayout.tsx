import { Outlet, Navigate } from "react-router-dom";
import { useEffect } from "react";

const collageImages = Array.from({ length: 11 }, (_, i) => `/assets/images/collage/img${i + 1}.jpg`);

export default function AuthLayout() {
  const isAuthenticated = false;

  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      @keyframes scrollY {
        0% { transform: translateY(0); }
        100% { transform: translateY(-50%); }
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <>
      {isAuthenticated ? (
        <Navigate to="/" />
      ) : (
        <div className="flex w-full h-screen overflow-hidden bg-black">
          {/* Left side for content */}
          <section className="flex-1 flex justify-center items-center">
            <Outlet />
          </section>

          {/* Right side for slanted, smooth, infinite scroll collage */}
          <div className="w-1/2 h-full relative overflow-hidden bg-black">
            <div className="absolute w-full h-full origin-top-right rotate-[12deg]">
              <div
                className="animate-scroll"
                style={{
                  animation: "scrollY 40s linear infinite",
                }}
              >
                <div>
                  {[...collageImages, ...collageImages].map((src, idx) => (
                    <img
                      key={idx}
                      src={src}
                      alt={`collage-img-${idx}`}
                      className="w-full object-cover block"
                      style={{ display: "block" }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
