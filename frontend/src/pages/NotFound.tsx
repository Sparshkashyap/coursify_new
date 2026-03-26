import { motion } from "framer-motion";
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";
import notFoundImg from "@/assets/undraw_page-not-found_6wni.svg";
import lightIMG from "@/assets/404-error-illustration-svg-download-png-9031789.webp";
import { ToastContainer } from "react-toastify";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="max-w-lg text-center">
        <motion.img
          src={notFoundImg}
          alt="404 illustration"
          className="mx-auto mb-6 w-72 dark:hidden"
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        />

        <motion.img
          src={lightIMG}
          alt="404"
          className="mx-auto hidden w-72 dark:block"
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        />

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="text-5xl font-bold"
        >
          404
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22 }}
          className="mt-3 text-lg text-muted-foreground"
        >
          Oops... the page you're looking for doesn't exist.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 flex justify-center gap-4"
        >
          <Link to="/">
            <Button className="gap-2">
              <Home className="h-4 w-4" />
              Home
            </Button>
          </Link>

          <Button
            variant="outline"
            className="gap-2"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Button>
        </motion.div>
      </div>
      <ToastContainer  autoClose={2000}/>
    </div>
  );
};

export default NotFound;