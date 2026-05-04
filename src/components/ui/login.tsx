import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Shader } from "./shader";

interface Login1Props {
  heading?: string;
  logo?: {
    url: string;
    src: string;
    alt: string;
    title?: string;
    className?: string;
  };
  buttonText?: string;
  googleText?: string;
  signupText?: string;
  signupUrl?: string;
  signupCta?: string;
  className?: string;
}

const Login1 = ({
  heading = "Bienvenido",
  logo,
  buttonText = "Login",
  signupText = "¿No tienes cuenta?",
  signupUrl = "#",
  signupCta = "Regístrate",
  className,
}: Login1Props) => {
  const LogoMark = logo ? (
    <img
      src={logo.src}
      alt={logo.alt}
      title={logo.title}
      className={cn("h-20 w-auto", logo.className)}
    />
  ) : null;

  return (
    <section
      className={cn(
        "dark relative min-h-svh w-full overflow-hidden bg-background",
        className
      )}
    >
      <Shader />
      <div className="relative z-10 flex min-h-svh items-center justify-center px-4 py-10">
        <div className="flex w-full max-w-sm flex-col items-center gap-6">
          {logo &&
            (logo.url ? (
              <a href={logo.url} className="inline-flex">
                {LogoMark}
              </a>
            ) : (
              LogoMark
            ))}

          <div className="flex w-full flex-col items-center gap-y-5 rounded-2xl border border-border/50 bg-card/40 p-8 shadow-2xl backdrop-blur-xl">
            {heading && (
              <h1 className="text-xl font-semibold text-foreground">
                {heading}
              </h1>
            )}
            <Input type="email" placeholder="Email" required />
            <Input type="password" placeholder="Contraseña" required />
            <Button type="submit" className="w-full">
              {buttonText}
            </Button>
          </div>

          {/* <div className="flex justify-center gap-1 text-sm text-muted-foreground">
            <p>{signupText}</p>
            <a
              href={signupUrl}
              className="font-medium text-primary hover:underline"
            >
              {signupCta}
            </a>
          </div> */}
        </div>
      </div>
    </section>
  );
};

export { Login1 };
