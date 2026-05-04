import {
  Link,
  isRouteErrorResponse,
  useRouteError,
} from "react-router-dom";
import { ZapOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Shader } from "@/components/ui/shader";

export default function ErrorPage() {
  const error = useRouteError();

  let code = "Error";
  let title = "Algo salió mal";
  let message =
    "Ha ocurrido un error inesperado. Intenta recargar la página o volver al inicio.";

  if (isRouteErrorResponse(error)) {
    code = String(error.status);
    if (error.status === 404) {
      title = "Página no encontrada";
      message = "La ruta que buscas no existe o fue movida.";
    } else if (error.statusText) {
      title = error.statusText;
    }
  } else if (error instanceof Error && error.message) {
    message = error.message;
  }

  return (
    <section className="dark relative min-h-svh w-full overflow-hidden bg-background">
      {/* <Shader /> */}
      <div className="relative z-10 flex min-h-svh items-center justify-center px-4 py-10">
        <div className="flex w-full max-w-md flex-col items-center gap-6">
          

          <div className="flex w-full flex-col items-center gap-y-6 rounded-2xl border border-border/50 bg-card/40 p-8 text-center shadow-2xl backdrop-blur-xl">
            <div className="flex size-16 items-center justify-center rounded-full bg-destructive/10 text-destructive">
              <ZapOff className="size-8" />
            </div>

            <div className="space-y-1">
              <p className="text-xs font-medium tracking-[0.2em] text-muted-foreground uppercase">
                {code}
              </p>
              <h1 className="text-2xl font-semibold text-foreground">
                {title}
              </h1>
            </div>

            <p className="text-sm text-muted-foreground">{message}</p>

            <div className="flex w-full flex-col gap-2 sm:flex-row">
              
              <Button asChild className="w-full">
                <Link to="/">Volver al inicio</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
