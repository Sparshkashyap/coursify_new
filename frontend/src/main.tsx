import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { GoogleOAuthProvider } from "@react-oauth/google";

createRoot(document.getElementById("root")!).render(

<GoogleOAuthProvider clientId="766274474471-1hiu6h15n16g4otn1fsuhk486c8cikuq.apps.googleusercontent.com">

  <App />

</GoogleOAuthProvider>

);
